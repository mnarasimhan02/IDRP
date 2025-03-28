// Utility for audit functionality - without adding mock data

// Helper function to create an audit entry
const createAuditEntry = (actionType, action, previousValue, currentValue, version) => {
  return {
    timestamp: new Date().toISOString(),
    user: 'Current User', // This would be replaced with actual user in a real implementation
    actionType,
    action,
    previousValue,
    currentValue,
    version: version || '0.1'
  };
};

// Function to initialize audit and history arrays for a specific IDRP
export const directHistoryAdd = (idrpId) => {
  try {
    // Get IDRPs from localStorage
    const idrps = JSON.parse(localStorage.getItem('idrps') || '[]');
    const idrpIndex = idrps.findIndex(idrp => idrp.id === idrpId);
    
    if (idrpIndex === -1) {
      console.error(`IDRP with ID ${idrpId} not found`);
      return false;
    }
    
    const idrp = idrps[idrpIndex];
    
    // Initialize audit array if it doesn't exist
    if (!idrp.audit) {
      idrp.audit = [];
    }
    
    // Initialize history array if it doesn't exist
    if (!idrp.history) {
      idrp.history = [];
    }
    
    // Update the IDRP in the array
    idrps[idrpIndex] = idrp;
    
    // Save back to localStorage
    localStorage.setItem('idrps', JSON.stringify(idrps));
    
    return true;
  } catch (error) {
    console.error('Error in directHistoryAdd:', error);
    return false;
  }
};

// Function to initialize audit and history arrays for all IDRPs
const addHistoryToAllIDRPs = () => {
  try {
    // Get IDRPs from localStorage
    const idrps = JSON.parse(localStorage.getItem('idrps') || '[]');
    
    if (!Array.isArray(idrps) || idrps.length === 0) {
      return false;
    }
    
    // Initialize audit and history arrays for each IDRP if they don't exist
    const updatedIDRPs = idrps.map(idrp => {
      if (!idrp.audit) {
        idrp.audit = [];
      }
      
      if (!idrp.history) {
        idrp.history = [];
      }
      
      return idrp;
    });
    
    // Save back to localStorage
    localStorage.setItem('idrps', JSON.stringify(updatedIDRPs));
    
    return true;
  } catch (error) {
    console.error('Error in addHistoryToAllIDRPs:', error);
    return false;
  }
};

// Also export the createAuditEntry function for reuse
export { createAuditEntry };
