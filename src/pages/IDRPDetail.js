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
import { toast } from 'react-toastify';

// Mock data for IDRP details
const mockIDRPs = {
  'IDRP-001': {
    id: 'IDRP-001',
    studyName: 'STUDY-001',
    studyId: 'XYZ-123-P2',
    therapeutic: 'Oncology',
    indication: 'Breast Cancer',
    phase: 'Phase 2',
    status: 'Approved',
    lastUpdated: '2025-03-15',
    createdBy: 'John Doe',
    createdDate: '2025-03-10',
    description: 'Phase 2 study for investigational compound XYZ-123 in adult patients with condition ABC.',
    version: '1.0',
    checks: [
      {
        id: 'CHECK-001',
        checkType: 'DQ',
        checkCategory: 'Demographics',
        dataCategory: 'Subject',
        visit: 'All',
        description: 'Check for missing date of birth',
        queryText: 'Identify all subjects with missing DOB',
        roles: ['DM', 'MM'],
        frequency: 'Daily',
        source: 'Library'
      },
      {
        id: 'CHECK-002',
        checkType: 'DQ',
        checkCategory: 'Demographics',
        dataCategory: 'Subject',
        visit: 'Screening',
        description: 'Check for age outliers',
        queryText: 'Identify subjects with age < 18 or > 80',
        roles: ['DM', 'MM'],
        frequency: 'Weekly',
        source: 'Library'
      },
      {
        id: 'CHECK-003',
        checkType: 'DQ',
        checkCategory: 'Vitals',
        dataCategory: 'Safety',
        visit: 'All',
        description: 'Check for missing vital signs',
        queryText: 'Identify visits with incomplete vital measurements',
        roles: ['DM'],
        frequency: 'Daily',
        source: 'Library'
      },
      {
        id: 'CHECK-004',
        checkType: 'IRL',
        checkCategory: 'Labs',
        dataCategory: 'Safety',
        visit: 'All',
        description: 'Check for out-of-range lab values',
        queryText: 'Identify lab values outside of 3 standard deviations',
        roles: ['DM', 'MM', 'SR'],
        frequency: 'Daily',
        source: 'Library'
      },
      {
        id: 'CHECK-005',
        checkType: 'DQ',
        checkCategory: 'Adverse Events',
        dataCategory: 'Safety',
        visit: 'All',
        description: 'Check for AEs without resolution date',
        queryText: 'Identify ongoing AEs without explanation',
        roles: ['DM', 'SR'],
        frequency: 'Daily',
        source: 'Library'
      }
    ],
    comments: [
      {
        id: 1,
        user: 'Jane Smith',
        role: 'MM',
        date: '2025-03-16',
        text: 'Please add a check for concomitant medications',
        checkId: null
      },
      {
        id: 2,
        user: 'John Doe',
        role: 'DM',
        date: '2025-03-17',
        text: 'I will add that check today',
        checkId: null
      },
      {
        id: 3,
        user: 'Sarah Johnson',
        role: 'SR',
        date: '2025-03-17',
        text: 'We need more detailed checks for safety data',
        checkId: 'CHECK-001'
      }
    ],
    history: [
      {
        date: '2025-03-10',
        user: 'John Doe',
        action: 'Created IDRP',
        version: '0.1'
      },
      {
        date: '2025-03-12',
        user: 'John Doe',
        action: 'Added 3 checks',
        version: '0.1'
      },
      {
        date: '2025-03-15',
        user: 'John Doe',
        action: 'Added 2 more checks',
        version: '0.1'
      }
    ]
  },
  'IDRP-002': {
    id: 'IDRP-002',
    studyName: 'STUDY-002',
    studyId: 'ABC-789-P3',
    therapeutic: 'Neurology',
    indication: 'Alzheimer\'s',
    phase: 'Phase 3',
    status: 'In-Review',
    lastUpdated: '2025-03-10',
    createdBy: 'Jane Smith',
    createdDate: '2025-03-01',
    description: 'Phase 3 study for approved compound ABC-789 in pediatric patients with condition XYZ.',
    version: '0.2',
    checks: [
      {
        id: 'CHECK-101',
        checkType: 'DQ',
        checkCategory: 'Demographics',
        dataCategory: 'Subject',
        visit: 'Screening',
        description: 'Check for missing date of birth',
        queryText: 'Identify all subjects with missing DOB',
        roles: ['DM', 'MM'],
        frequency: 'Daily',
        source: 'Library'
      },
      {
        id: 'CHECK-102',
        checkType: 'DQ',
        checkCategory: 'Concomitant Medications',
        dataCategory: 'Safety',
        visit: 'All',
        description: 'Check for prohibited medications',
        queryText: 'Identify subjects taking medications from prohibited list',
        roles: ['DM', 'MM'],
        frequency: 'Daily',
        source: 'Similar Study'
      }
    ],
    comments: [
      {
        id: 1,
        user: 'Michael Brown',
        role: 'SM',
        date: '2025-03-11',
        text: 'The enrollment dashboard looks good',
        checkId: null
      },
      {
        id: 2,
        user: 'Lisa Chen',
        role: 'MM',
        date: '2025-03-12',
        text: 'We should add more detailed lab value checks',
        checkId: 'CHECK-101'
      }
    ],
    history: [
      {
        date: '2025-03-01',
        user: 'Jane Smith',
        action: 'Created IDRP',
        version: '0.1'
      },
      {
        date: '2025-03-05',
        user: 'Jane Smith',
        action: 'Added 2 checks',
        version: '0.1'
      },
      {
        date: '2025-03-10',
        user: 'Jane Smith',
        action: 'Submitted for review',
        version: '0.2'
      }
    ]
  },
  'IDRP-003': {
    id: 'IDRP-003',
    studyName: 'STUDY-003',
    studyId: 'DEF-456-P1',
    therapeutic: 'Infectious Disease',
    indication: 'COVID-19',
    phase: 'Phase 1',
    status: 'Approved',
    lastUpdated: '2025-02-28',
    createdBy: 'Robert Johnson',
    createdDate: '2025-02-10',
    description: 'Phase 1 study for investigational compound DEF-456 in healthy volunteers.',
    version: '1.0',
    checks: [
      {
        id: 'CHECK-201',
        checkType: 'DQ',
        checkCategory: 'Demographics',
        dataCategory: 'Subject',
        visit: 'Screening',
        description: 'Check for missing date of birth',
        queryText: 'Identify all subjects with missing DOB',
        roles: ['DM', 'MM'],
        frequency: 'Daily',
        source: 'Library'
      },
      {
        id: 'CHECK-202',
        checkType: 'Dashboard',
        checkCategory: 'Vitals',
        dataCategory: 'Safety',
        visit: 'All',
        description: 'Check for abnormal vital signs',
        queryText: 'Identify subjects with abnormal vital signs',
        roles: ['DM', 'MM', 'SR'],
        frequency: 'Daily',
        source: 'Library'
      },
      {
        id: 'CHECK-203',
        checkType: 'IRL',
        checkCategory: 'Labs',
        dataCategory: 'Safety',
        visit: 'All',
        description: 'Check for abnormal lab values',
        queryText: 'Identify subjects with abnormal lab values',
        roles: ['DM', 'MM', 'SR'],
        frequency: 'Daily',
        source: 'Library'
      }
    ],
    comments: [
      {
        id: 1,
        user: 'Robert Wilson',
        role: 'MM',
        date: '2025-02-20',
        text: 'All checks look appropriate for this study',
        checkId: null
      },
      {
        id: 2,
        user: 'Emily Davis',
        role: 'SR',
        date: '2025-02-22',
        text: 'The vital signs monitoring check is well defined',
        checkId: 'CHECK-202'
      },
      {
        id: 3,
        user: 'David Martinez',
        role: 'SM',
        date: '2025-02-25',
        text: 'Approved for implementation',
        checkId: null
      }
    ],
    history: [
      {
        date: '2025-02-10',
        user: 'Robert Johnson',
        action: 'Created IDRP',
        version: '0.1'
      },
      {
        date: '2025-02-15',
        user: 'Robert Johnson',
        action: 'Added 3 checks',
        version: '0.1'
      },
      {
        date: '2025-02-20',
        user: 'Robert Johnson',
        action: 'Submitted for review',
        version: '0.2'
      },
      {
        date: '2025-02-28',
        user: 'Sarah Williams',
        action: 'Approved IDRP',
        version: '1.0'
      }
    ]
  }
};

