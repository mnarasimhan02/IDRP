import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  Badge,
  Breadcrumbs,
  Link,
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import HistoryIcon from '@mui/icons-material/History';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GetAppIcon from '@mui/icons-material/GetApp';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import UpdateIcon from '@mui/icons-material/Update';
import BadgeIcon from '@mui/icons-material/Badge';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import { toast } from 'react-toastify';
import { populateCurrentIDRP } from '../utils';

// Empty mock data - no pre-populated IDRPs
const mockIDRPs = {};

// Role colors for avatars and chips
const roleColors = {
  'DM': '#1976d2',
  'MM': '#388e3c',
  'SR': '#d32f2f',
  'Default': '#757575'
};

// Role full names
const roleNames = {
  DM: 'Data Manager',
  MM: 'Medical Monitor',
  SR: 'Safety Reviewer',
  SM: 'Study Manager'
};

// Status color mapping
const statusColors = {
  'Draft': '#757575',      // Grey
  'In-Review': '#2196f3',  // Blue
  'Reviewed': '#ff9800',   // Orange
  'Approved': '#4caf50'    // Green
};

// Next status mapping
const nextStatusMap = {
  'Draft': 'In-Review',
  'In-Review': 'Reviewed',
  'Reviewed': 'Approved',
  'Approved': 'Approved'
};

// Status action button text
const statusActionText = {
  'Draft': 'Submit for Review',
  'In-Review': 'Mark as Reviewed',
  'Reviewed': 'Approve',
  'Approved': 'Approved'
};

// Status color function
const getStatusColor = (status) => {
  switch (status) {
    case 'Draft':
      return 'default';
    case 'In-Review':
      return 'primary';
    case 'Reviewed':
      return 'warning';
    case 'Approved':
      return 'success';
    default:
      return 'default';
  }
};

