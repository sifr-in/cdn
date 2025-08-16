class DexieDBManager {
 constructor() {
  this.dbCache = new Map();
  this.versionCache = new Map();
  this.operationQueue = new Map(); // Queue for each database
  this.maxRetries = 3; // Maximum retry attempts for locked DB
  this.retryDelay = 100; // Initial delay between retries in ms
 }
 // Helper method to queue operations
 async queueOperation(dbName, operation) {
  if (!this.operationQueue.has(dbName)) {
    this.operationQueue.set(dbName, Promise.resolve());
  }
  
  const queue = this.operationQueue.get(dbName);
  const result = queue.then(() => operation());
  this.operationQueue.set(dbName, result.catch(() => {}));
  return result;
 }
 async insertToDexie(dbName, tableName, jsonArray, fewColumns = false, compoundIndexFields = null) {
    return this.queueOperation(dbName, async () => {
      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          const db = this.dbCache.get(dbName);
          if (!db) throw new Error("Database not initialized");
          
          const cleanTableName = this.getActualTableName(tableName);
          const table = db.table(cleanTableName);
          if (!table) throw new Error(`Table ${cleanTableName} not found`);
          
          const records = Array.isArray(jsonArray) ? jsonArray : [jsonArray];
          
          if (fewColumns && compoundIndexFields) {
            // For partial updates with dynamic compound index
            for (const record of records) {
              // Build where clause dynamically
              const whereClause = {};
              for (const field of compoundIndexFields) {
                if (record[field] === undefined) {
                  throw new Error(`Missing compound index field: ${field}`);
                }
                whereClause[field] = record[field];
              }

              // Find existing record using dynamic compound index
              const existing = await table.where(whereClause).first();

              if (existing) {
                // Merge and preserve the auto-increment key
                await table.put({
                  ...existing,
                  ...record,
                  a: existing.a // Preserve existing auto-increment key
                });
              } else {
                // For new records, let Dexie auto-generate the 'a' field
                await table.add(record);
              }
            }
          } else {
            // For full records or simple cases, use bulkPut
            await table.bulkPut(records);
          }

          return { success: true, count: records.length };
        } catch (error) {
          if (error.message.includes('locked') && attempt < this.maxRetries) {
            await new Promise(resolve => 
              setTimeout(resolve, this.retryDelay * attempt));
            continue;
          }
          console.error("Insert failed:", error);
          return { success: false, error: error.message };
        }
      }
    });
  }
 async updateDbSchema(dbName, schemaUpdates) {
  return this.queueOperation(dbName, async () => {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        let db = this.dbCache.get(dbName) || new Dexie(dbName);
        const currentVersion = this.versionCache.get(dbName) || 1;
        const newVersion = currentVersion + 1;

        if (db.isOpen()) await db.close();

        // 1. Get all existing schemas from localStorage
        const allSchemas = JSON.parse(localStorage.getItem("my1_in_indexedDBs") || "[]");
        const mergedSchema = {};

        // 2. First, load ALL existing tables (to prevent deletion)
        for (const schema of allSchemas) {
          const tableName = schema.tb;
          const actualName = tableName.includes('~') ? tableName.replace('~', '') : tableName;
          mergedSchema[actualName] = schema.ix; // Preserve existing schema
        }

        // 3. Apply updates (new or modified tables) without removing any
        for (const { tableName, schema } of schemaUpdates) {
          mergedSchema[tableName] = schema; // Override if exists, or add new
        }

        // 4. Proceed with version update
        const tempDb = new Dexie(dbName);
        tempDb.version(newVersion).stores(mergedSchema);

        try {
          await tempDb.open();
          if (db && db.isOpen()) await db.close();
          this.dbCache.set(dbName, tempDb);
          this.versionCache.set(dbName, newVersion);
          return;
        } catch (openError) {
          await tempDb.close();
          throw openError;
        }
      } catch (error) {
        if (error.message.includes('locked') && attempt < this.maxRetries) {
          await new Promise(resolve => 
            setTimeout(resolve, this.retryDelay * attempt));
          continue;
        }
        console.error('Failed to update database schema:', error);
        throw error;
      }
    }
  });
}
 async handleNwTables(loaderId, dbName, tableNames) {
  if (typeof document !== 'undefined') {
    const loader = document.getElementById(loaderId);
    if (loader) loader.style.display = 'block';
  }

  try {
   // Process all tables (try access first, create if needed)
   const { results, successCount, failureCount } = await this.processTables(dbName, tableNames);

   if (failureCount > 0) {
    console.error("Failed tables:", results.filter(r => r.status === 'failed'));
   }

   return { successCount, failureCount, results };
  } catch (error) {
   console.error('Global error in handleNwTables:', error);
   return {
    successCount: 0,
    failureCount: tableNames.length,
    results: [{ status: 'failed', message: `Global error: ${error.message}` }],
    error: error.message
   };
  } finally {
if (typeof document !== 'undefined') {
  const loader = document.getElementById(loaderId);
  if (loader) loader.style.display = 'none';
}
  }
 }
 async processTables(dbName, tableNames) {
  const results = [];
  let successCount = 0;
  let failureCount = 0;
  const tablesToCreate = [];

  // First try to access each table
  for (const tableName of tableNames) {
   const actualTableName = this.getActualTableName(tableName);
   try {
    const exists = await this.checkTableExists(dbName, actualTableName);
    if (exists) {
     results.push({
      table: actualTableName,
      status: 'exists',
      message: 'Table already exists'
     });
     successCount++;
    } else {
     tablesToCreate.push(tableName);
    }
   } catch (error) {
    console.error(`Error checking table ${actualTableName}:`, error);
    tablesToCreate.push(tableName);
   }
  }

  // Process tables that need creation
  if (tablesToCreate.length > 0) {
   const creationResults = await this.createTables(dbName, tablesToCreate);
   results.push(...creationResults.results);
   successCount += creationResults.successCount;
   failureCount += creationResults.failureCount;
  }

  return { results, successCount, failureCount };
 }
 async checkTableExists(dbName, tableName) {
  try {
   let db = this.dbCache.get(dbName);
   if (!db) {
    db = new Dexie(dbName);
    await db.open().catch(() => { });
    this.dbCache.set(dbName, db);
   }

   if (!db.isOpen()) {
    await db.open();
   }

   return db.table(tableName) !== undefined;
  } catch (error) {
   console.error(`Error checking if table ${tableName} exists:`, error);
   return false;
  }
 }
 async createTables(dbName, tableNames) {
  const localStorageKey = "my1_in_indexedDBs";
  const storedSchemas = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  const results = [];
  let successCount = 0;
  let failureCount = 0;
  const schemaUpdates = [];

  for (const tableName of tableNames) {
    const [baseName, suffix] = tableName.includes('~') ? tableName.split('~') : [tableName, null];
    const actualTableName = suffix ? `${baseName}${suffix}` : tableName;

    try {
      const schema = await this.getSchema(baseName, storedSchemas);
      if (schema) {
        schemaUpdates.push({
          tableName: actualTableName,
          schema: schema.ix
        });

        // 🔥 Key Fix: Update localStorage to include the new table
        const newSchemaEntry = { tb: actualTableName, ix: schema.ix };
        if (!storedSchemas.some(s => s.tb === actualTableName)) {
          storedSchemas.push(newSchemaEntry);
          localStorage.setItem(localStorageKey, JSON.stringify(storedSchemas));
        }
      } else {
        throw new Error(`No schema found for ${baseName}`);
      }
    } catch (error) {
      results.push({
        table: actualTableName,
        status: 'failed',
        message: error.message
      });
      failureCount++;
    }
  }

  if (schemaUpdates.length > 0) {
    try {
      await this.updateDbSchema(dbName, schemaUpdates);
      schemaUpdates.forEach(update => {
        results.push({
          table: update.tableName,
          status: 'created',
          message: 'Table created successfully'
        });
        successCount++;
      });
    } catch (error) {
      schemaUpdates.forEach(update => {
        results.push({
          table: update.tableName,
          status: 'failed',
          message: `Creation failed: ${error.message}`
        });
        failureCount++;
      });
    }
  }

  return { results, successCount, failureCount };
}
 async getSchema(tableKey, storedSchemas) {
  // 1. Check local storage
  let schema = storedSchemas.find(s => s.tb === tableKey);
  if (schema) return schema;

  // 2. Fetch from remote if not found locally
  try {
   const response = await fetch("https://cdn.jsdelivr.net/gh/sifr-in/cdn@0d29b8e/cmn/my1xi.da");
   if (response.ok) {
    const remoteSchemas = await response.json();
    schema = Array.isArray(remoteSchemas)
     ? remoteSchemas.find(s => s.tb === tableKey)
     : remoteSchemas.tb === tableKey ? remoteSchemas : null;

    if (schema) {
     // Update local storage
     storedSchemas.push(schema);
     localStorage.setItem("my1_in_indexedDBs", JSON.stringify(storedSchemas));
    }
    return schema;
   }
  } catch (error) {
   console.error("Error fetching remote schema:", error);
   throw new Error(`Could not retrieve schema for ${tableKey}`);
  }

  throw new Error(`Schema not found for ${tableKey}`);
 }
 getActualTableName(tableName) {
  return tableName.includes('~') ?
   tableName.replace('~', '') :
   tableName;
 }
 async processNotificationPayload(payload) {
    const result = {
      success: [],
      failed: [],
      message: 'Processing completed'
    };

    try {
      if (!payload?.data) {
        throw new Error('Invalid payload: missing data field');
      }

      const { data } = payload;
      
      let tablesData;
      try {
        tablesData = JSON.parse(data.tbs);
        if (!Array.isArray(tablesData)) {
          throw new Error('tbs data is not an array');
        }
      } catch (e) {
        throw new Error(`Failed to parse tbs data: ${e.message}`);
      }

      const dbName = `my1_in_${data.tn}_${data.tp}_${data.fi}_${data.fk}`;

      for (const tableData of tablesData) {
        const tableName = tableData.tb;
        const records = tableData.ros || [];
        const compoundIndexFields = tableData.i_x ? tableData.i_x.split(',') : null;

        if (!tableName) {
          result.failed.push({
            table: 'unknown',
            reason: 'Missing table name in payload',
            records: []
          });
          continue;
        }

        try {
          // Ensure table exists
          await this.handleNwTables(null, dbName, [tableName]);

          // Process as partial updates (fewColumns=true)
          const insertResult = await this.insertToDexie(
            dbName,
            tableName,
            records,
            true, // fewColumns
            compoundIndexFields // Pass the dynamic compound index fields
          );

          if (insertResult.success) {
            result.success.push({
              table: tableName,
              count: records.length,
              status: 'processed'
            });
          } else {
            throw new Error(insertResult.error);
          }
        } catch (error) {
          result.failed.push({
            table: tableName,
            reason: error.message,
            records: records
          });
        }
      }
    } catch (error) {
      console.error('Error in processNotificationPayload:', error);
      result.error = error.message;
      result.message = 'Processing failed';
    }

    return result;
  }
 async getMaxDateRecords(dbName, queries) {
    return this.queueOperation(dbName, async () => {
        const results = [];
        const db = this.dbCache.get(dbName);
        if (!db) throw new Error("Database not initialized");

        for (const query of queries) {
            try {
                const cleanTableName = this.getActualTableName(query.tb);
                const table = db.table(cleanTableName);
                if (!table) {
                    results.push({
                        tb: cleanTableName,
                        cl: query.cl || query.col,
                        la: "1970-01-01 00:00",
                        error: `Table ${cleanTableName} not found`
                    });
                    continue;
                }

                // Try to use index if available for better performance
                let maxRecord;
                if (table.schema.indexes.some(idx => idx.key === query.col)) {
                    // If the column is indexed, we can use the index directly
                    maxRecord = await table.orderBy(query.col).last();
                } else {
                    // If not indexed, we need to scan all records
                    const allRecords = await table.toArray();
                    if (allRecords.length > 0) {
                        maxRecord = allRecords.reduce((max, record) => 
                            record[query.col] > max[query.col] ? record : max
                        );
                    }
                }

                if (maxRecord && maxRecord[query.col]) {
                    results.push({
                        tb: cleanTableName.split('_').pop(), // Return just the table key
                        cl: query.cl || query.col,
                        la: maxRecord[query.col]
                    });
                } else {
                    results.push({
                        tb: cleanTableName.split('_').pop(),
                        cl: query.cl || query.col,
                        la: "1970-01-01 00:00",
                        error: 'No records found or no date value'
                    });
                }
            } catch (error) {
                const cleanTableName = this.getActualTableName(query.tb);
                results.push({
                    tb: cleanTableName.split('_').pop(),
                    cl: query.cl || query.col,
                    la: "1970-01-01 00:00",
                    error: error.message
                });
            }
        }

        return results;
    });
}
 async getAllRecords(dbName, tableName, limit) {
    return this.queueOperation(dbName, async () => {
      try {
        const db = this.dbCache.get(dbName);
        if (!db) throw new Error("Database not initialized");

        const cleanTableName = this.getActualTableName(tableName);
        const table = db.table(cleanTableName);
        if (!table) throw new Error(`Table ${cleanTableName} not found`);

        // Get all records by default, apply limit if specified
        const collection = table.toCollection();
        return limit ? await collection.limit(limit).toArray() 
                     : await collection.toArray();
      } catch (error) {
        console.error(`Error getting records from ${tableName}:`, error);
        throw error;
      }
    });
  }
