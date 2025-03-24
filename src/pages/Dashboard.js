import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  LinearProgress,
  CardHeader,
  CardMedia,
  Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DraftsIcon from '@mui/icons-material/Drafts';

// Mock data for the dashboard
const mockIDRPs = [
  {
    id: 'IDRP-001',
    studyName: 'STUDY-001',
    status: 'Approved',
    createdDate: '2025-01-10',
    lastUpdated: '2025-03-15',
    checkCount: 42,
    collaborators: ['DM', 'MM', 'SR'],
    version: '1.0'
  },
  {
    id: 'IDRP-002',
    studyName: 'STUDY-002',
    status: 'In-Review',
    createdDate: '2025-02-15',
    lastUpdated: '2025-03-10',
    checkCount: 36,
    collaborators: ['DM', 'MM'],
    version: '0.2'
  },
  {
    id: 'IDRP-003',
    studyName: 'STUDY-003',
    status: 'Approved',
    createdDate: '2024-12-15',
    lastUpdated: '2025-02-28',
    checkCount: 51,
    collaborators: ['DM', 'MM', 'SR', 'SM'],
    version: '1.0'
  },
  {
    id: 'IDRP-004',
    studyName: 'STUDY-004',
    status: 'Approved',
    createdDate: '2024-11-20',
    lastUpdated: '2025-01-15',
    checkCount: 47,
    collaborators: ['DM', 'MM', 'SR', 'SM'],
    version: '2.0'
  },
  {
    id: 'IDRP-005',
    studyName: 'Phase 3 Breast Cancer Study',
    status: 'Reviewed',
    createdDate: '2025-03-01',
    lastUpdated: '2025-03-21',
    checkCount: 38,
    collaborators: ['DM', 'MM', 'SR'],
    version: '0.3'
  },
  {
    id: 'IDRP-006',
    studyName: 'Oncology Phase 2 Trial',
    status: 'Draft',
    createdDate: '2025-03-18',
    lastUpdated: '2025-03-18',
    checkCount: 12,
    collaborators: ['DM'],
    version: '0.1'
  }
];

// Role color mapping
const roleColors = {
  DM: '#4caf50', // Data Manager - Green
  MM: '#2196f3', // Medical Monitor - Blue
  SR: '#f44336', // Safety Reviewer - Red
  SM: '#ff9800'  // Study Manager - Orange
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
  'Approved': '#4caf50',    // Green
  'Reviewed': '#9c27b0'    // Purple
};

