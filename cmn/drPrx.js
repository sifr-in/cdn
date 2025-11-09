// Global cache storage - persists across all websites using this script
class GlobalDriveCache {
    constructor() {
        this.cacheName = 'global-drive-cache-v1';
        this.maxCacheSize = 100 * 1024 * 1024; // 100MB max cache size
        this.currentCacheSize = 0;
        this.init();
    }

    async init() {
        // Initialize cache size tracking
        await this.calculateCacheSize();
    }

    // Generate cache key from file ID and URL
    generateCacheKey(fileId, url) {
        return `drive-file-${fileId}-${btoa(url).slice(0, 20)}`;
    }

    // Calculate current cache size
    async calculateCacheSize() {
        try {
            const cache = await caches.open(this.cacheName);
            const keys = await cache.keys();
            let totalSize = 0;

            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
            this.currentCacheSize = totalSize;
        } catch (error) {
            console.warn('Cache size calculation failed:', error);
        }
    }

    // Check if file exists in cache
    async getFromCache(fileId, url) {
        try {
            const cache = await caches.open(this.cacheName);
            const cacheKey = this.generateCacheKey(fileId, url);
            const response = await cache.match(cacheKey);

            if (response) {
                const blob = await response.blob();
                console.log(`✅ Serving from cache: ${fileId} (${this.formatFileSize(blob.size)})`);
                
                // Update last accessed timestamp
                await this.updateAccessTime(cache, cacheKey, response);
                
                return blob;
            }
            return null;
        } catch (error) {
            console.warn('Cache read error:', error);
            return null;
        }
    }

    // Store file in cache
    async setToCache(fileId, url, blob) {
        try {
            // Check cache size limit
            if (this.currentCacheSize + blob.size > this.maxCacheSize) {
                await this.evictOldEntries();
            }

            const cache = await caches.open(this.cacheName);
            const cacheKey = this.generateCacheKey(fileId, url);
            
            const headers = new Headers();
            headers.set('Content-Type', blob.type);
            headers.set('Content-Length', blob.size.toString());
            headers.set('X-Cache-Timestamp', Date.now().toString());
            headers.set('X-Cache-FileId', fileId);
            headers.set('X-Cache-Original-URL', url);

            const response = new Response(blob, { headers });
            await cache.put(cacheKey, response);
            
            this.currentCacheSize += blob.size;
            console.log(`💾 Cached: ${fileId} (${this.formatFileSize(blob.size)})`);
            
        } catch (error) {
            console.warn('Cache write error:', error);
        }
    }

    // Update access time for cache entry
    async updateAccessTime(cache, cacheKey, response) {
        try {
            const blob = await response.blob();
            const headers = new Headers(response.headers);
            headers.set('X-Cache-Last-Accessed', Date.now().toString());
            
            const newResponse = new Response(blob, { headers });
            await cache.put(cacheKey, newResponse);
        } catch (error) {
            console.warn('Cache update error:', error);
        }
    }

    // Evict old cache entries when limit is reached
    async evictOldEntries() {
        try {
            const cache = await caches.open(this.cacheName);
            const keys = await cache.keys();
            const entries = [];

            // Collect all cache entries with metadata
            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const lastAccessed = response.headers.get('X-Cache-Last-Accessed') || 
                                       response.headers.get('X-Cache-Timestamp');
                    const blob = await response.blob();
                    
                    entries.push({
                        request,
                        response,
                        size: blob.size,
                        lastAccessed: parseInt(lastAccessed) || 0
                    });
                }
            }

            // Sort by last accessed (oldest first)
            entries.sort((a, b) => a.lastAccessed - b.lastAccessed);

            // Remove oldest entries until under limit
            let removedSize = 0;
            const targetSize = this.maxCacheSize * 0.7; // Reduce to 70% of max

            while (this.currentCacheSize - removedSize > targetSize && entries.length > 0) {
                const entry = entries.shift();
                await cache.delete(entry.request);
                removedSize += entry.size;
                console.log(`🗑️ Evicted cache entry: ${entry.size} bytes`);
            }

