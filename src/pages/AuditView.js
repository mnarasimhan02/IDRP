import React, { useState, useEffect, Fragment } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format } from 'date-fns';
import { populateCurrentIDRP } from '../utils';

const AuditView = () => {
  const { id } = useParams();
  const [currentIDRP, setCurrentIDRP] = useState(null);
  const [auditEntries, setAuditEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    loadIDRPData();
  }, [id]);

  // Handle search and filtering
  useEffect(() => {
    if (!auditEntries.length) return;
    
    let filtered = auditEntries;
    
    // Apply action type filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(entry => entry.actionType === actionFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.user.toLowerCase().includes(term) ||
        entry.action.toLowerCase().includes(term) ||
        (entry.previousValue && entry.previousValue.toLowerCase().includes(term)) ||
        (entry.currentValue && entry.currentValue.toLowerCase().includes(term))
      );
    }
    
    setFilteredEntries(filtered);
  }, [searchTerm, actionFilter, auditEntries]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleActionFilterChange = (event) => {
    setActionFilter(event.target.value);
  };

  const getActionTypeColor = (actionType) => {
    switch(actionType) {
      case 'status_change': return 'primary';
      case 'check_add': return 'success';
      case 'check_edit': return 'info';
      case 'check_delete': return 'error';
      case 'comment_add': return 'secondary';
      case 'version_create': return 'warning';
      case 'history': return 'default';
      default: return 'default';
    }
  };

  const loadIDRPData = () => {
    try {
      const storedIDRPs = JSON.parse(localStorage.getItem('idrps') || '[]');
      const storedIDRP = storedIDRPs.find(idrp => idrp.id === id);
      
      if (storedIDRP) {
        setCurrentIDRP(storedIDRP);
        
        // Combine history and audit entries
        let combinedEntries = [];
        
        // Add history entries if available
        if (storedIDRP.history && storedIDRP.history.length > 0) {
          const historyEntries = storedIDRP.history.map(entry => ({
            timestamp: entry.date,
            user: entry.user,
            actionType: 'history',
            action: entry.action,
            previousValue: null,
            currentValue: null,
            version: entry.version
          }));
          combinedEntries = [...combinedEntries, ...historyEntries];
        }
        
        // Add audit entries if available
        if (storedIDRP.audit && storedIDRP.audit.length > 0) {
          combinedEntries = [...combinedEntries, ...storedIDRP.audit];
        }
        
        if (combinedEntries.length > 0) {
          setAuditEntries(combinedEntries);
          setFilteredEntries(combinedEntries);
        }
      }
    } catch (error) {
      console.error('Error loading IDRP audit data:', error);
    }
  };

  const handleRefresh = () => {
    // Populate the current IDRP with history entries
    populateCurrentIDRP(id);
    loadIDRPData();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs sx={{ mb: 3 }} separator="›" aria-label="breadcrumb">
        <Link component={RouterLink} to="/" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to={`/idrp/${id}`} color="inherit">
          {currentIDRP ? currentIDRP.studyId : 'IDRP Detail'}
        </Link>
        <Typography color="textPrimary">History</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton component={RouterLink} to={`/idrp/${id}`} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          History: {currentIDRP ? currentIDRP.studyId : ''} 
          {currentIDRP && (
            <Chip 
              label={currentIDRP.status} 
              size="small" 
              color={
                currentIDRP.status === 'Draft' ? 'info' : 
                currentIDRP.status === 'In-Review' ? 'warning' : 
                currentIDRP.status === 'Reviewed' ? 'secondary' : 'success'
              } 
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleRefresh}>
          Refresh
        </Button>
      </Box>

      {/* Filter Controls */}
      <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
        <TextField
          label="Search History Entries"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="action-filter-label">Action Type</InputLabel>
          <Select
            labelId="action-filter-label"
            value={actionFilter}
            onChange={handleActionFilterChange}
            label="Action Type"
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All Actions</MenuItem>
            <MenuItem value="status_change">Status Changes</MenuItem>
            <MenuItem value="check_add">Check Added</MenuItem>
            <MenuItem value="check_edit">Check Edited</MenuItem>
            <MenuItem value="check_delete">Check Deleted</MenuItem>
            <MenuItem value="comment_add">Comment Added</MenuItem>
            <MenuItem value="version_create">Version Created</MenuItem>
            <MenuItem value="history">History Entries</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Audit Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>Date & Time</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action Type</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Previous Value</TableCell>
              <TableCell>Current Value</TableCell>
              <TableCell>Version</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.timestamp}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.actionType.replace('_', ' ')} 
                      size="small" 
                      color={getActionTypeColor(entry.actionType)}
                    />
                  </TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>
                    {entry.previousValue ? (
                      <Tooltip title={entry.previousValue}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                          {entry.previousValue}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="textSecondary">N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.currentValue ? (
                      <Tooltip title={entry.currentValue}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                          {entry.currentValue}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="textSecondary">N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell>{entry.version}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 3 }}>
                    <InfoIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body1" color="textSecondary">
                      No history entries found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {searchTerm || actionFilter !== 'all' ? 
                        'Try adjusting your search or filter criteria' : 
                        'Actions performed on this IDRP will appear here'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditView;