function Dashboard() {
  const theme = useTheme();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [idrps, setIdrps] = useState(mockIDRPs || []);

  // Load IDRPs from localStorage when the component mounts or when returning to the dashboard
  useEffect(() => {
    const loadIDRPs = () => {
      try {
        const storedIDRPs = JSON.parse(localStorage.getItem('idrps') || '[]');
        
        if (!Array.isArray(storedIDRPs)) {
          console.error('Stored IDRPs is not an array:', storedIDRPs);
          return;
        }
        
        // If no IDRPs in localStorage, initialize with mock data
        if (storedIDRPs.length === 0) {
          localStorage.setItem('idrps', JSON.stringify(mockIDRPs));
          setIdrps(mockIDRPs);
          return;
        }
        
        // Check if any mock IDRPs have been updated in localStorage
        const updatedMockIdrps = mockIDRPs.map(mockIdrp => {
          const storedVersion = storedIDRPs.find(stored => stored && stored.id === mockIdrp.id);
          return storedVersion || mockIdrp;
        });
        
        // Add any new IDRPs from localStorage that aren't in the mock data
        const existingIds = new Set(updatedMockIdrps.map(idrp => idrp.id));
        const newIdrps = [
          ...updatedMockIdrps,
          ...storedIDRPs.filter(idrp => idrp && !existingIds.has(idrp.id))
        ];
        
        setIdrps(newIdrps);
        
        // Update localStorage with the merged data
        localStorage.setItem('idrps', JSON.stringify(newIdrps));
      } catch (error) {
        console.error('Error loading IDRPs from localStorage:', error);
      }
    };

    loadIDRPs();
    
    // Add event listener for storage changes
    window.addEventListener('storage', loadIDRPs);
    
    // Add a custom event listener for IDRP updates
    const handleIDRPUpdate = () => loadIDRPs();
    window.addEventListener('idrp-updated', handleIDRPUpdate);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', loadIDRPs);
      window.removeEventListener('idrp-updated', handleIDRPUpdate);
    };
  }, []);

  const filteredIDRPs = idrps && Array.isArray(idrps) ? idrps.filter(idrp => 
    idrp && idrp.studyName && idrp.id && (
      idrp.studyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idrp.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  // Count IDRPs by status
  const statusCounts = idrps && Array.isArray(idrps) ? idrps.reduce((acc, idrp) => {
    if (idrp && idrp.status) {
      acc[idrp.status] = (acc[idrp.status] || 0) + 1;
    }
    return acc;
  }, {}) : {};

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<VisibilityIcon />}
            component={RouterLink}
            to="/idrps"
            sx={{ borderRadius: 2 }}
          >
            View All IDRPs
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/create"
            sx={{ borderRadius: 2 }}
          >
            Create New IDRP
          </Button>
        </Box>
      </Box>

      {/* Status Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card 
            elevation={3}
            sx={{ 
              borderRadius: 2,
              position: 'relative',
              overflow: 'visible',
              background: 'linear-gradient(120deg, #f5f5f5 30%, #e0e0e0 90%)'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                backgroundColor: '#757575', 
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3
              }}
            >
              <DraftsIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <CardContent sx={{ pt: 4, pb: 2, pl: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#757575' }}>
                  Draft
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {statusCounts['Draft'] || 0}
                </Typography>
              </Box>
            </CardContent>
            <LinearProgress 
              variant="determinate" 
              value={25} 
              sx={{ 
                height: 8, 
                borderBottomLeftRadius: 8, 
                borderBottomRightRadius: 8,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#757575'
                }
              }} 
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card 
            elevation={3}
            sx={{ 
              borderRadius: 2,
              position: 'relative',
              overflow: 'visible',
              background: 'linear-gradient(120deg, #e3f2fd 30%, #bbdefb 90%)'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                backgroundColor: '#2196f3', 
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3
              }}
            >
              <HourglassEmptyIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <CardContent sx={{ pt: 4, pb: 2, pl: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                  In-Review
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {statusCounts['In-Review'] || 0}
                </Typography>
              </Box>
            </CardContent>
            <LinearProgress 
              variant="determinate" 
              value={50} 
              sx={{ 
                height: 8, 
                borderBottomLeftRadius: 8, 
                borderBottomRightRadius: 8,
                backgroundColor: '#bbdefb',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#2196f3'
                }
              }} 
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card 
            elevation={3}
            sx={{ 
              borderRadius: 2,
              position: 'relative',
              overflow: 'visible',
              background: 'linear-gradient(120deg, #f3e5f5 30%, #e1bee7 90%)'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                backgroundColor: '#9c27b0', 
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3
              }}
            >
              <RateReviewIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <CardContent sx={{ pt: 4, pb: 2, pl: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                  Reviewed
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {statusCounts['Reviewed'] || 0}
                </Typography>
              </Box>
            </CardContent>
            <LinearProgress 
              variant="determinate" 
              value={75} 
              sx={{ 
                height: 8, 
                borderBottomLeftRadius: 8, 
                borderBottomRightRadius: 8,
                backgroundColor: '#e1bee7',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#9c27b0'
                }
              }} 
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card 
            elevation={3}
            sx={{ 
              borderRadius: 2,
              position: 'relative',
              overflow: 'visible',
              background: 'linear-gradient(120deg, #e8f5e9 30%, #c8e6c9 90%)'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 20, 
                backgroundColor: '#4caf50', 
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3
              }}
            >
              <CheckCircleIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <CardContent sx={{ pt: 4, pb: 2, pl: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  Approved
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {statusCounts['Approved'] || 0}
                </Typography>
              </Box>
            </CardContent>
            <LinearProgress 
              variant="determinate" 
              value={100} 
              sx={{ 
                height: 8, 
                borderBottomLeftRadius: 8, 
                borderBottomRightRadius: 8,
                backgroundColor: '#c8e6c9',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4caf50'
                }
              }} 
            />
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search IDRPs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, mr: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* IDRP Listing */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        IDRP Listing
      </Typography>
      
      <Grid container spacing={3}>
        {filteredIDRPs && filteredIDRPs.length > 0 ? filteredIDRPs.map((idrp) => (
          <Grid item xs={12} md={6} lg={4} key={idrp.id}>
            <Card 
              elevation={2} 
              sx={{ 
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {idrp.studyName}
                  </Typography>
                }
                subheader={idrp.id}
                action={
                  <Chip 
                    label={idrp.status} 
                    size="small"
                    sx={{ 
                      backgroundColor: statusColors[idrp.status] + '20',
                      color: statusColors[idrp.status],
                      fontWeight: 'bold'
                    }}
                  />
                }
              />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Stepper 
                    activeStep={
                      idrp.status === 'Draft' ? 0 : 
                      idrp.status === 'In-Review' ? 1 : 
                      idrp.status === 'Reviewed' ? 2 : 3
                    }
                    alternativeLabel
                    sx={{ 
                      '& .MuiStepLabel-root .Mui-completed': {
                        color: statusColors[idrp.status]
                      },
                      '& .MuiStepLabel-root .Mui-active': {
                        color: statusColors[idrp.status]
                      }
                    }}
                  >
                    <Step>
                      <StepLabel>Draft</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>In-Review</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Reviewed</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Approved</StepLabel>
                    </Step>
                  </Stepper>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Badge 
                        badgeContent={idrp.checkCount} 
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <CheckCircleIcon color="action" />
                      </Badge>
                      <Typography variant="body2">Checks</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>v{idrp.version}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Created: {idrp.createdDate || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UpdateIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Updated: {idrp.lastUpdated}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Collaborators:</Typography>
                  <AvatarGroup max={4}>
                    {idrp.collaborators && Array.isArray(idrp.collaborators) ? idrp.collaborators.map((role, index) => (
                      <Tooltip key={index} title={roleNames[role]}>
                        <Avatar 
                          sx={{ 
                            width: 30, 
                            height: 30, 
                            fontSize: '0.75rem',
                            bgcolor: roleColors[role]
                          }}
                        >
                          {role}
                        </Avatar>
                      </Tooltip>
                    )) : null}
                  </AvatarGroup>
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button 
                  component={RouterLink}
                  to={`/idrp/${idrp.id}`}
                  size="small"
                  startIcon={<VisibilityIcon />}
                >
                  View
                </Button>
                <Button 
                  component={RouterLink}
                  to={`/idrp/${idrp.id}/edit`}
                  size="small"
                  startIcon={<EditIcon />}
                  disabled={idrp.status === 'In-Review'}
                  sx={{ ml: 'auto' }}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">No IDRPs found matching your search criteria.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Dashboard;
