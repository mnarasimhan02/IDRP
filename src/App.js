import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Dashboard from './pages/Dashboard';
import IDRPCreation from './pages/IDRPCreation';
import IDRPDetail from './pages/IDRPDetail';
import IDRPView from './pages/IDRPView';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Documentation from './pages/Documentation';
import AuditView from './pages/AuditView';

// Import components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<IDRPCreation />} />
          <Route path="/idrps" element={<IDRPView />} />
          <Route path="/idrp/:id" element={<IDRPDetail />} />
          <Route path="/idrp/:id/edit" element={<IDRPDetail isEditing={true} />} />
          <Route path="/idrp/:id/audit" element={<AuditView />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </Box>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}

export default App;
