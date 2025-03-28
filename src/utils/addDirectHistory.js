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

// Main function to ensure all IDRPs have audit arrays initialized
export const addDirectHistory = () => {
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
    console.error('Error in addDirectHistory:', error);
    return false;
  }
};

// Also export the createAuditEntry function for reuse
export { createAuditEntry };
