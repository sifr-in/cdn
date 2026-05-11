function cmnVldet(dataToValidate, objOfValidation) {
 // Result object
 const result = {
  su: 1,
  ms: 'Validation passed'
 };

 // If no validation rules, return success
 if (!objOfValidation || typeof objOfValidation !== 'object' || Object.keys(objOfValidation).length === 0) {
  return result;
 }

 // Helper function to check if date is all zeros
 function isAllZerosDate(dateStr) {
  if (!dateStr) return false;
  const zeroPatterns = [
   /^0000-00-00$/,
   /^0000-00-00 00:00:00$/,
   /^0000-00-00 00:00$/,
   /^00-00-0000$/,
   /^00\/00\/0000$/
  ];
  return zeroPatterns.some(pattern => pattern.test(dateStr));
 }

 // Helper function to parse minimum value for date
 function parseMinDate(minValue) {
  if (!minValue) return null;
  const parts = minValue.split('-');
  const result = {
   year: parseInt(parts[0]),
   month: parts.length > 1 ? parseInt(parts[1]) : null,
   day: parts.length > 2 ? parseInt(parts[2]) : null
  };
  return result;
 }

 // Helper function to check if date meets minimum requirement
 function meetsMinDate(dateObj, minConfig) {
  if (!minConfig) return true;

  const dateYear = dateObj.getFullYear();
  const dateMonth = dateObj.getMonth() + 1;
  const dateDay = dateObj.getDate();

  if (dateYear < minConfig.year) return false;
  if (dateYear > minConfig.year) return true;

  if (minConfig.month !== null) {
   if (dateMonth < minConfig.month) return false;
   if (dateMonth > minConfig.month) return true;
  }

  if (minConfig.day !== null) {
   if (dateDay < minConfig.day) return false;
  }

  return true;
 }

 // Helper function to check if date meets maximum requirement
 function meetsMaxDate(dateObj, maxConfig) {
  if (!maxConfig) return true;

  const dateYear = dateObj.getFullYear();
  const dateMonth = dateObj.getMonth() + 1;
  const dateDay = dateObj.getDate();

  if (dateYear > maxConfig.year) return false;
  if (dateYear < maxConfig.year) return true;

  if (maxConfig.month !== null) {
   if (dateMonth > maxConfig.month) return false;
   if (dateMonth < maxConfig.month) return true;
  }

  if (maxConfig.day !== null) {
   if (dateDay > maxConfig.day) return false;
  }

  return true;
 }

 // Iterate through each field in validation rules
 for (const [fieldKey, rules] of Object.entries(objOfValidation)) {
  // Get the value from dataToValidate
  let fieldValue = dataToValidate[fieldKey];
  const customMessage = rules.ms;

  // Skip if field doesn't exist in data
  if (fieldValue === undefined || fieldValue === null) {
   result.su = 0;
   result.fld = fieldKey;
   result.ms = customMessage || `field cannot be empty`;
   return result;
  }

  const valueStr = String(fieldValue).trim();

  // Skip empty values
  if (valueStr === '') {
   result.su = 0;
   result.fld = fieldKey;
   result.ms = customMessage || `field cannot be blank`;
   return result;
  }

  // Get validation parameters
  const cnvFunction = rules.cnv;
  const cnvOptions = rules.cnvo || {};
  const valueType = rules.ty;
  const minValue = rules.mi;
  const maxValue = rules.mx;
  const pattern = rules.patn;

  let processedValue = valueStr;

  try {
   // Pass cnvoOptions as the second parameter (not separate parameters)
   processedValue = window[cnvFunction](valueStr, cnvOptions);

   // UPDATE the dataToValidate field with converted value
   dataToValidate[fieldKey] = processedValue;
   fieldValue = processedValue;

  } catch (e) {
   console.error(`Error in conversion function ${cnvFunction}:`, e);
   result.su = 0;
   result.fld = fieldKey;
   result.ms = customMessage || `Invalid format for field: ${fieldKey}`;
   return result;
  }

  // Validate based on type
  if (valueType === 'dt') {
   // Date validation
   const dateObj = new Date(processedValue);

   if (isNaN(dateObj.getTime())) {
    result.su = 0;
    result.fld = fieldKey;
    result.ms = customMessage || `Invalid date for field: ${fieldKey}`;
    return result;
   }

   if (isAllZerosDate(processedValue)) {
    result.su = 0;
    result.fld = fieldKey;
    result.ms = customMessage || `Invalid date (all zeros) for field: ${fieldKey}`;
    return result;
   }

   if (minValue) {
    const minConfig = parseMinDate(minValue);
    if (!meetsMinDate(dateObj, minConfig)) {
     result.su = 0;
     result.fld = fieldKey;
     result.ms = customMessage || `Date is before minimum allowed (${minValue}) for field: ${fieldKey}`;
     return result;
    }
   }

   if (maxValue) {
    const maxConfig = parseMinDate(maxValue);
    if (!meetsMaxDate(dateObj, maxConfig)) {
     result.su = 0;
     result.fld = fieldKey;
     result.ms = customMessage || `Date is after maximum allowed (${maxValue}) for field: ${fieldKey}`;
     return result;
    }
   }
  }

  // Validate pattern (regex)
  if (pattern) {
   try {
    const regex = new RegExp(pattern);
    if (!regex.test(processedValue)) {
     result.su = 0;
     result.fld = fieldKey;
     result.ms = customMessage || `Invalid format for field: ${fieldKey}`;
     return result;
    }
   } catch (e) {
    console.error(`Invalid regex pattern: ${pattern}`, e);
    result.su = 0;
    result.fld = fieldKey;
    result.ms = customMessage || `Invalid validation pattern for field: ${fieldKey}`;
    return result;
   }
  }
 }

 return result;
}
function handleAsString(value, cnvoOptions) {
 // Get the prepend string from options
 const prependStr = cnvoOptions && cnvoOptions.prepn ? cnvoOptions.prepn : '';

 // If no prepend string needed, return original value
 if (!prependStr) {
  return value;
 }

 // Convert value to string
 let strValue = String(value);

 // Check if the string already starts with the prepend string
 if (!strValue.startsWith(prependStr)) {
  // If not, prepend it
  strValue = prependStr + strValue;
 }

 return strValue;
}