function IDRPDetail({ isEditing = false }) {
  const { id } = useParams();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [addCheckDialogOpen, setAddCheckDialogOpen] = useState(false);
  const [customChecks, setCustomChecks] = useState([{
    checkType: '',
    checkCategory: '',
    dataCategory: '',
    visit: '',
    description: '',
    queryText: '',
    roles: [],
    frequency: '',
    source: ''
  }]);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [editCheckDialogOpen, setEditCheckDialogOpen] = useState(false);
  const [deleteCheckDialogOpen, setDeleteCheckDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedCheckId, setSelectedCheckId] = useState(null);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [checkComments, setCheckComments] = useState([]);
  const [currentIDRP, setCurrentIDRP] = useState(null);
  const [newVersionDialogOpen, setNewVersionDialogOpen] = useState(false);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);

  // Permissions and mode
  const canEditChecks = currentIDRP?.status === 'Draft' || currentIDRP?.status === 'Reviewed';
  const canAddComments = true; // Comments can be added in any status
  const editMode = isEditing && canEditChecks;

  useEffect(() => {
    // Find the IDRP data for this ID
    const idrpData = mockIDRPs[id] || { id, studyId: id, studyName: 'Unknown Study', status: 'Draft', version: '0.1', checks: [], comments: [] };
    
    // Try to load from localStorage
    try {
      const storedIDRPs = JSON.parse(localStorage.getItem('idrps') || '[]');
      const storedIDRP = storedIDRPs.find(idrp => idrp.id === id);
      
      if (storedIDRP) {
        // Populate the IDRP with history entries if needed
        populateCurrentIDRP(id);
        setCurrentIDRP(storedIDRP);
      } else {
        setCurrentIDRP(idrpData);
      }
    } catch (error) {
      console.error('Error loading IDRPs from localStorage:', error);
      setCurrentIDRP(idrpData);
    }
  }, [id]);

  // If IDRP data is not loaded yet, show loading
  if (!currentIDRP) {
    return <Typography>Loading...</Typography>;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Helper function to create a timestamp in a readable format
  const createTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };

  // Create audit entry with detailed information
  const createAuditEntry = (actionType, action, previousValue = null, currentValue = null) => {
    return {
      timestamp: createTimestamp(),
      user: 'Current User', // In a real app, this would be the logged-in user
      actionType, // status_change, check_add, check_edit, check_delete, comment_add, version_create
      action,
      previousValue: previousValue !== null ? String(previousValue) : null,
      currentValue: currentValue !== null ? String(currentValue) : null,
      version: currentIDRP.version
    };
  };

  const handleAddCheckDialogOpen = () => {
    setCustomChecks([{
      checkType: '',
      checkCategory: '',
      dataCategory: '',
      visit: '',
      description: '',
      queryText: '',
      roles: [],
      frequency: '',
      source: ''
    }]);
    setAddCheckDialogOpen(true);
  };

  const handleAddCheckDialogClose = () => {
    setCustomChecks([{
      checkType: '',
      checkCategory: '',
      dataCategory: '',
      visit: '',
      description: '',
      queryText: '',
      roles: [],
      frequency: '',
      source: ''
    }]);
    setAddCheckDialogOpen(false);
  };

  const handleAddRow = () => {
    setCustomChecks([...customChecks, {
      checkType: '',
      checkCategory: '',
      dataCategory: '',
      visit: '',
      description: '',
      queryText: '',
      roles: [],
      frequency: '',
      source: ''
    }]);
  };

  const handleCheckChange = (index, field, value) => {
    const updatedChecks = customChecks.map((check, i) => {
      if (i === index) {
        return { ...check, [field]: value };
      }
      return check;
    });
    setCustomChecks(updatedChecks);
  };

  // Helper function to get the next check number
  const getNextCheckNumber = () => {
    const allChecks = (currentIDRP.checks || [])
      .map(check => {
        const match = check.id.match(/Std\.Check-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);
    
    const maxNumber = allChecks.length > 0 ? Math.max(...allChecks) : 1607; // Start from 1608 if no checks exist
    return maxNumber + 1;
  };

  const handleAddAllChecks = () => {
    const validChecks = customChecks.filter(check => 
      check.checkType && check.checkCategory && check.dataCategory && check.description
    );

    if (validChecks.length === 0) {
      toast.error('Please fill in all required fields for at least one check');
      return;
    }

    let nextCheckNumber = getNextCheckNumber();
    const newChecks = validChecks.map(check => {
      const checkId = `Std.Check-${nextCheckNumber++}`;
      return {
        id: checkId,
        ...check,
        status: 'Active'
      };
    });

    const updatedIDRP = {
      ...currentIDRP,
      checks: [...(currentIDRP.checks || []), ...newChecks],
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...(currentIDRP.history || []),
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User',
          action: `Added ${newChecks.length} checks (${newChecks.map(c => c.id).join(', ')})`,
          version: currentIDRP.version
        }
      ]
    };

    try {
      saveIDRPToLocalStorage(updatedIDRP);
      toast.success(`Successfully added ${newChecks.length} checks`, { toastId: 'checks-added' });
      setCustomChecks([{
        checkType: '',
        checkCategory: '',
        dataCategory: '',
        visit: '',
        description: '',
        queryText: '',
        roles: [],
        frequency: '',
        source: ''
      }]);
      setAddCheckDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add checks', { toastId: 'checks-error' });
    }
  };

  const handleEditCheckDialogOpen = (check) => {
    setSelectedCheck({...check});
    setEditCheckDialogOpen(true);
  };

  const handleEditCheckDialogClose = () => {
    setSelectedCheck(null);
    setEditCheckDialogOpen(false);
  };

  const handleDeleteCheckDialogOpen = (check) => {
    setSelectedCheck({...check});
    setDeleteCheckDialogOpen(true);
  };

  const handleDeleteCheckDialogClose = () => {
    setSelectedCheck(null);
    setDeleteCheckDialogOpen(false);
  };

  const handleSaveEditedCheck = () => {
    if (!selectedCheck) return;

    const updatedChecks = currentIDRP.checks.map(check =>
      check.id === selectedCheck.id ? selectedCheck : check
    );

    const updatedIDRP = {
      ...currentIDRP,
      checks: updatedChecks,
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...(currentIDRP.history || []),
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User',
          action: `Edited check ${selectedCheck.id}`,
          version: currentIDRP.version
        }
      ]
    };

    try {
      saveIDRPToLocalStorage(updatedIDRP);
      toast.success('Check updated successfully', { toastId: 'check-updated' });
    } catch (error) {
      toast.error('Failed to update check', { toastId: 'check-update-error' });
    }
    handleEditCheckDialogClose();
  };

  const handleDeleteCheck = () => {
    if (!selectedCheck) return;

    const updatedChecks = currentIDRP.checks.filter(check => check.id !== selectedCheck.id);

    const updatedIDRP = {
      ...currentIDRP,
      checks: updatedChecks,
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...(currentIDRP.history || []),
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User',
          action: `Deleted check ${selectedCheck.id}`,
          version: currentIDRP.version
        }
      ]
    };

    try {
      saveIDRPToLocalStorage(updatedIDRP);
      toast.success('Check deleted successfully', { toastId: 'check-deleted' });
    } catch (error) {
      toast.error('Failed to delete check', { toastId: 'check-delete-error' });
    }
    handleDeleteCheckDialogClose();
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentsOpen = (checkId) => {
    setSelectedCheckId(checkId);
    setCommentsDialogOpen(true);
  };

  const handleCommentsClose = () => {
    setSelectedCheckId(null);
    setReplyToCommentId(null);
    setNewComment('');
    setCommentsDialogOpen(false);
  };

  const handleReplyClick = (commentId) => {
    setReplyToCommentId(commentId);
    setNewComment('');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    const timestamp = new Date().toISOString();
    const commentId = `comment-${Date.now()}`;
    
    const newCommentObj = {
      id: commentId,
      text: newComment,
      timestamp,
      user: 'Current User',
      parentId: replyToCommentId,
      checkId: selectedCheckId
    };

    const updatedIDRP = {
      ...currentIDRP,
      comments: [...(currentIDRP.comments || []), newCommentObj],
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...(currentIDRP.history || []),
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User',
          action: replyToCommentId ? 'Added reply to comment' : 'Added comment',
          version: currentIDRP.version
        }
      ]
    };

    try {
      saveIDRPToLocalStorage(updatedIDRP);
      setCurrentIDRP(updatedIDRP);
      setNewComment('');
      setReplyToCommentId(null);
      toast.success('Comment added successfully', { toastId: 'comment-added' });
    } catch (error) {
      toast.error('Failed to add comment', { toastId: 'comment-error' });
    }
  };

  const handleStatusChangeDialogOpen = () => {
    const nextStatus = nextStatusMap[currentIDRP.status];
    
    setStatusChangeDialogOpen(true);
  };

  const handleCreateNewVersion = () => {
    if (currentIDRP.status !== 'Approved') {
      toast.error('Only approved IDRPs can have new versions created');
      return;
    }
    
    // Parse current version and increment major version
    const currentVersion = parseFloat(currentIDRP.version);
    const newVersion = Math.floor(currentVersion) + 1 + '.0';
    
    // Create a new IDRP with incremented version
    const newVersionIDRP = {
      ...currentIDRP,
      version: newVersion,
      status: 'Draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...(currentIDRP.history || []),
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User', // In a real app, this would be the logged-in user
          action: `Created new version ${newVersion} from version ${currentIDRP.version}`,
          version: newVersion
        }
      ],
      audit: [
        ...(currentIDRP.audit || []),
        createAuditEntry(
          'version_create',
          `Created new version ${newVersion} from version ${currentIDRP.version}`,
          currentIDRP.version,
          newVersion
        )
      ]
    };

    // Save to localStorage
    try {
      const storedIDRPs = JSON.parse(localStorage.getItem('idrps') || '[]');
      let updatedIDRPs = [];
      
      // Check if this IDRP already exists in localStorage
      if (storedIDRPs.some(idrp => idrp.id === newVersionIDRP.id)) {
        // Update existing IDRP
        updatedIDRPs = storedIDRPs.map(idrp => 
          idrp.id === newVersionIDRP.id ? newVersionIDRP : idrp
        );
      } else {
        // Add new IDRP
        updatedIDRPs = [...storedIDRPs, newVersionIDRP];
      }
      
      localStorage.setItem('idrps', JSON.stringify(updatedIDRPs));
      setCurrentIDRP(newVersionIDRP);
      
      // Dispatch a custom event to notify other components of the update
      window.dispatchEvent(new CustomEvent('idrp-updated', { detail: newVersionIDRP }));
      
      // Show success toast
      toast.success(`Created new version ${newVersion} successfully`, { toastId: 'new-version-created' });
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
      toast.error('Error creating new version', { toastId: 'new-version-error' });
    }
  };

  const handleStatusChange = () => {
    let newStatus = '';
    
    // Determine the next status based on current status
    switch(currentIDRP.status) {
      case 'Draft':
        newStatus = 'In-Review';
        break;
      case 'In-Review':
        newStatus = 'Reviewed';
        break;
      case 'Reviewed':
        newStatus = 'Approved';
        break;
      default:
        newStatus = 'Draft';
    }
    
    // Update IDRP with new status
    const updatedIDRP = {
      ...currentIDRP,
      status: newStatus,
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...(currentIDRP.history || []),
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User', // In a real app, this would be the logged-in user
          action: `Changed status from ${currentIDRP.status} to ${newStatus}`,
          version: currentIDRP.version
        }
      ],
      audit: [
        ...(currentIDRP.audit || []),
        createAuditEntry(
          'status_change',
          `Changed status from ${currentIDRP.status} to ${newStatus}`,
          currentIDRP.status,
          newStatus
        )
      ]
    };

    // If moving to Approved, update version
    if (newStatus === 'Approved') {
      // Parse current version and increment major version
      const currentVersion = parseFloat(currentIDRP.version);
      updatedIDRP.version = (Math.floor(currentVersion) + 1).toFixed(1);
      
      // Add version update to history
      updatedIDRP.history.push({
        date: new Date().toISOString().split('T')[0],
        user: 'Current User', // In a real app, this would be the logged-in user
        action: `Updated version from ${currentIDRP.version} to ${updatedIDRP.version}`,
        version: updatedIDRP.version
      });
    }

    // Save to localStorage
    try {
      const storedIDRPs = JSON.parse(localStorage.getItem('idrps') || '[]');
      let updatedIDRPs = [];
      
      // Check if this IDRP already exists in localStorage
      if (storedIDRPs.some(idrp => idrp.id === updatedIDRP.id)) {
        // Update existing IDRP
        updatedIDRPs = storedIDRPs.map(idrp => 
          idrp.id === updatedIDRP.id ? updatedIDRP : idrp
        );
      } else {
        // Add new IDRP
        updatedIDRPs = [...storedIDRPs, updatedIDRP];
      }
      
      localStorage.setItem('idrps', JSON.stringify(updatedIDRPs));
      setCurrentIDRP(updatedIDRP);
      
      // Dispatch a custom event to notify other components of the update
      window.dispatchEvent(new CustomEvent('idrp-updated', { detail: updatedIDRP }));
      
      // Show success toast
      if (newStatus === 'Approved') {
        toast.success(`IDRP approved and version updated to ${updatedIDRP.version}`, { toastId: 'status-approved' });
      } else {
        toast.success(`Status changed to ${newStatus}`, { toastId: 'status-changed' });
      }
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
      toast.error('Error changing status', { toastId: 'status-error' });
    }
  };

  // Helper function to save IDRP to localStorage
  const saveIDRPToLocalStorage = (updatedIDRP) => {
    try {
      const storedIDRPs = JSON.parse(localStorage.getItem('idrps') || '[]');
      const updatedIDRPs = storedIDRPs.map(idrp =>
        idrp.id === updatedIDRP.id ? updatedIDRP : idrp
      );
      
      localStorage.setItem('idrps', JSON.stringify(updatedIDRPs));
      setCurrentIDRP(updatedIDRP);
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
      throw error;
    }
  };

  // Helper function to organize comments in a threaded structure
  const getThreadedComments = (checkId) => {
    const comments = (currentIDRP.comments || [])
      .filter(comment => comment.checkId === checkId);
    
    const commentMap = {};
    const rootComments = [];

    comments.forEach(comment => {
      commentMap[comment.id] = {
        ...comment,
        replies: []
      };
    });

    comments.forEach(comment => {
      if (comment.parentId) {
        commentMap[comment.parentId]?.replies.push(commentMap[comment.id]);
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  // Render a single comment with its replies
  const renderComment = (comment, depth = 0) => (
    <Box key={comment.id} sx={{ ml: depth * 3, mb: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="primary">
              {comment.user}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.timestamp).toLocaleString()}
            </Typography>
          </Box>
          <Typography variant="body2">{comment.text}</Typography>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              startIcon={<ReplyIcon />}
              onClick={() => handleReplyClick(comment.id)}
            >
              Reply
            </Button>
          </Box>
        </CardContent>
      </Card>
      {comment.replies?.map(reply => renderComment(reply, depth + 1))}
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link 
            component={RouterLink} 
            to="/" 
            color="inherit" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Dashboard
          </Link>
          <Typography 
            color="text.primary" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <DescriptionIcon sx={{ mr: 0.5 }} fontSize="small" />
            {currentIDRP.studyName} IDRP
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {currentIDRP.studyName}: IDRP
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={currentIDRP.status} 
              sx={{ 
                backgroundColor: statusColors[currentIDRP.status] + '20',
                color: statusColors[currentIDRP.status],
                fontWeight: 'bold'
              }}
            />
            <Typography variant="body2" color="textSecondary">
              Version {currentIDRP.version}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last updated: {currentIDRP.lastUpdated}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            sx={{ mr: 1 }}
          >
            Share
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<GetAppIcon />}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<CheckCircleOutlineIcon />}
            disabled={currentIDRP.status === 'Approved'}
            onClick={handleStatusChangeDialogOpen}
            sx={{ mr: 1 }}
          >
            {statusActionText[currentIDRP.status]}
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<AddIcon />}
            disabled={currentIDRP.status !== 'Approved'}
            onClick={handleCreateNewVersion}
            sx={{ mr: 1 }}
          >
            Create New Version
          </Button>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); }} disabled={currentIDRP.status === 'Approved' || currentIDRP.status === 'In-Review'}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit IDRP
            </MenuItem>
            <MenuItem component={RouterLink} to={`/idrp/${id}/audit`} onClick={handleMenuClose}>
              <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
              View History
            </MenuItem>
            <MenuItem onClick={() => { handleCreateNewVersion(); handleMenuClose(); }} disabled={currentIDRP.status !== 'Approved'}>
              <AddIcon fontSize="small" sx={{ mr: 1 }} />
              Create New Version
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Overview" />
          <Tab label="Checks" />
          <Tab label="History" />
          <Tab label="Comments" />
          <Tab label="Documentation" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="study-info-content"
                id="study-info-header"
                sx={{ cursor: 'pointer' }}
              >
                <Typography variant="h6">Study Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Description"
                      secondary={currentIDRP ? currentIDRP.description : ''}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Study ID"
                      secondary={currentIDRP ? currentIDRP.studyId : ''}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocalHospitalIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Therapeutic Area"
                      secondary={currentIDRP ? currentIDRP.therapeutic : ''}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MedicationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Indication"
                      secondary={currentIDRP ? currentIDRP.indication : ''}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ScienceIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phase"
                      secondary={currentIDRP ? currentIDRP.phase : ''}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Created By"
                      secondary={currentIDRP ? currentIDRP.createdBy : ''}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Created Date"
                      secondary={currentIDRP ? currentIDRP.createdDate : ''}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <UpdateIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Updated"
                      secondary={currentIDRP ? currentIDRP.lastUpdated : ''}
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="idrp-summary-content"
                id="idrp-summary-header"
              >
                <Typography variant="h6">IDRP Summary</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  This IDRP contains checks for the following categories:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {currentIDRP && currentIDRP.checks && currentIDRP.checks.length > 0 
                    ? Array.from(new Set(currentIDRP.checks.map(check => check.checkCategory))).map((type) => (
                      <Chip 
                        key={type} 
                        label={type} 
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))
                    : <Typography variant="body2" color="textSecondary">No check categories available</Typography>
                  }
                </Box>
                
                <Typography variant="body2" paragraph>
                  Check Types:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {currentIDRP && currentIDRP.checks && currentIDRP.checks.length > 0 
                    ? Array.from(new Set(currentIDRP.checks.map(check => check.checkType))).map((type) => (
                      <Chip 
                        key={type} 
                        label={type} 
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))
                    : <Typography variant="body2" color="textSecondary">No check types available</Typography>
                  }
                </Box>
                
                <Typography variant="body2" paragraph>
                  Data Categories:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {currentIDRP && currentIDRP.checks && currentIDRP.checks.length > 0 
                    ? Array.from(new Set(currentIDRP.checks.map(check => check.dataCategory))).map((category) => (
                      <Chip 
                        key={category} 
                        label={category} 
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    ))
                    : <Typography variant="body2" color="textSecondary">No data categories available</Typography>
                  }
                </Box>
                
                <Typography variant="body2" paragraph>
                  Roles involved:
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {currentIDRP && currentIDRP.checks && currentIDRP.checks.length > 0 
                    ? (
                      <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                        {Array.from(new Set(currentIDRP.checks.flatMap(check => check.roles || []))).map((role) => (
                          <Avatar 
                            key={role} 
                            sx={{ 
                              bgcolor: roleColors[role] || '#ccc'
                            }}
                            title={roleNames[role] || role}
                          >
                            {role}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    )
                    : <Typography variant="body2" color="textSecondary">No roles available</Typography>
                  }
                </Box>
                
                <Typography variant="body2" paragraph>
                  Version: <Chip label={currentIDRP?.version || '0.1'} size="small" color="success" />
                </Typography>
                
                <Typography variant="body2" paragraph>
                  Status: <Chip 
                    label={currentIDRP?.status || 'Draft'} 
                    size="small" 
                    color={getStatusColor(currentIDRP?.status || 'Draft')} 
                  />
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button 
              variant="outlined"
              startIcon={<GetAppIcon />}
              sx={{ mr: 1 }}
            >
              Export Checks
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddCheckDialogOpen}
              disabled={currentIDRP.status === 'Approved' || currentIDRP.status === 'In-Review'}
            >
              Add Check
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Check ID</TableCell>
                  <TableCell>Check Type</TableCell>
                  <TableCell>Check Category</TableCell>
                  <TableCell>Data Category</TableCell>
                  <TableCell>Visit</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Query Text</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentIDRP && currentIDRP.checks && currentIDRP.checks.length > 0 ? (
                  currentIDRP.checks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell>{check.id}</TableCell>
                      <TableCell>{check.checkType}</TableCell>
                      <TableCell>{check.checkCategory}</TableCell>
                      <TableCell>{check.dataCategory}</TableCell>
                      <TableCell>{check.visit}</TableCell>
                      <TableCell>{check.description}</TableCell>
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">
                          {check.queryText}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <AvatarGroup max={3}>
                          {check.roles && check.roles.length > 0 ? check.roles.map((role, index) => (
                            <Avatar 
                              key={index} 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                fontSize: '0.75rem',
                                bgcolor: roleColors[role] || '#ccc'
                              }}
                              title={roleNames[role] || role}
                            >
                              {role}
                            </Avatar>
                          )) : (
                            <Typography variant="caption" color="textSecondary">None</Typography>
                          )}
                        </AvatarGroup>
                      </TableCell>
                      <TableCell>{check.frequency}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Check">
                          <span>
                            <IconButton 
                              size="small"
                              disabled={currentIDRP.status === 'Approved' || currentIDRP.status === 'In-Review'}
                              onClick={() => handleEditCheckDialogOpen(check)}
                              sx={{ '&:hover': { color: 'primary.main' } }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete Check">
                          <span>
                            <IconButton 
                              size="small"
                              disabled={currentIDRP.status === 'Approved' || currentIDRP.status === 'In-Review'}
                              onClick={() => handleDeleteCheckDialogOpen(check)}
                              sx={{ '&:hover': { color: 'error.main' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="View Comments">
                          <IconButton 
                            size="small"
                            onClick={() => handleCommentsOpen(check.id)}
                            color="primary"
                            sx={{ '&:hover': { color: 'primary.main' } }}
                          >
                            <Badge 
                              badgeContent={currentIDRP.comments?.filter(comment => comment.checkId === check.id).length || 0} 
                              color="secondary" 
                              invisible={!currentIDRP.comments?.some(comment => comment.checkId === check.id)}
                            >
                              <CommentIcon fontSize="small" />
                            </Badge>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No checks available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Version</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentIDRP && currentIDRP.history && currentIDRP.history.length > 0 ? (
                currentIDRP.history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.user}</TableCell>
                    <TableCell>{item.action}</TableCell>
                    <TableCell>{item.version}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No history available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 3 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<CommentIcon />}
              onClick={() => {
                setReplyToCommentId(null);
                setCommentsDialogOpen(true);
              }}
            >
              Add Comment
            </Button>
          </Box>
          <List>
            {currentIDRP?.comments?.filter(comment => !comment.checkId)?.map((comment) => (
              renderComment(comment)
            ))}
            {(!currentIDRP?.comments || currentIDRP.comments.filter(comment => !comment.checkId).length === 0) && (
              <Typography variant="body2" color="textSecondary" align="center">
                No general comments yet. Click the button above to add one.
              </Typography>
            )}
          </List>
        </Box>
      )}

      {tabValue === 4 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
            IDRP System Documentation
          </Typography>

          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="creating-idrp-content"
              id="creating-idrp-header"
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                Creating an Intelligent Data Review Plan
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                Column Structure for Checks
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Column Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Auto-populated?</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Check ID</TableCell>
                      <TableCell>Unique identifier for the check</TableCell>
                      <TableCell>Yes (format: CHECK-001)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Check Type</TableCell>
                      <TableCell>Type of check (DQ, IRL, Dashboard)</TableCell>
                      <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Check Category</TableCell>
                      <TableCell>Category (Safety, Efficacy, Demographics, etc.)</TableCell>
                      <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Data Category</TableCell>
                      <TableCell>Subject, Safety, Efficacy, etc.</TableCell>
                      <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Visit</TableCell>
                      <TableCell>Visit where check applies (All, Screening, Baseline, etc.)</TableCell>
                      <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Detailed description of the check</TableCell>
                      <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Query Text</TableCell>
                      <TableCell>Text to be used in query</TableCell>
                      <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Roles Involved</TableCell>
                      <TableCell>Roles responsible for the check (DM, MM, SR, etc.)</TableCell>
                      <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Frequency</TableCell>
                      <TableCell>How often check is run (Daily, Weekly, etc.)</TableCell>
                      <TableCell>No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Source</TableCell>
                      <TableCell>Origin of check (Library, Similar Study, Custom)</TableCell>
                      <TableCell>Yes (based on selection)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                Creating a New IDRP
              </Typography>
              <Typography variant="body2" paragraph>
                1. Navigate to the IDRP Management page and click "Create New IDRP"
              </Typography>
              <Typography variant="body2" paragraph>
                2. Fill in the required study information including Study ID, Therapeutic Area, Indication, and Phase
              </Typography>
              <Typography variant="body2" paragraph>
                3. Define the Owner, Reviewer, and Approver roles for the IDRP
              </Typography>
              <Typography variant="body2" paragraph>
                4. Review AI-generated recommendations from the Standard Library and Similar Studies
              </Typography>
              <Typography variant="body2" paragraph>
                5. Accept, modify, or reject recommendations as needed
              </Typography>
              <Typography variant="body2" paragraph>
                6. Add custom checks if required
              </Typography>
              <Typography variant="body2" paragraph>
                7. Review and submit the IDRP
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="recommendations-content"
              id="recommendations-header"
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                Using iDRP Assist
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                Using iDRP Assist Recommendations
              </Typography>
              <Typography variant="body2" paragraph>
                The IDRP system provides two types of iDRP Assist-driven recommendations:
              </Typography>
              <Box sx={{ ml: 2, mb: 2 }}>
                <Typography variant="body2" paragraph>
                  <strong>Standard Library Recommendations:</strong> Based on study attributes (Therapeutic Area, Indication, Phase), metadata attributes, and commonly used checks in similar studies.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Similar Studies Recommendations:</strong> Based on historical data from previous studies with similar metadata, industry-standard checks, and study-specific rules.
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 3, color: 'primary.main' }}>
                Working with Recommendations
              </Typography>
              <Typography variant="body2" paragraph>
                1. <strong>Viewing Recommendations:</strong> Recommendations are displayed in the Library and Similar Studies sections during IDRP creation.
              </Typography>
              <Typography variant="body2" paragraph>
                2. <strong>Maximizing Recommendations:</strong> Click the maximize button to view recommendations in a larger dialog for better visibility when dealing with many checks.
              </Typography>
              <Typography variant="body2" paragraph>
                3. <strong>Filtering Recommendations:</strong> Use the search and filter options to narrow down recommendations based on specific criteria.
              </Typography>
              <Typography variant="body2" paragraph>
                4. <strong>Selecting Recommendations:</strong> Use checkboxes to select individual recommendations or use "Select All" to choose all displayed recommendations.
              </Typography>
              <Typography variant="body2" paragraph>
                5. <strong>Adding to IDRP:</strong> Click "Add Selected" to include chosen recommendations in your IDRP.
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 3, color: 'primary.main' }}>
                Adding Custom Checks
              </Typography>
              <Typography variant="body2" paragraph>
                1. Navigate to the "Checks" tab in the IDRP detail view
              </Typography>
              <Typography variant="body2" paragraph>
                2. Click the "Add Check" button
              </Typography>
              <Typography variant="body2" paragraph>
                3. Fill in all required fields in the dialog
              </Typography>
              <Typography variant="body2" paragraph>
                4. Select "Custom" as the source
              </Typography>
              <Typography variant="body2" paragraph>
                5. Click "Add" to save the custom check to the IDRP
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="workflow-content"
              id="workflow-header"
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                IDRP Workflow and Status Management
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                4-Status Workflow
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Allowed Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Chip label="Draft" size="small" color="info" />
                      </TableCell>
                      <TableCell>Initial state for new IDRPs</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">• Add, modify, or delete checks</Typography>
                          <Typography variant="body2">• Add comments</Typography>
                          <Typography variant="body2">• Move to In-Review status</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="In-Review" size="small" color="warning" />
                      </TableCell>
                      <TableCell>Shared with stakeholders for feedback</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">• Add comments only</Typography>
                          <Typography variant="body2">• Cannot modify checks</Typography>
                          <Typography variant="body2">• Move to Reviewed status</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Reviewed" size="small" color="secondary" />
                      </TableCell>
                      <TableCell>Feedback incorporated, ready for final review</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">• Add, modify, or delete checks</Typography>
                          <Typography variant="body2">• Add comments</Typography>
                          <Typography variant="body2">• Move to Approved status</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Approved" size="small" color="success" />
                      </TableCell>
                      <TableCell>Finalized and ready for execution</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">• View checks only</Typography>
                          <Typography variant="body2">• Add comments</Typography>
                          <Typography variant="body2">• Create new version</Typography>
                          <Typography variant="body2">• Inactivate checks (requires new version)</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 3, color: 'primary.main' }}>
                Changing IDRP Status
              </Typography>
              <Typography variant="body2" paragraph>
                1. From the IDRP detail view, click the status change button (label changes based on current status)
              </Typography>
              <Typography variant="body2" paragraph>
                2. Confirm the status change in the dialog
              </Typography>
              <Typography variant="body2" paragraph>
                3. The system will update the IDRP status and record the change in the history
              </Typography>
              <Typography variant="body2" paragraph>
                4. A toast notification will confirm the successful status change
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="versioning-content"
              id="versioning-header"
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                IDRP Versioning
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                Version Control Rules
              </Typography>
              <Box sx={{ ml: 2, mb: 3 }}>
                <Typography variant="body2" paragraph>
                  • Only approved IDRPs can be versioned
                </Typography>
                <Typography variant="body2" paragraph>
                  • The first approved version will be 1.0
                </Typography>
                <Typography variant="body2" paragraph>
                  • Only major versions are created (1.0, 2.0, 3.0, etc.)
                </Typography>
                <Typography variant="body2" paragraph>
                  • Version history is maintained in the IDRP history tab
                </Typography>
                <Typography variant="body2" paragraph>
                  • Creating a new version sets the status back to Draft
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 3, color: 'primary.main' }}>
                Creating a New Version
              </Typography>
              <Typography variant="body2" paragraph>
                1. From an approved IDRP, click the "Create New Version" button
              </Typography>
              <Typography variant="body2" paragraph>
                2. Confirm the creation of a new version in the dialog
              </Typography>
              <Typography variant="body2" paragraph>
                3. The system will:
              </Typography>
              <Box sx={{ ml: 4, mb: 2 }}>
                <Typography variant="body2" paragraph>
                  • Create a copy of the current IDRP
                </Typography>
                <Typography variant="body2" paragraph>
                  • Increment the version number (e.g., 1.0 to 2.0)
                </Typography>
                <Typography variant="body2" paragraph>
                  • Set the status to Draft
                </Typography>
                <Typography variant="body2" paragraph>
                  • Record the version creation in the history
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                4. You can now modify the new version as needed
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 3, color: 'primary.main' }}>
                Inactivating Checks in Approved IDRPs
              </Typography>
              <Typography variant="body2" paragraph>
                To inactivate a check in an approved IDRP:
              </Typography>
              <Typography variant="body2" paragraph>
                1. Create a new version of the IDRP
              </Typography>
              <Typography variant="body2" paragraph>
                2. In the new version, edit the check and mark it as inactive
              </Typography>
              <Typography variant="body2" paragraph>
                3. Move the IDRP through the workflow to get it approved
              </Typography>
              <Typography variant="body2" paragraph>
                4. The inactivated check will be preserved in the history but will no longer be active
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      
      {/* Add Check Dialog */}
      <Dialog
        open={addCheckDialogOpen}
        onClose={handleAddCheckDialogClose}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          Add Custom Checks
          <IconButton
            aria-label="close"
            onClick={handleAddCheckDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Enter Multiple Custom Checks
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Check Type</TableCell>
                    <TableCell>Check Category</TableCell>
                    <TableCell>Data Category</TableCell>
                    <TableCell>Visit</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Query Text</TableCell>
                    <TableCell>Roles</TableCell>
                    <TableCell>Frequency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customChecks.map((check, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <FormControl fullWidth size="small" required>
                          <Select
                            value={check.checkType}
                            onChange={(e) => handleCheckChange(index, 'checkType', e.target.value)}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Data Quality">Data Quality</MenuItem>
                            <MenuItem value="Data Consistency">Data Consistency</MenuItem>
                            <MenuItem value="Protocol Compliance">Protocol Compliance</MenuItem>
                            <MenuItem value="Safety">Safety</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth size="small" required>
                          <Select
                            value={check.checkCategory}
                            onChange={(e) => handleCheckChange(index, 'checkCategory', e.target.value)}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Missing Data">Missing Data</MenuItem>
                            <MenuItem value="Out of Range">Out of Range</MenuItem>
                            <MenuItem value="Logical Checks">Logical Checks</MenuItem>
                            <MenuItem value="Cross Form">Cross Form</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth size="small" required>
                          <Select
                            value={check.dataCategory}
                            onChange={(e) => handleCheckChange(index, 'dataCategory', e.target.value)}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Demographics">Demographics</MenuItem>
                            <MenuItem value="Vital Signs">Vital Signs</MenuItem>
                            <MenuItem value="Labs">Labs</MenuItem>
                            <MenuItem value="Adverse Events">Adverse Events</MenuItem>
                            <MenuItem value="Medications">Medications</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <Select
                            value={check.visit}
                            onChange={(e) => handleCheckChange(index, 'visit', e.target.value)}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Screening">Screening</MenuItem>
                            <MenuItem value="Baseline">Baseline</MenuItem>
                            <MenuItem value="Treatment">Treatment</MenuItem>
                            <MenuItem value="Follow-up">Follow-up</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          required
                          label="Description"
                          value={check.description}
                          onChange={(e) => handleCheckChange(index, 'description', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={check.queryText}
                          onChange={(e) => handleCheckChange(index, 'queryText', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <Select
                            multiple
                            value={check.roles}
                            onChange={(e) => handleCheckChange(index, 'roles', e.target.value)}
                            renderValue={(selected) => selected.join(', ')}
                          >
                            <MenuItem value="DM">Data Manager</MenuItem>
                            <MenuItem value="MM">Medical Monitor</MenuItem>
                            <MenuItem value="SR">Safety Reviewer</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <Select
                            value={check.frequency}
                            onChange={(e) => handleCheckChange(index, 'frequency', e.target.value)}
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Daily">Daily</MenuItem>
                            <MenuItem value="Weekly">Weekly</MenuItem>
                            <MenuItem value="Monthly">Monthly</MenuItem>
                            <MenuItem value="Quarterly">Quarterly</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddRow}
                color="primary"
              >
                Add Row
              </Button>
              <Button
                variant="contained"
                onClick={handleAddAllChecks}
                disabled={!customChecks.some(check => 
                  check.checkType && check.checkCategory && check.dataCategory && check.description
                )}
              >
                Add All Checks
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog
        open={commentsDialogOpen}
        onClose={handleCommentsClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Comments for check
          <IconButton
            aria-label="close"
            onClick={handleCommentsClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            {selectedCheckId && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  {currentIDRP.checks.find(c => c.id === selectedCheckId)?.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {getThreadedComments(selectedCheckId).map(comment => renderComment(comment))}
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    autoFocus
                    margin="dense"
                    label={replyToCommentId ? "Your reply" : "Your comment"}
                    fullWidth
                    multiline
                    rows={4}
                    value={newComment}
                    onChange={handleCommentChange}
                  />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {replyToCommentId && (
                      <Button 
                        color="inherit" 
                        onClick={() => setReplyToCommentId(null)}
                      >
                        Cancel Reply
                      </Button>
                    )}
                    <Button 
                      variant="contained" 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      {replyToCommentId ? 'Reply' : 'Add Comment'}
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit Check Dialog */}
      <Dialog
        open={editCheckDialogOpen}
        onClose={handleEditCheckDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Check</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Check Type</InputLabel>
                <Select
                  value={selectedCheck?.checkType || ''}
                  onChange={(e) => setSelectedCheck(prev => ({ ...prev, checkType: e.target.value }))}
                  label="Check Type"
                >
                  <MenuItem value="Critical Data">Critical Data</MenuItem>
                  <MenuItem value="Eligibility">Eligibility</MenuItem>
                  <MenuItem value="Safety">Safety</MenuItem>
                  <MenuItem value="Protocol Deviation">Protocol Deviation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Check Category</InputLabel>
                <Select
                  value={selectedCheck?.checkCategory || ''}
                  onChange={(e) => setSelectedCheck(prev => ({ ...prev, checkCategory: e.target.value }))}
                  label="Check Category"
                >
                  <MenuItem value="Critical Data">Critical Data</MenuItem>
                  <MenuItem value="Eligibility">Eligibility</MenuItem>
                  <MenuItem value="Safety">Safety</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Description"
                value={selectedCheck?.description || ''}
                onChange={(e) => setSelectedCheck(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Query Text"
                value={selectedCheck?.queryText || ''}
                onChange={(e) => setSelectedCheck(prev => ({ ...prev, queryText: e.target.value }))}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Roles</InputLabel>
                <Select
                  multiple
                  value={selectedCheck?.roles || []}
                  onChange={(e) => setSelectedCheck(prev => ({ ...prev, roles: e.target.value }))}
                  label="Roles"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="DM">Data Manager (DM)</MenuItem>
                  <MenuItem value="MM">Medical Monitor (MM)</MenuItem>
                  <MenuItem value="SR">Scientific Reviewer (SR)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={selectedCheck?.frequency || ''}
                  onChange={(e) => setSelectedCheck(prev => ({ ...prev, frequency: e.target.value }))}
                  label="Frequency"
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCheckDialogClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveEditedCheck}
            variant="contained"
            disabled={!selectedCheck?.checkType || !selectedCheck?.checkCategory || !selectedCheck?.description}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Check Dialog */}
      <Dialog
        open={deleteCheckDialogOpen}
        onClose={handleDeleteCheckDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Check</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this check? This action cannot be undone.
          </DialogContentText>
          {selectedCheck && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Check Details:
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {selectedCheck.checkType}
              </Typography>
              <Typography variant="body2">
                <strong>Category:</strong> {selectedCheck.checkCategory}
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {selectedCheck.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCheckDialogClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteCheck} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default IDRPDetail;