// Role colors for avatars
const roleColors = {
  'DM': '#1976d2',  // Data Manager - Blue
  'MM': '#9c27b0',  // Medical Monitor - Purple
  'SR': '#f44336',  // Safety Reviewer - Red
  'SM': '#4caf50'   // Study Manager - Green
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
  const [newCheckData, setNewCheckData] = useState({
    checkType: '',
    checkCategory: '',
    dataCategory: '',
    visit: '',
    description: '',
    queryText: '',
    roles: [], // Initialize as empty array for multiple select
    frequency: '',
    source: ''
  });
  const [addCommentDialogOpen, setAddCommentDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [currentIDRP, setCurrentIDRP] = useState(null);
  const [selectedCheckForComment, setSelectedCheckForComment] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [checkComments, setCheckComments] = useState([]);
  const [editCheckDialogOpen, setEditCheckDialogOpen] = useState(false);
  const [currentEditCheck, setCurrentEditCheck] = useState(null);
  const [editedCheckData, setEditedCheckData] = useState({});
  const [deleteCheckDialogOpen, setDeleteCheckDialogOpen] = useState(false);
  const [checkToDelete, setCheckToDelete] = useState(null);
  const [newVersionDialogOpen, setNewVersionDialogOpen] = useState(false);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const idrpData = mockIDRPs[id] || mockIDRPs['IDRP-001']; // Default to first IDRP if ID not found
    
    // Check if we have this IDRP in localStorage
    try {
      const storedIDRPs = JSON.parse(localStorage.getItem('idrps') || '[]');
      const storedIDRP = storedIDRPs.find(idrp => idrp.id === id);
      
      if (storedIDRP) {
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

  const handleAddCheckDialogOpen = () => {
    // Reset the form data
    setNewCheckData({
      checkType: '',
      checkCategory: '',
      dataCategory: '',
      visit: '',
      description: '',
      queryText: '',
      roles: [], // Initialize as empty array for multiple select
      frequency: '',
      source: ''
    });
    setAddCheckDialogOpen(true);
  };

  const handleAddCheckDialogClose = () => {
    setAddCheckDialogOpen(false);
  };

  const handleNewCheckChange = (field, value) => {
    setNewCheckData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCheck = () => {
    // Create a new check ID
    const checkCount = currentIDRP.checks && currentIDRP.checks.length ? currentIDRP.checks.length : 0;
    const newCheckId = `CHECK-${checkCount + 1}`;
    
    // Create the new check object
    const newCheck = {
      id: newCheckId,
      ...newCheckData
    };
    
    // Update IDRP with new check
    const updatedIDRP = {
      ...currentIDRP,
      checks: [...currentIDRP.checks, newCheck],
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...currentIDRP.history,
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User', // In a real app, this would be the logged-in user
          action: `Added check ${newCheckId}`,
          version: currentIDRP.version
        }
      ]
    };

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
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
    }

    // Close the dialog
    handleAddCheckDialogClose();
  };

  const handleAddCommentDialogOpen = (checkId = null) => {
    setSelectedCheckForComment(checkId);
    setAddCommentDialogOpen(true);
  };

  const handleAddCommentDialogClose = () => {
    setSelectedCheckForComment(null);
    setAddCommentDialogOpen(false);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    // Create a new comment object
    const newCommentObj = {
      id: `comment-${Date.now()}`,
      checkId: selectedCheckForComment,
      user: 'Current User', // In a real app, this would be the logged-in user
      role: 'DM', // In a real app, this would be the user's role
      text: newComment,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Update IDRP with new comment
    const updatedIDRP = {
      ...currentIDRP,
      comments: [...(currentIDRP.comments || []), newCommentObj],
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...(currentIDRP.history || []),
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User', // In a real app, this would be the logged-in user
          action: `Added comment ${selectedCheckForComment ? `to check ${selectedCheckForComment}` : 'to IDRP'}`,
          version: currentIDRP.version
        }
      ]
    };

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
      window.dispatchEvent(new CustomEvent('comment-added', { detail: newCommentObj }));
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
    }

    // Reset form
    setNewComment('');
    setSelectedCheckForComment(null);
    setAddCommentDialogOpen(false);
  };

  const handleStatusChangeDialogOpen = () => {
    const nextStatus = nextStatusMap[currentIDRP.status];
    
    setStatusChangeDialogOpen(true);
  };

  const handleCreateNewVersion = () => {
    if (currentIDRP.status !== 'Approved') {
      toast.error('Can only create a new version from an approved IDRP');
      return;
    }
    
    setNewVersionDialogOpen(true);
  };

  const handleConfirmNewVersion = () => {
    if (currentIDRP.status !== 'Approved') {
      toast.error('Can only create a new version from an approved IDRP');
      return;
    }

    // Parse current version and increment major version
    const currentVersion = parseFloat(currentIDRP.version);
    const majorVersion = Math.floor(currentVersion);
    const newVersion = (majorVersion + 1).toFixed(1);
    
    // Create a new version with Draft status
    const updatedIDRP = {
      ...currentIDRP,
      status: 'Draft',
      version: newVersion,
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...currentIDRP.history,
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User', // In a real app, this would be the logged-in user
          action: `Created new version ${newVersion} from version ${currentIDRP.version}`,
          version: newVersion
        }
      ]
    };

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
      toast.success(`Created new version ${newVersion} successfully`);
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
      toast.error('Error creating new version');
    }
  };

  const handleStatusChange = () => {
    const nextStatus = nextStatusMap[currentIDRP.status];
    const updatedIDRP = {
      ...currentIDRP,
      status: nextStatus,
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...currentIDRP.history,
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User', // In a real app, this would be the logged-in user
          action: `Changed status from ${currentIDRP.status} to ${nextStatus}`,
          version: currentIDRP.version
        }
      ]
    };

    // If moving to Approved, update version
    if (nextStatus === 'Approved') {
      // Parse current version and increment major version
      const currentVersion = parseFloat(currentIDRP.version);
      const majorVersion = Math.floor(currentVersion);
      updatedIDRP.version = (majorVersion + 1).toFixed(1);
      
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
      if (nextStatus === 'Approved') {
        toast.success(`IDRP approved and version updated to ${updatedIDRP.version}`);
      } else {
        toast.success(`Status changed to ${nextStatus}`);
      }
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
      toast.error('Error changing status');
    }
  };

  // Handle opening the check comments dialog
  const handleCheckCommentsOpen = (checkId) => {
    const check = currentIDRP.checks.find(c => c.id === checkId);
    const comments = currentIDRP.comments.filter(c => c.checkId === checkId);
    setSelectedCheckForComment(checkId);
    setCheckComments(comments);
    setCommentDialogOpen(true);
  };

  // Handle closing the check comments dialog
  const handleCheckCommentsClose = () => {
    setSelectedCheckForComment(null);
    setCheckComments([]);
    setCommentDialogOpen(false);
  };

  // Check if a check has comments
  const checkHasComments = (checkId) => {
    return currentIDRP?.comments?.some(c => c.checkId === checkId) || false;
  };

  // Get the number of comments for a check
  const getCommentCount = (checkId) => {
    return currentIDRP?.comments?.filter(c => c.checkId === checkId).length || 0;
  };

  // Check if user can edit checks based on status
  const canEditChecks = currentIDRP.status === 'Draft' || currentIDRP.status === 'Reviewed';
  
  // Check if user can add comments (always allowed)
  const canAddComments = true;

  // Set edit mode based on prop and permissions
  const editMode = isEditing && canEditChecks;

  const handleEditCheckDialogOpen = (check) => {
    setCurrentEditCheck(check);
    setEditedCheckData({ ...check });
    setEditCheckDialogOpen(true);
  };

  const handleEditCheckDialogClose = () => {
    setCurrentEditCheck(null);
    setEditedCheckData({});
    setEditCheckDialogOpen(false);
  };

  const handleEditCheckChange = (field, value) => {
    setEditedCheckData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteCheckDialogOpen = (check) => {
    setCheckToDelete(check);
    setDeleteCheckDialogOpen(true);
  };

  const handleDeleteCheckDialogClose = () => {
    setCheckToDelete(null);
    setDeleteCheckDialogOpen(false);
  };

  const handleDeleteCheck = () => {
    if (!checkToDelete) return;

    // Create updated IDRP with check removed
    const updatedChecks = currentIDRP.checks.filter(c => c.id !== checkToDelete.id);
    
    const updatedIDRP = {
      ...currentIDRP,
      checks: updatedChecks,
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...currentIDRP.history,
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User', // In a real app, this would be the logged-in user
          action: `Deleted check ${checkToDelete.id}`,
          version: currentIDRP.version
        }
      ]
    };

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
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
    }

    handleDeleteCheckDialogClose();
  };

  const handleSaveEditedCheck = (editedCheck) => {
    if (!currentEditCheck) return;

    // Create updated IDRP with edited check
    const updatedChecks = currentIDRP.checks.map(c => 
      c.id === currentEditCheck.id ? { ...c, ...editedCheck } : c
    );
    
    const updatedIDRP = {
      ...currentIDRP,
      checks: updatedChecks,
      lastUpdated: new Date().toISOString().split('T')[0],
      history: [
        ...currentIDRP.history,
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User', // In a real app, this would be the logged-in user
          action: `Edited check ${currentEditCheck.id}`,
          version: currentIDRP.version
        }
      ]
    };

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
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
    }

    handleEditCheckDialogClose();
  };

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
            <MenuItem onClick={() => { handleMenuClose(); }}>
              <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
              View History
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); }} disabled={currentIDRP.status === 'Approved'}>
              <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} />
              Push to Veeva
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
                
                <Typography variant="body2" sx={{ mt: 2 }}>
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
                
                <Typography variant="body2" sx={{ mt: 2 }}>
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
                
                <Typography variant="body2" sx={{ mt: 2 }}>
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
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Version: <Chip label={currentIDRP?.version || '0.1'} size="small" color="success" />
                </Typography>
                
                <Typography variant="body2" sx={{ mt: 2 }}>
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
                        <IconButton 
                          size="small"
                          disabled={currentIDRP.status === 'Approved' || currentIDRP.status === 'In-Review'}
                          onClick={() => handleEditCheckDialogOpen(check)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          disabled={currentIDRP.status === 'Approved' || currentIDRP.status === 'In-Review'}
                          onClick={() => handleDeleteCheckDialogOpen(check)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => handleCheckCommentsOpen(check.id)}
                          color={checkHasComments(check.id) ? "primary" : "default"}
                        >
                          <Badge 
                            badgeContent={getCommentCount(check.id)} 
                            color="secondary" 
                            invisible={!checkHasComments(check.id)}
                          >
                            <CommentIcon fontSize="small" />
                          </Badge>
                        </IconButton>
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
              onClick={() => handleAddCommentDialogOpen()}
            >
              Add General Comment
            </Button>
          </Box>
            
          {currentIDRP && currentIDRP.comments && currentIDRP.comments.length > 0 ? (
            <Box>
              {/* Group comments by check */}
              <Typography variant="h6" sx={{ mb: 2 }}>General Comments</Typography>
              <Paper sx={{ p: 2, mb: 4 }}>
                {currentIDRP.comments
                  .filter(comment => !comment.checkId)
                  .length > 0 ? (
                    currentIDRP.comments
                      .filter(comment => !comment.checkId)
                      .map(comment => (
                        <Box key={comment.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ bgcolor: roleColors[comment.role] || '#ccc', width: 32, height: 32, mr: 1, fontSize: '0.875rem' }}>
                              {comment.user && comment.user.substring(0, 2)}
                            </Avatar>
                            <Typography variant="subtitle2">{comment.user} ({comment.role})</Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                              {comment.date}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {comment.text}
                          </Typography>
                        </Box>
                      ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No general comments available
                    </Typography>
                  )}
              </Paper>
                
              <Typography variant="h6" sx={{ mb: 2 }}>Check-Specific Comments</Typography>
              {/* Group comments by check ID */}
              {currentIDRP && currentIDRP.comments && currentIDRP.checks && 
                currentIDRP.comments.filter(comment => comment.checkId).length > 0 ? (
                  Array.from(new Set(currentIDRP.comments
                    .filter(comment => comment.checkId)
                    .map(comment => comment.checkId)))
                    .map(checkId => {
                      const checkComments = currentIDRP.comments.filter(comment => comment.checkId === checkId);
                      const check = currentIDRP.checks.find(c => c.id === checkId);
                        
                      return (
                        <Paper key={checkId} sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Check {checkId}: {check ? check.description : 'Unknown Check'}
                          </Typography>
                          {checkComments.map(comment => (
                            <Box key={comment.id} sx={{ mb: 2, pl: 2, borderLeft: '3px solid #1976d2' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar sx={{ bgcolor: roleColors[comment.role] || '#ccc', width: 32, height: 32, mr: 1, fontSize: '0.875rem' }}>
                                  {comment.user && comment.user.substring(0, 2)}
                                </Avatar>
                                <Typography variant="subtitle2">{comment.user} ({comment.role})</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                                  {comment.date}
                                </Typography>
                              </Box>
                              <Typography variant="body2">
                                {comment.text}
                              </Typography>
                            </Box>
                          ))}
                          <Button 
                            size="small" 
                            startIcon={<CommentIcon />}
                            onClick={() => handleAddCommentDialogOpen(checkId)}
                            sx={{ mt: 1 }}
                          >
                            Reply
                          </Button>
                        </Paper>
                      );
                    })
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No check-specific comments available
                  </Typography>
                )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CommentIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="textSecondary">
                No comments yet. Add a general comment or comment on a specific check.
              </Typography>
            </Box>
          )}
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
                Recommendations and Check Management
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                Using AI Recommendations
              </Typography>
              <Typography variant="body2" paragraph>
                The IDRP system provides two types of AI-driven recommendations:
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
    </Box>
  );
}

export default IDRPDetail;