            this.currentCacheSize -= removedSize;
        } catch (error) {
            console.warn('Cache eviction error:', error);
        }
    }

    // Clear entire cache
    async clearCache() {
        try {
            await caches.delete(this.cacheName);
            this.currentCacheSize = 0;
            console.log('🧹 Global cache cleared');
        } catch (error) {
            console.warn('Cache clear error:', error);
        }
    }

    // Get cache statistics
    async getCacheStats() {
        try {
            const cache = await caches.open(this.cacheName);
            const keys = await cache.keys();
            let totalSize = 0;
            const fileTypes = {};

            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                    
                    const fileId = response.headers.get('X-Cache-FileId');
                    const type = blob.type || 'unknown';
                    fileTypes[type] = (fileTypes[type] || 0) + 1;
                }
            }

            return {
                totalFiles: keys.length,
                totalSize: totalSize,
                formattedSize: this.formatFileSize(totalSize),
                fileTypes: fileTypes
            };
        } catch (error) {
            console.warn('Cache stats error:', error);
            return null;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Global cache instance - shared across all websites using this script
const globalDriveCache = new GlobalDriveCache();

/**
 * Enhanced function to fetch Google Drive files with caching
 */
async function getDriveFileAsBlob(googleDriveUrl, proxyUrl, useCache = true) {
    const fileId = extractGoogleDriveFileId(googleDriveUrl);
    
    if (!fileId) {
        throw new Error('Could not extract File ID from the provided Google Drive URL.');
    }

    // Try cache first if enabled
    if (useCache) {
        const cachedBlob = await globalDriveCache.getFromCache(fileId, googleDriveUrl);
        if (cachedBlob) {
            return cachedBlob;
        }
    }

    // Fetch from proxy if not in cache
    const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            fileId: fileId,
            originalUrl: googleDriveUrl
        })
    });

    if (!response.ok) {
        throw new Error(`Proxy error: ${response.statusText}`);
    }

    const blob = await response.blob();
    
    // Store in cache for future requests
    if (useCache) {
        await globalDriveCache.setToCache(fileId, googleDriveUrl, blob);
    }

    return blob;
}

/**
 * Enhanced multiple file fetch with caching
 */
async function getMultipleDriveFilesAsBlobs(googleDriveUrls, proxyUrl, useCache = true) {
    const results = {
        success: [],
        failed: [],
        fromCache: 0,
        fromNetwork: 0
    };

    const fileRequests = googleDriveUrls.map(url => ({
        url,
        fileId: extractGoogleDriveFileId(url),
        isValid: !!extractGoogleDriveFileId(url)
    }));

    // Handle invalid URLs
    fileRequests.filter(req => !req.isValid).forEach(req => {
        results.failed.push({
            url: req.url,
            error: 'Invalid Google Drive URL format'
        });
    });

    const validRequests = fileRequests.filter(req => req.isValid);

    // Process requests
    for (const request of validRequests) {
        try {
            let blob;
            let fromCache = false;

            // Try cache first
            if (useCache) {
                blob = await globalDriveCache.getFromCache(request.fileId, request.url);
                if (blob) {
                    fromCache = true;
                    results.fromCache++;
                }
            }

            // Fetch from network if not in cache
            if (!blob) {
                const response = await fetch(proxyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        fileId: request.fileId,
                        originalUrl: request.url
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                blob = await response.blob();
                results.fromNetwork++;

                // Cache the result
                if (useCache) {
                    await globalDriveCache.setToCache(request.fileId, request.url, blob);
                }
            }

            results.success.push({
                url: request.url,
                fileId: request.fileId,
                blob: blob,
                size: blob.size,
                type: blob.type,
                fromCache: fromCache
            });

        } catch (error) {
            results.failed.push({
                url: request.url,
                error: error.message
            });
        }
    }

    return results;
}

/**
 * Cache management utilities
 */
const cacheManager = {
    // Clear entire cache
    async clearCache() {
        return await globalDriveCache.clearCache();
    },

    // Get cache statistics
    async getStats() {
        return await globalDriveCache.getCacheStats();
    },

    // Preload specific files into cache
    async preloadFiles(urls, proxyUrl) {
        console.log('🔄 Preloading files into cache...');
        const results = await getMultipleDriveFilesAsBlobs(urls, proxyUrl, true);
        console.log(`✅ Preload complete: ${results.success.length} files cached`);
        return results;
    }
};

// Example usage with caching:
/*
// Single file with cache
getDriveFileAsBlob(
    'https://drive.google.com/file/d/1ABC123def456/view', 
    'drive-proxy.php',
    true // Enable caching
).then(blob => {
    console.log('File loaded (possibly from cache):', blob);
});

// Multiple files with cache
getMultipleDriveFilesAsBlobs([
    'https://drive.google.com/file/d/1ABC123def456/view',
    'https://drive.google.com/file/d/1XYZ789ghi012/view'
], 'drive-proxy.php', true).then(results => {
    console.log(`Results: ${results.fromCache} from cache, ${results.fromNetwork} from network`);
    console.log('Successful:', results.success);
});

// Cache management
cacheManager.getStats().then(stats => {
    console.log('Cache stats:', stats);
});

// Preload files
cacheManager.preloadFiles([
    'https://drive.google.com/file/d/1ABC123def456/view',
    'https://drive.google.com/file/d/1XYZ789ghi012/view'
], 'drive-proxy.php');
*/