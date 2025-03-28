// Utility for audit functionality - without adding mock data
import { format } from 'date-fns';

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

// Function to ensure all IDRPs have audit and history arrays initialized
export const addHistoryToIDRPs = () => {
  try {
    // Get IDRPs from localStorage
    const storedIDRPs = JSON.parse(localStorage.getItem('idrps') || '[]');
    
    if (!Array.isArray(storedIDRPs) || storedIDRPs.length === 0) {
      return false;
    }
    
    // Initialize audit and history arrays for each IDRP if they don't exist
    const updatedIDRPs = storedIDRPs.map(idrp => {
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
    console.error('Error in addHistoryToIDRPs:', error);
    return false;
  }
};

// Also export the createAuditEntry function for reuse
export { createAuditEntry };
