import * as XLSX from 'xlsx';

/**
 * Reads an Excel file and converts it to JSON
 * @param {File} file - The Excel file to read
 * @returns {Promise<Array>} - Promise resolving to array of objects representing Excel data
 */
export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Get header row to see all column names
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const headers = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: C })];
          if (cell && cell.t) headers.push(cell.v);
        }
        console.log('Excel headers:', headers);
        
        // Convert to JSON with raw values and header mapping
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: true,
          defval: '', // Use empty string for empty cells
        });
        
        console.log('Raw Excel data:', jsonData);
        resolve(jsonData);
      } catch (error) {
        reject(new Error(`Error parsing Excel file: ${error.message}`));
      }
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Error reading file: ${error}`));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Maps Excel data to the format expected by the application
 * @param {Array} excelData - The data from Excel file
 * @returns {Array} - Formatted check data
 */
export const mapExcelDataToChecks = (excelData) => {
  // First, let's log all available column names from the first row
  if (excelData.length > 0) {
    console.log('Available columns in Excel:', Object.keys(excelData[0]));
  }
  
  // Define the exact header mappings based on the user's Excel file
  const headerMappings = {
    id: 'Standard Check ID',
    checkType: 'Purpose',
    checkCategory: 'Purpose', // Using Purpose for checkCategory as well
    dataCategory: 'Expected Data Category: Data Category Name',
    description: 'Description',
    queryText: 'Standard Query Text',
    rolesInvolved: 'Role Description',
    frequency: 'Frequency',
    method: 'Method',
    grouping: 'Standard Check Grouping'
  };
  
  return excelData.map((row, index) => {
    // Debug log the raw row data
    console.log(`Raw row ${index}:`, JSON.stringify(row));
    
    // Extract values directly using the exact header names
    const checkId = row[headerMappings.id] || '';
    const checkType = row[headerMappings.checkType] || '';
    const checkCategory = row[headerMappings.checkCategory] || '';
    const dataCategory = row[headerMappings.dataCategory] || '';
    const description = row[headerMappings.description] || '';
    const queryText = row[headerMappings.queryText] || '';
    const rolesInvolved = row[headerMappings.rolesInvolved] || '';
    const frequency = row[headerMappings.frequency] || '';
    
    // Process roles involved - could be string or array
    let processedRoles = [];
    if (rolesInvolved && typeof rolesInvolved === 'string') {
      processedRoles = rolesInvolved.split(',').map(role => role.trim()).filter(Boolean);
      if (processedRoles.length === 0) {
        processedRoles = [rolesInvolved];
      }
    } else if (rolesInvolved) {
      processedRoles = [rolesInvolved];
    }
    
    // Ensure we have valid values for all fields
    const formattedCheck = {
      id: checkId || `IDRP-${String(index + 1).padStart(3, '0')}`,
      checkType: checkType || '',
      checkCategory: checkCategory || '',
      dataCategory: dataCategory || '',
      visit: '', // Not in the Excel headers, leaving blank
      description: description || '',
      queryText: queryText || '',
      rolesInvolved: processedRoles.length > 0 ? processedRoles : [''],
      frequency: frequency || '',
      source: 'Global Library'
    };
    
    // Log the mapping for debugging
    console.log(`Formatted check ${index}:`, JSON.stringify(formattedCheck));
    
    return formattedCheck;
  });
};
