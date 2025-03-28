import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  IconButton,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardHeader,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Grid,
  Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DraftsIcon from '@mui/icons-material/Drafts';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { toast } from 'react-toastify';

function IDRPView() {
  const navigate = useNavigate();
  const [idrps, setIdrps] = useState([]);
  const [filteredIdrps, setFilteredIdrps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIdrp, setSelectedIdrp] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    action: null
  });

  // Load IDRPs from localStorage on component mount
  useEffect(() => {
    const loadIdrps = () => {
      try {
        const savedIdrps = JSON.parse(localStorage.getItem('idrps') || '[]');
        setIdrps(savedIdrps);
        setFilteredIdrps(savedIdrps);
      } catch (error) {
        console.error('Error loading IDRPs from localStorage:', error);
        toast.error('Error loading IDRPs. Please try again.');
      }
    };

    loadIdrps();

    // Listen for IDRP updates from other components
    const handleIdrpUpdate = () => {
      loadIdrps();
    };

    window.addEventListener('idrp-updated', handleIdrpUpdate);

    return () => {
      window.removeEventListener('idrp-updated', handleIdrpUpdate);
    };
  }, []);

  // Filter IDRPs based on search term and status filter
  useEffect(() => {
    let filtered = idrps;

    if (searchTerm) {
      filtered = filtered.filter(
        idrp =>
          idrp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idrp.studyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(idrp => idrp.status === statusFilter);
    }

    setFilteredIdrps(filtered);
  }, [idrps, searchTerm, statusFilter]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleMenuClick = (event, idrp) => {
    setAnchorEl(event.currentTarget);
    setSelectedIdrp(idrp);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewIdrp = () => {
    if (selectedIdrp) {
      navigate(`/idrp/${selectedIdrp.id}`);
    }
    handleMenuClose();
  };

  const handleEditIdrp = () => {
    if (selectedIdrp) {
      navigate(`/idrp/${selectedIdrp.id}/edit`);
    }
    handleMenuClose();
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedIdrp) return;
    
    setConfirmDialog({
      open: true,
      title: `Change Status to ${newStatus}?`,
      content: `Are you sure you want to change the status of IDRP ${selectedIdrp.id} from ${selectedIdrp.status} to ${newStatus}?`,
      action: () => confirmStatusChange(newStatus)
    });
    
    handleMenuClose();
  };

  const confirmStatusChange = (newStatus) => {
    if (!selectedIdrp) return;
    
    try {
      // Update the IDRP status
      const updatedIdrps = idrps.map(idrp => {
        if (idrp.id === selectedIdrp.id) {
          const updatedIdrp = { 
            ...idrp, 
            status: newStatus,
            lastUpdated: new Date().toISOString().split('T')[0],
            history: [
              ...idrp.history,
              {
                date: new Date().toISOString().split('T')[0],
                user: 'Current User', // In a real app, this would be the logged-in user
                action: `Changed status from ${idrp.status} to ${newStatus}`,
                version: idrp.version
              }
            ]
          };
          
          // If status is changed to Approved, increment version
          if (newStatus === 'Approved' && idrp.status !== 'Approved') {
            const versionParts = idrp.version.split('.');
            if (versionParts[1] === '0') {
              // First approval, set to 1.0
              updatedIdrp.version = '1.0';
            } else {
              // Increment major version
              updatedIdrp.version = `${parseInt(versionParts[0]) + 1}.0`;
            }
            
            updatedIdrp.history.push({
              date: new Date().toISOString().split('T')[0],
              user: 'Current User',
              action: `Version updated to ${updatedIdrp.version}`,
              version: updatedIdrp.version
            });
          }
          
          return updatedIdrp;
        }
        return idrp;
      });
      
      // Save to localStorage
      localStorage.setItem('idrps', JSON.stringify(updatedIdrps));
      setIdrps(updatedIdrps);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('idrp-updated'));
      
      toast.success(`IDRP ${selectedIdrp.id} status changed to ${newStatus}`);
      setSelectedIdrp(null);
    } catch (error) {
      console.error('Error updating IDRP status:', error);
      toast.error('Error updating IDRP status. Please try again.');
    }
    
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft':
        return <DraftsIcon fontSize="small" />;
      case 'In-Review':
        return <HourglassEmptyIcon fontSize="small" />;
      case 'Reviewed':
        return <RateReviewIcon fontSize="small" />;
      case 'Approved':
        return <CheckCircleIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'info';
      case 'In-Review':
        return 'warning';
      case 'Reviewed':
        return 'secondary';
      case 'Approved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getAvailableActions = (status) => {
    switch (status) {
      case 'Draft':
        return ['View', 'Edit', 'In-Review'];
      case 'In-Review':
        return ['View', 'Reviewed'];
      case 'Reviewed':
        return ['View', 'Edit', 'Approved'];
      case 'Approved':
        return ['View', 'Draft'];
      default:
        return ['View'];
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        IDRP Management
      </Typography>
      
      <Card sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <CardHeader 
          title="Filter and Search"
          sx={{ backgroundColor: 'primary.light', color: 'primary.contrastText', pb: 1 }}
        />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by ID, Study Name, or Study ID"
                value={searchTerm}
                onChange={handleSearchChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status Filter"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="In-Review">In-Review</MenuItem>
                  <MenuItem value="Reviewed">Reviewed</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => navigate('/create')}
                sx={{ borderRadius: 2, height: '56px' }}
              >
                Create New IDRP
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>IDRP ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Study ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Study Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Version</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Updated</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Checks</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Owner</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIdrps.length > 0 ? (
              filteredIdrps.map((idrp) => (
                <TableRow key={idrp.id} hover>
                  <TableCell>{idrp.id}</TableCell>
                  <TableCell>{idrp.studyId}</TableCell>
                  <TableCell>{idrp.studyName}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(idrp.status)}
                      label={idrp.status}
                      color={getStatusColor(idrp.status)}
                      variant="filled"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>{idrp.version}</TableCell>
                  <TableCell>{idrp.lastUpdated}</TableCell>
                  <TableCell>
                    <Badge badgeContent={idrp.checkCount} color="primary" max={999}>
                      <AssignmentIcon color="action" />
                    </Badge>
                  </TableCell>
                  <TableCell>{idrp.owner}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View IDRP">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => navigate(`/idrp/${idrp.id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={idrp.status === 'In-Review' || idrp.status === 'Approved' ? 
                        "Editing not allowed in this status" : "Edit IDRP"}>
                        <span>
                          <IconButton 
                            size="small" 
                            color="default"
                            onClick={() => navigate(`/idrp/${idrp.id}/edit`)}
                            disabled={idrp.status === 'In-Review' || idrp.status === 'Approved'}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      
                      <Tooltip title="More Actions">
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuClick(event, idrp)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="subtitle1" sx={{ py: 3 }}>
                    No IDRPs found. {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Create a new IDRP to get started.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewIdrp}>View Details</MenuItem>
        
        {selectedIdrp && selectedIdrp.status !== 'In-Review' && selectedIdrp.status !== 'Approved' && (
          <MenuItem onClick={handleEditIdrp}>Edit IDRP</MenuItem>
        )}
        
        <Divider />
        
        {selectedIdrp && getAvailableActions(selectedIdrp.status).includes('In-Review') && (
          <MenuItem onClick={() => handleStatusChange('In-Review')}>Move to In-Review</MenuItem>
        )}
        
        {selectedIdrp && getAvailableActions(selectedIdrp.status).includes('Reviewed') && (
          <MenuItem onClick={() => handleStatusChange('Reviewed')}>Mark as Reviewed</MenuItem>
        )}
        
        {selectedIdrp && getAvailableActions(selectedIdrp.status).includes('Approved') && (
          <MenuItem onClick={() => handleStatusChange('Approved')}>Approve IDRP</MenuItem>
        )}
        
        {selectedIdrp && getAvailableActions(selectedIdrp.status).includes('Draft') && (
          <MenuItem onClick={() => handleStatusChange('Draft')}>Create New Version (Draft)</MenuItem>
        )}
      </Menu>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => confirmDialog.action()} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default IDRPView;
