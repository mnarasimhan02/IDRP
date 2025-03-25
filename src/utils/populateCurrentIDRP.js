// Utility to add audit entries to a specific IDRP

// Function to create an audit entry
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

// Function to prepare a specific IDRP for audit entries
export const populateCurrentIDRP = (idrpId) => {
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
    console.error('Error in populateCurrentIDRP:', error);
    return false;
  }
};

export default populateCurrentIDRP;