async getRcrdsByCompound(
  dbName, 
  tableName, 
  indxNm, 
  searchConditions,
  debug = false
) {
  return dbDexieManager.queueOperation(dbName, async () => {
    const db = dbDexieManager.dbCache.get(dbName);
    if (!db) throw new Error("Database not initialized");

    const cleanTableName = dbDexieManager.getActualTableName(tableName);
    const table = db.table(cleanTableName);
    
    if (debug) {
      console.log('Table schema:', table.schema);
      console.log('Search conditions:', searchConditions);
    }

    // Parse compound index parts
    const indexParts = indxNm.replace(/[\[\]&]/g, '').split('+');
    const searchField = Object.keys(searchConditions)[0];
    const fieldPos = indexParts.indexOf(searchField);

    if (fieldPos === -1) {
      throw new Error(`Search field ${searchField} not found in index`);
    }

    // CORRECTED: Build proper bounds array
    const lowerBound = Array(indexParts.length).fill(Dexie.minKey);
    const upperBound = Array(indexParts.length).fill(Dexie.maxKey);
    lowerBound[fieldPos] = searchConditions[searchField];
    upperBound[fieldPos] = searchConditions[searchField];

    if (debug) {
      console.log('Correct bounds:', { lowerBound, upperBound });
      console.log('Index parts:', indexParts);
    }

    // Execute query
    const records = await table
      .where(indxNm)
      .between(lowerBound, upperBound, true, true)
      .toArray();

    if (debug) {
      console.log('Found records:', records);
      if (records.length === 0) {
        const allWithG = await table.where('g').equals(searchConditions.g).toArray();
        console.log('Records with matching g:', allWithG);
      }
    }

    return records;
  });
}
}


const dbDexieManager = new DexieDBManager();






