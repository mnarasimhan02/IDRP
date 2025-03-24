import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  TablePagination,
  StepConnector,
  StepIcon,
  Avatar,
  Tooltip,
  LinearProgress,
  Badge,
  Alert,
  AlertTitle,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InfoIcon from '@mui/icons-material/Info';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';
import DescriptionIcon from '@mui/icons-material/Description';
import BiotechIcon from '@mui/icons-material/Biotech';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';

// Mock data for AI recommendations
const mockLibraryChecks = [
  {
    id: 'LIB-001',
    checkType: 'DQ',
    checkCategory: 'Demographics',
    dataCategory: 'Subject',
    visit: 'All',
    description: 'Check for missing date of birth',
    queryText: 'Identify all subjects with missing DOB',
    roles: ['DM', 'MM'],
    frequency: 'Daily',
    source: 'Library',
    confidence: 95
  },
  {
    id: 'LIB-002',
    checkType: 'DQ',
    checkCategory: 'Demographics',
    dataCategory: 'Subject',
    visit: 'Screening',
    description: 'Check for age outliers',
    queryText: 'Identify subjects with age < 18 or > 80',
    roles: ['DM', 'MM'],
    frequency: 'Weekly',
    source: 'Library',
    confidence: 92
  },
  {
    id: 'LIB-003',
    checkType: 'DQ',
    checkCategory: 'Vitals',
    dataCategory: 'Safety',
    visit: 'All',
    description: 'Check for missing vital signs',
    queryText: 'Identify visits with incomplete vital measurements',
    roles: ['DM', 'SR'],
    frequency: 'Daily',
    source: 'Library',
    confidence: 88
  },
  {
    id: 'LIB-004',
    checkType: 'IRL',
    checkCategory: 'Labs',
    dataCategory: 'Safety',
    visit: 'All',
    description: 'Check for out-of-range lab values',
    queryText: 'Identify lab values outside of 3 standard deviations',
    roles: ['DM', 'MM', 'SR'],
    frequency: 'Daily',
    source: 'Library',
    confidence: 90
  },
  {
    id: 'LIB-005',
    checkType: 'Dashboard',
    checkCategory: 'Adverse Events',
    dataCategory: 'Safety',
    visit: 'All',
    description: 'Check for AEs without resolution date',
    queryText: 'Identify ongoing AEs without explanation',
    roles: ['DM', 'SR'],
    frequency: 'Daily',
    source: 'Library',
    confidence: 94
  }
];

const mockSimilarStudyChecks = [
  {
    id: 'SIM-001',
    checkType: 'DQ',
    checkCategory: 'Concomitant Medications',
    dataCategory: 'Safety',
    visit: 'All',
    description: 'Check for prohibited medications',
    queryText: 'Identify subjects taking medications from prohibited list',
    roles: ['DM', 'MM'],
    frequency: 'Weekly',
    source: 'Similar Study',
    similarStudy: 'STUDY-XYZ',
    confidence: 85
  },
  {
    id: 'SIM-002',
    checkType: 'IRL',
    checkCategory: 'Protocol Deviations',
    dataCategory: 'Compliance',
    visit: 'Screening',
    description: 'Check for inclusion/exclusion violations',
    queryText: 'Identify subjects not meeting key I/E criteria',
    roles: ['DM', 'MM', 'SM'],
    frequency: 'Weekly',
    source: 'Similar Study',
    similarStudy: 'STUDY-ABC',
    confidence: 82
  },
  {
    id: 'SIM-003',
    checkType: 'Dashboard',
    checkCategory: 'Efficacy',
    dataCategory: 'Efficacy',
    visit: 'All',
    description: 'Check for missing primary endpoint data',
    queryText: 'Identify subjects missing primary outcome measure',
    roles: ['DM', 'MM', 'SR'],
    frequency: 'Daily',
    source: 'Similar Study',
    similarStudy: 'STUDY-DEF',
    confidence: 78
  }
];

// Mock data for studies
const mockStudies = [
  {
    studyId: 'STUDY-001',
    studyName: 'Phase 3 Breast Cancer Study',
    description: 'A randomized, double-blind, placebo-controlled study evaluating the efficacy and safety of Drug X in patients with metastatic breast cancer.',
    phase: 'Phase 3',
    therapeutic: 'Oncology',
    indication: 'Breast Cancer',
    population: 'Adult'
  },
  {
    studyId: 'STUDY-002',
    studyName: 'Phase 2 Hypertension Trial',
    description: 'A multi-center study to evaluate the efficacy of Drug Y in patients with uncontrolled hypertension.',
    phase: 'Phase 2',
    therapeutic: 'Cardiology',
    indication: 'Hypertension',
    population: 'Adult'
  },
  {
    studyId: 'STUDY-003',
    studyName: 'Phase 1 Alzheimer\'s Study',
    description: 'First-in-human study to assess the safety, tolerability, and pharmacokinetics of Drug Z in patients with early Alzheimer\'s disease.',
    phase: 'Phase 1',
    therapeutic: 'Neurology',
    indication: 'Alzheimer\'s',
    population: 'Geriatric'
  },
  {
    studyId: 'STUDY-004',
    studyName: 'Phase 3 COVID-19 Vaccine Trial',
    description: 'A large-scale clinical trial to evaluate the efficacy and safety of Vaccine A against COVID-19 infection.',
    phase: 'Phase 3',
    therapeutic: 'Infectious Disease',
    indication: 'COVID-19',
    population: 'Mixed'
  }
];

const steps = ['Study Information', 'AI Recommendations', 'Review & Finalize'];

// Custom styled components for the stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${StepConnector.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${StepConnector.active}`]: {
    [`& .${StepConnector.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg, #2196f3 0%, #3f51b5 50%, #673ab7 100%)',
    },
  },
  [`&.${StepConnector.completed}`]: {
    [`& .${StepConnector.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg, #2196f3 0%, #3f51b5 50%, #673ab7 100%)',
    },
  },
  [`& .${StepConnector.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient( 136deg, #2196f3 0%, #3f51b5 50%, #673ab7 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient( 136deg, #2196f3 0%, #3f51b5 50%, #673ab7 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <AssignmentIcon />,
    2: <AutoAwesomeIcon />,
    3: <VerifiedIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

function IDRPCreation() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [studyInfo, setStudyInfo] = useState({
    studyId: '',
    studyName: '',
    studyPhase: '',
    therapeutic: '',
    indication: '',
    population: '',
    description: '',
    owner: '',
    reviewers: [],
    approvers: []
  });
  const [selectedChecks, setSelectedChecks] = useState([]);
  const [customChecks, setCustomChecks] = useState([]);
  const [customCheckRows, setCustomCheckRows] = useState([
    {
      id: '',
      checkType: '',
      checkCategory: '',
      dataCategory: '',
      visit: '',
      description: '',
      queryText: '',
      rolesInvolved: [],
      frequency: ''
    }
  ]);
  const [showCustomCheckForm, setShowCustomCheckForm] = useState(false);
  const [libraryPage, setLibraryPage] = useState(0);
  const [similarStudiesPage, setSimilarStudiesPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
  const [similarStudiesDialogOpen, setSimilarStudiesDialogOpen] = useState(false);
  const [expandedSearchTerm, setExpandedSearchTerm] = useState('');
  const [expandedFilterType, setExpandedFilterType] = useState('');
  const [expandedRowsPerPage, setExpandedRowsPerPage] = useState(10);
  const [expandedLibraryPage, setExpandedLibraryPage] = useState(0);
  const [expandedSimilarStudiesPage, setExpandedSimilarStudiesPage] = useState(0);

  const generateMoreMockChecks = (baseChecks, count, prefix) => {
    const result = [...baseChecks];
    const checkTypes = ['DQ', 'IRL', 'Dashboard'];
    const checkCategories = ['Demographics', 'Vitals', 'Labs', 'Adverse Events', 'Concomitant Medications', 'Protocol Deviations', 'Efficacy'];
    const dataCategories = ['Subject', 'Safety', 'Compliance', 'Efficacy'];
    const visits = ['All', 'Screening', 'Baseline', 'Week 1', 'Week 2', 'Week 4', 'Week 8', 'Week 12', 'End of Treatment', 'Follow-up'];
    const descriptions = [
      'Check for missing data',
      'Verify data consistency',
      'Validate against protocol criteria',
      'Identify outliers',
      'Check for protocol violations',
      'Verify visit compliance',
      'Check for data entry errors'
    ];
    const queryTexts = [
      'Query to check for missing data',
      'Query to verify data consistency',
      'Query to validate against protocol criteria',
      'Query to identify outliers',
      'Query to check for protocol violations',
      'Query to verify visit compliance',
      'Query to check for data entry errors'
    ];
    const roles = ['DM', 'MM', 'SR', 'SM'];
    const frequencies = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Ad-hoc'];
  
    for (let i = baseChecks.length + 1; i <= count; i++) {
      result.push({
        id: `${prefix}-${i.toString().padStart(3, '0')}`,
        checkType: checkTypes[Math.floor(Math.random() * checkTypes.length)],
        checkCategory: checkCategories[Math.floor(Math.random() * checkCategories.length)],
        dataCategory: dataCategories[Math.floor(Math.random() * dataCategories.length)],
        visit: visits[Math.floor(Math.random() * visits.length)],
        description: `${descriptions[Math.floor(Math.random() * descriptions.length)]} ${i}`,
        queryText: `${queryTexts[Math.floor(Math.random() * queryTexts.length)]} ${i}`,
        roles: [roles[Math.floor(Math.random() * roles.length)]],
        frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
        confidence: Math.floor(Math.random() * 30) + 70,
        similarStudy: prefix === 'SIM' ? `STUDY-${Math.floor(Math.random() * 10) + 1}` : undefined
      });
    }
  
    return result;
  };

  const expandedLibraryChecks = generateMoreMockChecks(mockLibraryChecks, 500, 'LIB');
  const expandedSimilarStudyChecks = generateMoreMockChecks(mockSimilarStudyChecks, 500, 'SIM');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStudyInfoChange = (event) => {
    const { name, value } = event.target;
    
    // If study ID is changed, auto-populate other fields
    if (name === 'studyId') {
      const selectedStudy = mockStudies.find(study => study.studyId === value);
      
      if (selectedStudy) {
        setStudyInfo({
          ...studyInfo,
          studyId: selectedStudy.studyId,
          studyName: selectedStudy.studyName,
          studyPhase: selectedStudy.phase,
          therapeutic: selectedStudy.therapeutic,
          indication: selectedStudy.indication,
          population: selectedStudy.population,
          description: selectedStudy.description,
          // Keep the existing values for owner, reviewers, and approvers
          owner: studyInfo.owner,
          reviewers: studyInfo.reviewers,
          approvers: studyInfo.approvers
        });
      } else {
        // If no matching study is found, just update the studyId
        setStudyInfo({
          ...studyInfo,
          [name]: value
        });
      }
    } else {
      // For other fields, just update normally
      setStudyInfo({
        ...studyInfo,
        [name]: value
      });
    }
  };

  const handleMultiSelectChange = (event) => {
    const { name, value } = event.target;
    setStudyInfo({
      ...studyInfo,
      [name]: value
    });
  };

  const handleCheckToggle = (check) => {
    const currentIndex = selectedChecks.findIndex(c => c.id === check.id);
    const newSelectedChecks = [...selectedChecks];

    if (currentIndex === -1) {
      newSelectedChecks.push(check);
    } else {
      newSelectedChecks.splice(currentIndex, 1);
    }

    setSelectedChecks(newSelectedChecks);
  };

  const handleAddCustomCheckRow = () => {
    setCustomCheckRows([
      ...customCheckRows,
      {
        id: '',
        checkType: '',
        checkCategory: '',
        dataCategory: '',
        visit: '',
        description: '',
        queryText: '',
        rolesInvolved: [],
        frequency: ''
      }
    ]);
  };

  const handleRemoveCustomCheckRow = (index) => {
    const updatedRows = [...customCheckRows];
    updatedRows.splice(index, 1);
    setCustomCheckRows(updatedRows);
  };

  const handleCustomCheckRowChange = (index, field, value) => {
    const updatedRows = [...customCheckRows];
    updatedRows[index][field] = value;
    setCustomCheckRows(updatedRows);
  };

  const handleAddAllCustomChecks = () => {
    // Filter out empty rows
    const validRows = customCheckRows.filter(row => row.checkType && row.description && row.queryText);
    
    if (validRows.length === 0) {
      alert('Please fill in at least one row with Check Type, Description, and Query Text');
      return;
    }
    
    const newChecks = validRows.map((row, index) => ({
      id: `CUSTOM-${customChecks.length + index + 1}`,
      ...row,
      source: 'Custom',
      confidence: 75
    }));
    
    setCustomChecks([...customChecks, ...newChecks]);
    setSelectedChecks([...selectedChecks, ...newChecks]);
    
    // Reset form with one empty row
    setCustomCheckRows([
      {
        id: '',
        checkType: '',
        checkCategory: '',
        dataCategory: '',
        visit: '',
        description: '',
        queryText: '',
        rolesInvolved: [],
        frequency: ''
      }
    ]);
    
    setShowCustomCheckForm(false);
  };

  const filteredLibraryChecks = mockLibraryChecks.filter(check => {
    const matchesSearch = searchTerm === '' || 
      check.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.checkCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === '' || check.checkType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const filteredSimilarStudyChecks = mockSimilarStudyChecks.filter(check => {
    const matchesSearch = searchTerm === '' || 
      check.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.checkCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === '' || check.checkType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const expandedFilteredLibraryChecks = expandedLibraryChecks.filter(check => {
    const matchesSearch = expandedSearchTerm === '' || 
      check.id.toLowerCase().includes(expandedSearchTerm.toLowerCase()) ||
      check.description.toLowerCase().includes(expandedSearchTerm.toLowerCase()) ||
      check.checkCategory.toLowerCase().includes(expandedSearchTerm.toLowerCase());
    
    const matchesFilter = expandedFilterType === '' || check.checkType === expandedFilterType;
    
    return matchesSearch && matchesFilter;
  });

  const expandedFilteredSimilarStudyChecks = expandedSimilarStudyChecks.filter(check => {
    const matchesSearch = expandedSearchTerm === '' || 
      check.id.toLowerCase().includes(expandedSearchTerm.toLowerCase()) ||
      check.description.toLowerCase().includes(expandedSearchTerm.toLowerCase()) ||
      check.checkCategory.toLowerCase().includes(expandedSearchTerm.toLowerCase());
    
    const matchesFilter = expandedFilterType === '' || check.checkType === expandedFilterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleLibraryPageChange = (event, newPage) => {
    setLibraryPage(newPage);
  };

  const handleSimilarStudiesPageChange = (event, newPage) => {
    setSimilarStudiesPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setLibraryPage(0);
    setSimilarStudiesPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setLibraryPage(0);
    setSimilarStudiesPage(0);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setLibraryPage(0);
    setSimilarStudiesPage(0);
  };

  const handleSelectAllLibraryChecks = (event) => {
    if (event.target.checked) {
      const newSelected = filteredLibraryChecks
        .slice(libraryPage * rowsPerPage, libraryPage * rowsPerPage + rowsPerPage)
        .map(check => check);
      setSelectedChecks([...selectedChecks, ...newSelected.filter(check => !isCheckSelected(check.id))]);
    } else {
      const checkIdsToRemove = filteredLibraryChecks
        .slice(libraryPage * rowsPerPage, libraryPage * rowsPerPage + rowsPerPage)
        .map(check => check.id);
      setSelectedChecks(selectedChecks.filter(check => !checkIdsToRemove.includes(check.id)));
    }
  };

  const handleSelectAllSimilarStudyChecks = (event) => {
    if (event.target.checked) {
      const newSelected = filteredSimilarStudyChecks
        .slice(similarStudiesPage * rowsPerPage, similarStudiesPage * rowsPerPage + rowsPerPage)
        .map(check => check);
      setSelectedChecks([...selectedChecks, ...newSelected.filter(check => !isCheckSelected(check.id))]);
    } else {
      const checkIdsToRemove = filteredSimilarStudyChecks
        .slice(similarStudiesPage * rowsPerPage, similarStudiesPage * rowsPerPage + rowsPerPage)
        .map(check => check.id);
      setSelectedChecks(selectedChecks.filter(check => !checkIdsToRemove.includes(check.id)));
    }
  };

  const handleSelectAllExpandedLibraryChecks = (event) => {
    if (event.target.checked) {
      const newSelected = expandedFilteredLibraryChecks
        .slice(expandedLibraryPage * rowsPerPage, expandedLibraryPage * rowsPerPage + rowsPerPage)
        .map(check => check);
      setSelectedChecks([...selectedChecks, ...newSelected.filter(check => !isCheckSelected(check.id))]);
    } else {
      const checkIdsToRemove = expandedFilteredLibraryChecks
        .slice(expandedLibraryPage * rowsPerPage, expandedLibraryPage * rowsPerPage + rowsPerPage)
        .map(check => check.id);
      setSelectedChecks(selectedChecks.filter(check => !checkIdsToRemove.includes(check.id)));
    }
  };

  const handleSelectAllExpandedSimilarStudyChecks = (event) => {
    if (event.target.checked) {
      const newSelected = expandedFilteredSimilarStudyChecks
        .slice(expandedSimilarStudiesPage * rowsPerPage, expandedSimilarStudiesPage * rowsPerPage + rowsPerPage)
        .map(check => check);
      setSelectedChecks([...selectedChecks, ...newSelected.filter(check => !isCheckSelected(check.id))]);
    } else {
      const checkIdsToRemove = expandedFilteredSimilarStudyChecks
        .slice(expandedSimilarStudiesPage * rowsPerPage, expandedSimilarStudiesPage * rowsPerPage + rowsPerPage)
        .map(check => check.id);
      setSelectedChecks(selectedChecks.filter(check => !checkIdsToRemove.includes(check.id)));
    }
  };

  const isCheckSelected = (id) => {
    return selectedChecks.some(check => check.id === id);
  };

  const handleCreateIDRP = () => {
    // Create a new IDRP object with the collected data
    const newIDRP = {
      id: `IDRP-${Math.floor(Math.random() * 1000)}`, // Generate a random ID for demo
      studyName: studyInfo.studyName,
      studyId: studyInfo.studyId,
      status: 'Draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      checkCount: selectedChecks.length,
      collaborators: ['DM', ...(studyInfo.reviewers.length > 0 ? ['MM', 'SR'] : [])],
      version: '0.1',
      checks: selectedChecks,
      owner: studyInfo.owner,
      reviewers: studyInfo.reviewers,
      approvers: studyInfo.approvers,
      therapeutic: studyInfo.therapeutic,
      indication: studyInfo.indication,
      phase: studyInfo.studyPhase,
      description: studyInfo.description,
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          user: 'Current User', // In a real app, this would be the logged-in user
          action: 'Created IDRP',
          version: '0.1'
        }
      ],
      comments: []
    };

    // In a real application, this would be an API call to save the IDRP
    console.log('Creating new IDRP:', newIDRP);
    
    // For demo purposes, we'll store it in localStorage
    try {
      const existingIDRPs = JSON.parse(localStorage.getItem('idrps') || '[]');
      existingIDRPs.push(newIDRP);
      localStorage.setItem('idrps', JSON.stringify(existingIDRPs));
      
      // Dispatch a custom event to notify other components of the new IDRP
      window.dispatchEvent(new CustomEvent('idrp-updated', { detail: newIDRP }));
      
      // Show success message and redirect to dashboard
      alert('IDRP created successfully and moved to Draft status!');
      navigate('/');  // Redirect to the landing page (Dashboard)
    } catch (error) {
      console.error('Error saving IDRP to localStorage:', error);
      alert('Error creating IDRP. Please try again.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Study Details</Typography>
                  </Box>
                }
                sx={{ 
                  backgroundColor: 'primary.light', 
                  color: 'primary.contrastText',
                  pb: 1
                }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required variant="outlined" sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.2)'
                        }
                      }
                    }}>
                      <InputLabel>Study ID</InputLabel>
                      <Select
                        name="studyId"
                        value={studyInfo.studyId}
                        label="Study ID"
                        onChange={handleStudyInfoChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <BiotechIcon color="primary" sx={{ ml: 1 }} />
                          </InputAdornment>
                        }
                      >
                        {mockStudies.map((study) => (
                          <MenuItem key={study.studyId} value={study.studyId}>
                            {study.studyId}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Study Name"
                      name="studyName"
                      value={studyInfo.studyName}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon color="primary" />
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Study Description"
                      name="description"
                      multiline
                      rows={3}
                      value={studyInfo.description}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <InfoIcon color="primary" />
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScienceIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Study Classification</Typography>
                  </Box>
                }
                sx={{ 
                  backgroundColor: 'primary.light', 
                  color: 'primary.contrastText',
                  pb: 1
                }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Study Phase"
                      name="studyPhase"
                      value={studyInfo.studyPhase}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalHospitalIcon color="primary" />
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Therapeutic Area"
                      name="therapeutic"
                      value={studyInfo.therapeutic}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalHospitalIcon color="primary" />
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Indication"
                      name="indication"
                      value={studyInfo.indication}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalHospitalIcon color="primary" />
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Population"
                      name="population"
                      value={studyInfo.population}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <PeopleIcon color="primary" />
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Role Assignments</Typography>
                  </Box>
                }
                sx={{ 
                  backgroundColor: 'primary.light', 
                  color: 'primary.contrastText',
                  pb: 1
                }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required variant="outlined" sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.2)'
                        }
                      }
                    }}>
                      <InputLabel>Owner (Data Manager)</InputLabel>
                      <Select
                        name="owner"
                        value={studyInfo.owner}
                        label="Owner (Data Manager)"
                        onChange={handleStudyInfoChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <Avatar 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                bgcolor: 'primary.main',
                                fontSize: '0.75rem',
                                ml: 1
                              }}
                            >
                              DM
                            </Avatar>
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="John Doe">John Doe</MenuItem>
                        <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                        <MenuItem value="Robert Johnson">Robert Johnson</MenuItem>
                        <MenuItem value="Emily Davis">Emily Davis</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.2)'
                        }
                      }
                    }}>
                      <InputLabel>Reviewers</InputLabel>
                      <Select
                        multiple
                        name="reviewers"
                        value={studyInfo.reviewers}
                        label="Reviewers"
                        onChange={handleMultiSelectChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <RateReviewIcon color="primary" sx={{ ml: 1 }} />
                          </InputAdornment>
                        }
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value} 
                                size="small" 
                                sx={{ 
                                  borderRadius: '16px',
                                  backgroundColor: 'primary.light',
                                  color: 'primary.dark',
                                  fontWeight: 500
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="Dr. Michael Chen (MM)">Dr. Michael Chen (MM)</MenuItem>
                        <MenuItem value="Dr. Sarah Williams (MM)">Dr. Sarah Williams (MM)</MenuItem>
                        <MenuItem value="Alex Thompson (SR)">Alex Thompson (SR)</MenuItem>
                        <MenuItem value="Lisa Rodriguez (SR)">Lisa Rodriguez (SR)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.2)'
                        }
                      }
                    }}>
                      <InputLabel>Approvers</InputLabel>
                      <Select
                        multiple
                        name="approvers"
                        value={studyInfo.approvers}
                        label="Approvers"
                        onChange={handleMultiSelectChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <VerifiedIcon color="primary" sx={{ ml: 1 }} />
                          </InputAdornment>
                        }
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value} 
                                size="small" 
                                sx={{ 
                                  borderRadius: '16px',
                                  backgroundColor: 'primary.light',
                                  color: 'primary.dark',
                                  fontWeight: 500
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="Dr. James Wilson (SM)">Dr. James Wilson (SM)</MenuItem>
                        <MenuItem value="Dr. Patricia Brown (SM)">Dr. Patricia Brown (SM)</MenuItem>
                        <MenuItem value="Thomas Garcia (DM)">Thomas Garcia (DM)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AutoAwesomeIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
              AI Recommendations
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Based on your study information, our AI has recommended the following data quality checks.
              Select the checks you want to include in your IDRP.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader 
                    title="Standard Library Recommendations" 
                    subheader={`${filteredLibraryChecks.length} recommendations based on study attributes`}
                    action={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ width: 150 }}
                        />
                        <FormControl size="small" sx={{ width: 150 }}>
                          <Select
                            displayEmpty
                            value={filterType}
                            onChange={handleFilterTypeChange}
                          >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value="DQ">DQ</MenuItem>
                            <MenuItem value="IRL">IRL</MenuItem>
                            <MenuItem value="Dashboard">Dashboard</MenuItem>
                          </Select>
                        </FormControl>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={handleOpenLibraryDialog}
                          startIcon={<OpenInFullIcon />}
                          sx={{ ml: 1 }}
                        >
                          Maximize
                        </Button>
                      </Box>
                    }
                  />
                  <Divider />
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={
                                filteredLibraryChecks
                                  .slice(
                                    libraryPage * rowsPerPage,
                                    libraryPage * rowsPerPage + rowsPerPage
                                  )
                                  .some(check => isCheckSelected(check.id)) &&
                                !filteredLibraryChecks
                                  .slice(
                                    libraryPage * rowsPerPage,
                                    libraryPage * rowsPerPage + rowsPerPage
                                  )
                                  .every(check => isCheckSelected(check.id))
                              }
                              checked={
                                filteredLibraryChecks
                                  .slice(
                                    libraryPage * rowsPerPage,
                                    libraryPage * rowsPerPage + rowsPerPage
                                  )
                                  .length > 0 &&
                                filteredLibraryChecks
                                  .slice(
                                    libraryPage * rowsPerPage,
                                    libraryPage * rowsPerPage + rowsPerPage
                                  )
                                  .every(check => isCheckSelected(check.id))
                              }
                              onChange={handleSelectAllLibraryChecks}
                            />
                          </TableCell>
                          <TableCell>ID</TableCell>
                          <TableCell>Check Type</TableCell>
                          <TableCell>Check Category</TableCell>
                          <TableCell>Data Category</TableCell>
                          <TableCell>Visit</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Query Text</TableCell>
                          <TableCell>Roles</TableCell>
                          <TableCell>Frequency</TableCell>
                          <TableCell align="right">Confidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredLibraryChecks
                          .slice(
                            libraryPage * rowsPerPage,
                            libraryPage * rowsPerPage + rowsPerPage
                          )
                          .map((check) => (
                            <TableRow key={check.id} hover>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isCheckSelected(check.id)}
                                  onChange={() => handleCheckToggle(check)}
                                />
                              </TableCell>
                              <TableCell>{check.id}</TableCell>
                              <TableCell>{check.checkType}</TableCell>
                              <TableCell>{check.checkCategory}</TableCell>
                              <TableCell>{check.dataCategory}</TableCell>
                              <TableCell>{check.visit}</TableCell>
                              <TableCell>{check.description}</TableCell>
                              <TableCell>{check.queryText}</TableCell>
                              <TableCell>{check.roles ? check.roles.join(', ') : ''}</TableCell>
                              <TableCell>{check.frequency}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={`${check.confidence}% match`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={filteredLibraryChecks.length}
                    page={libraryPage}
                    onPageChange={handleLibraryPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                  />
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Similar Studies Recommendations" 
                    subheader={`${filteredSimilarStudyChecks.length} recommendations based on historical data`}
                    action={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ width: 150 }}
                        />
                        <FormControl size="small" sx={{ width: 150 }}>
                          <Select
                            displayEmpty
                            value={filterType}
                            onChange={handleFilterTypeChange}
                          >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value="DQ">DQ</MenuItem>
                            <MenuItem value="IRL">IRL</MenuItem>
                            <MenuItem value="Dashboard">Dashboard</MenuItem>
                          </Select>
                        </FormControl>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={handleOpenSimilarStudiesDialog}
                          startIcon={<OpenInFullIcon />}
                          sx={{ ml: 1 }}
                        >
                          Maximize
                        </Button>
                      </Box>
                    }
                  />
                  <Divider />
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={
                                filteredSimilarStudyChecks
                                  .slice(
                                    similarStudiesPage * rowsPerPage,
                                    similarStudiesPage * rowsPerPage + rowsPerPage
                                  )
                                  .some(check => isCheckSelected(check.id)) &&
                                !filteredSimilarStudyChecks
                                  .slice(
                                    similarStudiesPage * rowsPerPage,
                                    similarStudiesPage * rowsPerPage + rowsPerPage
                                  )
                                  .every(check => isCheckSelected(check.id))
                              }
                              checked={
                                filteredSimilarStudyChecks
                                  .slice(
                                    similarStudiesPage * rowsPerPage,
                                    similarStudiesPage * rowsPerPage + rowsPerPage
                                  )
                                  .length > 0 &&
                                filteredSimilarStudyChecks
                                  .slice(
                                    similarStudiesPage * rowsPerPage,
                                    similarStudiesPage * rowsPerPage + rowsPerPage
                                  )
                                  .every(check => isCheckSelected(check.id))
                              }
                              onChange={handleSelectAllSimilarStudyChecks}
                            />
                          </TableCell>
                          <TableCell>ID</TableCell>
                          <TableCell>Check Type</TableCell>
                          <TableCell>Check Category</TableCell>
                          <TableCell>Data Category</TableCell>
                          <TableCell>Visit</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Query Text</TableCell>
                          <TableCell>Roles</TableCell>
                          <TableCell>Frequency</TableCell>
                          <TableCell>Study</TableCell>
                          <TableCell align="right">Confidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredSimilarStudyChecks
                          .slice(
                            similarStudiesPage * rowsPerPage,
                            similarStudiesPage * rowsPerPage + rowsPerPage
                          )
                          .map((check) => (
                            <TableRow key={check.id} hover>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isCheckSelected(check.id)}
                                  onChange={() => handleCheckToggle(check)}
                                />
                              </TableCell>
                              <TableCell>{check.id}</TableCell>
                              <TableCell>{check.checkType}</TableCell>
                              <TableCell>{check.checkCategory}</TableCell>
                              <TableCell>{check.dataCategory}</TableCell>
                              <TableCell>{check.visit}</TableCell>
                              <TableCell>{check.description}</TableCell>
                              <TableCell>{check.queryText}</TableCell>
                              <TableCell>{check.roles ? check.roles.join(', ') : ''}</TableCell>
                              <TableCell>{check.frequency}</TableCell>
                              <TableCell>{check.similarStudy}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={`${check.confidence}% match`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={filteredSimilarStudyChecks.length}
                    page={similarStudiesPage}
                    onPageChange={handleSimilarStudiesPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                  />
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mt: 3 }}>
                  <CardHeader 
                    title="Custom Checks" 
                    subheader="Add study-specific custom checks"
                    action={
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => setShowCustomCheckForm(!showCustomCheckForm)}
                      >
                        {showCustomCheckForm ? 'Cancel' : 'Add Custom Checks'}
                      </Button>
                    }
                  />
                  <Divider />
                  {showCustomCheckForm && (
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Enter Multiple Custom Checks
                      </Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead sx={{ backgroundColor: 'primary.light' }}>
                            <TableRow>
                              <TableCell>Check Type</TableCell>
                              <TableCell>Check Category</TableCell>
                              <TableCell>Data Category</TableCell>
                              <TableCell>Visit</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Query Text</TableCell>
                              <TableCell>Roles Involved</TableCell>
                              <TableCell>Frequency</TableCell>
                              <TableCell width="50px">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {customCheckRows.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={row.checkType}
                                      onChange={(e) => handleCustomCheckRowChange(index, 'checkType', e.target.value)}
                                      displayEmpty
                                    >
                                      <MenuItem value="" disabled>Select</MenuItem>
                                      <MenuItem value="DQ">DQ</MenuItem>
                                      <MenuItem value="IRL">IRL</MenuItem>
                                      <MenuItem value="Dashboard">Dashboard</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={row.checkCategory}
                                      onChange={(e) => handleCustomCheckRowChange(index, 'checkCategory', e.target.value)}
                                      displayEmpty
                                    >
                                      <MenuItem value="" disabled>Select</MenuItem>
                                      <MenuItem value="Demographics">Demographics</MenuItem>
                                      <MenuItem value="Vitals">Vitals</MenuItem>
                                      <MenuItem value="Labs">Labs</MenuItem>
                                      <MenuItem value="Adverse Events">Adverse Events</MenuItem>
                                      <MenuItem value="Concomitant Medications">Concomitant Medications</MenuItem>
                                      <MenuItem value="Protocol Deviations">Protocol Deviations</MenuItem>
                                      <MenuItem value="Efficacy">Efficacy</MenuItem>
                                      <MenuItem value="Safety">Safety</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={row.dataCategory}
                                      onChange={(e) => handleCustomCheckRowChange(index, 'dataCategory', e.target.value)}
                                      displayEmpty
                                    >
                                      <MenuItem value="" disabled>Select</MenuItem>
                                      <MenuItem value="Subject">Subject</MenuItem>
                                      <MenuItem value="Safety">Safety</MenuItem>
                                      <MenuItem value="Compliance">Compliance</MenuItem>
                                      <MenuItem value="Efficacy">Efficacy</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={row.visit}
                                      onChange={(e) => handleCustomCheckRowChange(index, 'visit', e.target.value)}
                                      displayEmpty
                                    >
                                      <MenuItem value="" disabled>Select</MenuItem>
                                      <MenuItem value="All">All</MenuItem>
                                      <MenuItem value="Screening">Screening</MenuItem>
                                      <MenuItem value="Baseline">Baseline</MenuItem>
                                      <MenuItem value="Week 1">Week 1</MenuItem>
                                      <MenuItem value="Week 2">Week 2</MenuItem>
                                      <MenuItem value="Week 4">Week 4</MenuItem>
                                      <MenuItem value="Week 8">Week 8</MenuItem>
                                      <MenuItem value="Week 12">Week 12</MenuItem>
                                      <MenuItem value="End of Treatment">End of Treatment</MenuItem>
                                      <MenuItem value="Follow-up">Follow-up</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Description"
                                    value={row.description}
                                    onChange={(e) => handleCustomCheckRowChange(index, 'description', e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Query text"
                                    value={row.queryText}
                                    onChange={(e) => handleCustomCheckRowChange(index, 'queryText', e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth size="small">
                                    <Select
                                      multiple
                                      value={row.rolesInvolved}
                                      onChange={(e) => handleCustomCheckRowChange(index, 'rolesInvolved', e.target.value)}
                                      renderValue={(selected) => selected.join(', ')}
                                      displayEmpty
                                    >
                                      <MenuItem value="DM">DM</MenuItem>
                                      <MenuItem value="MM">MM</MenuItem>
                                      <MenuItem value="SR">SR</MenuItem>
                                      <MenuItem value="SM">SM</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={row.frequency}
                                      onChange={(e) => handleCustomCheckRowChange(index, 'frequency', e.target.value)}
                                      displayEmpty
                                    >
                                      <MenuItem value="" disabled>Select</MenuItem>
                                      <MenuItem value="Daily">Daily</MenuItem>
                                      <MenuItem value="Weekly">Weekly</MenuItem>
                                      <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
                                      <MenuItem value="Monthly">Monthly</MenuItem>
                                      <MenuItem value="Quarterly">Quarterly</MenuItem>
                                      <MenuItem value="Ad-hoc">Ad-hoc</MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleRemoveCustomCheckRow(index)}
                                    disabled={customCheckRows.length === 1}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button 
                          startIcon={<AddIcon />}
                          onClick={handleAddCustomCheckRow}
                        >
                          Add Row
                        </Button>
                        <Button 
                          variant="contained" 
                          onClick={handleAddAllCustomChecks}
                          disabled={!customCheckRows.some(row => row.checkType && row.description && row.queryText)}
                        >
                          Add All Checks
                        </Button>
                      </Box>
                    </CardContent>
                  )}
                  <CardContent sx={{ p: 0 }}>
                    {customChecks.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox disabled />
                              </TableCell>
                              <TableCell>Check ID</TableCell>
                              <TableCell>Check Type</TableCell>
                              <TableCell>Check Category</TableCell>
                              <TableCell>Data Category</TableCell>
                              <TableCell>Visit</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Query Text</TableCell>
                              <TableCell>Roles</TableCell>
                              <TableCell>Frequency</TableCell>
                              <TableCell>Source</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedChecks.map((check) => (
                              <TableRow key={check.id} hover>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={true}
                                    onChange={() => handleCheckToggle(check)}
                                  />
                                </TableCell>
                                <TableCell>{check.id}</TableCell>
                                <TableCell>{check.checkType}</TableCell>
                                <TableCell>{check.checkCategory}</TableCell>
                                <TableCell>{check.dataCategory}</TableCell>
                                <TableCell>{check.visit}</TableCell>
                                <TableCell>{check.description}</TableCell>
                                <TableCell>{check.queryText}</TableCell>
                                <TableCell>{check.roles ? check.roles.join(', ') : ''}</TableCell>
                                <TableCell>{check.frequency}</TableCell>
                                <TableCell>{check.source}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="textSecondary">
                          No custom checks added yet. Click "Add Custom Checks" to create study-specific checks.
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Review Selected Checks
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              You have selected {selectedChecks.length} checks for your IDRP. Review the details below before finalizing.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="Study Information" />
                  <Divider />
                  <CardContent>
                    <Typography variant="subtitle1">
                      {studyInfo.studyName} ({studyInfo.studyId})
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {studyInfo.studyPhase} | {studyInfo.therapeutic} | {studyInfo.indication} | {studyInfo.population}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Owner:</strong> {studyInfo.owner}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Reviewers:</strong> {studyInfo.reviewers.join(', ')}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Approvers:</strong> {studyInfo.approvers.join(', ')}
                    </Typography>
                    <Typography variant="body2">
                      {studyInfo.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Selected Checks" 
                    subheader={`${selectedChecks.length} checks selected`}
                  />
                  <Divider />
                  <CardContent sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
                    <List dense>
                      {selectedChecks.map((check) => (
                        <ListItem key={check.id}>
                          <ListItemIcon>
                            <CheckCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={check.description}
                            secondary={`${check.checkType} | ${check.id}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.info.light + '20', display: 'flex', alignItems: 'flex-start' }}>
                  <InfoIcon sx={{ color: theme.palette.info.main, mr: 1, mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle2" color="textPrimary">
                      What happens next?
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      After creating this IDRP, it will be in "Draft" status. You can share it with collaborators for review.
                      Once all stakeholders have approved, you can finalize the IDRP to version 1.0.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleOpenLibraryDialog = () => {
    setExpandedSearchTerm(searchTerm);
    setExpandedFilterType(filterType);
    setExpandedLibraryPage(0);
    setLibraryDialogOpen(true);
  };
  
  const handleCloseLibraryDialog = () => {
    setLibraryDialogOpen(false);
  };
  
  const handleOpenSimilarStudiesDialog = () => {
    setExpandedSearchTerm(searchTerm);
    setExpandedFilterType(filterType);
    setExpandedSimilarStudiesPage(0);
    setSimilarStudiesDialogOpen(true);
  };
  
  const handleCloseSimilarStudiesDialog = () => {
    setSimilarStudiesDialogOpen(false);
  };
  
  const handleExpandedSearchChange = (event) => {
    setExpandedSearchTerm(event.target.value);
    setExpandedLibraryPage(0);
    setExpandedSimilarStudiesPage(0);
  };
  
  const handleExpandedFilterTypeChange = (event) => {
    setExpandedFilterType(event.target.value);
    setExpandedLibraryPage(0);
    setExpandedSimilarStudiesPage(0);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New IDRP
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} connector={<ColorlibConnector />}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<NavigateBeforeIcon />}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                endIcon={<CheckCircleIcon />}
                onClick={handleCreateIDRP}
              >
                Create IDRP
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<NavigateNextIcon />}
                disabled={activeStep === 0 && !studyInfo.studyName}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Dialog
        open={libraryDialogOpen}
        onClose={handleCloseLibraryDialog}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle>
          Standard Library Recommendations
          <IconButton
            aria-label="close"
            onClick={handleCloseLibraryDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ flex: 1, overflow: 'hidden' }}>
          <Grid container spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Grid item xs={12} sx={{ flexShrink: 0 }}>
              <TextField
                size="small"
                placeholder="Search..."
                value={expandedSearchTerm}
                onChange={handleExpandedSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 150 }}
              />
              <FormControl size="small" sx={{ width: 150 }}>
                <Select
                  displayEmpty
                  value={expandedFilterType}
                  onChange={handleExpandedFilterTypeChange}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="DQ">DQ</MenuItem>
                  <MenuItem value="IRL">IRL</MenuItem>
                  <MenuItem value="Dashboard">Dashboard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ flex: 1, overflow: 'hidden' }}>
              <TableContainer sx={{ height: 'calc(100% - 52px)', overflow: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            expandedFilteredLibraryChecks
                              .slice(
                                expandedLibraryPage * rowsPerPage,
                                expandedLibraryPage * rowsPerPage + rowsPerPage
                              )
                              .some(check => isCheckSelected(check.id)) &&
                            !expandedFilteredLibraryChecks
                              .slice(
                                expandedLibraryPage * rowsPerPage,
                                expandedLibraryPage * rowsPerPage + rowsPerPage
                              )
                              .every(check => isCheckSelected(check.id))
                          }
                          checked={
                            expandedFilteredLibraryChecks
                              .slice(
                                expandedLibraryPage * rowsPerPage,
                                expandedLibraryPage * rowsPerPage + rowsPerPage
                              )
                              .length > 0 &&
                            expandedFilteredLibraryChecks
                              .slice(
                                expandedLibraryPage * rowsPerPage,
                                expandedLibraryPage * rowsPerPage + rowsPerPage
                              )
                              .every(check => isCheckSelected(check.id))
                          }
                          onChange={handleSelectAllExpandedLibraryChecks}
                        />
                      </TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Check Type</TableCell>
                      <TableCell>Check Category</TableCell>
                      <TableCell>Data Category</TableCell>
                      <TableCell>Visit</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Query Text</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell align="right">Confidence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expandedFilteredLibraryChecks
                      .slice(
                        expandedLibraryPage * rowsPerPage,
                        expandedLibraryPage * rowsPerPage + rowsPerPage
                      )
                      .map((check) => (
                        <TableRow key={check.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isCheckSelected(check.id)}
                              onChange={() => handleCheckToggle(check)}
                            />
                          </TableCell>
                          <TableCell>{check.id}</TableCell>
                          <TableCell>{check.checkType}</TableCell>
                          <TableCell>{check.checkCategory}</TableCell>
                          <TableCell>{check.dataCategory}</TableCell>
                          <TableCell>{check.visit}</TableCell>
                          <TableCell>{check.description}</TableCell>
                          <TableCell>{check.queryText}</TableCell>
                          <TableCell>{check.roles ? check.roles.join(', ') : ''}</TableCell>
                          <TableCell>{check.frequency}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={`${check.confidence}% match`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={expandedFilteredLibraryChecks.length}
                page={expandedLibraryPage}
                onPageChange={(event, newPage) => setExpandedLibraryPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setExpandedLibraryPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLibraryDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={similarStudiesDialogOpen}
        onClose={handleCloseSimilarStudiesDialog}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle>
          Similar Studies Recommendations
          <IconButton
            aria-label="close"
            onClick={handleCloseSimilarStudiesDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ flex: 1, overflow: 'hidden' }}>
          <Grid container spacing={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Grid item xs={12} sx={{ flexShrink: 0 }}>
              <TextField
                size="small"
                placeholder="Search..."
                value={expandedSearchTerm}
                onChange={handleExpandedSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 150 }}
              />
              <FormControl size="small" sx={{ width: 150 }}>
                <Select
                  displayEmpty
                  value={expandedFilterType}
                  onChange={handleExpandedFilterTypeChange}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="DQ">DQ</MenuItem>
                  <MenuItem value="IRL">IRL</MenuItem>
                  <MenuItem value="Dashboard">Dashboard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ flex: 1, overflow: 'hidden' }}>
              <TableContainer sx={{ height: 'calc(100% - 52px)', overflow: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            expandedFilteredSimilarStudyChecks
                              .slice(
                                expandedSimilarStudiesPage * rowsPerPage,
                                expandedSimilarStudiesPage * rowsPerPage + rowsPerPage
                              )
                              .some(check => isCheckSelected(check.id)) &&
                            !expandedFilteredSimilarStudyChecks
                              .slice(
                                expandedSimilarStudiesPage * rowsPerPage,
                                expandedSimilarStudiesPage * rowsPerPage + rowsPerPage
                              )
                              .every(check => isCheckSelected(check.id))
                          }
                          checked={
                            expandedFilteredSimilarStudyChecks
                              .slice(
                                expandedSimilarStudiesPage * rowsPerPage,
                                expandedSimilarStudiesPage * rowsPerPage + rowsPerPage
                              )
                              .length > 0 &&
                            expandedFilteredSimilarStudyChecks
                              .slice(
                                expandedSimilarStudiesPage * rowsPerPage,
                                expandedSimilarStudiesPage * rowsPerPage + rowsPerPage
                              )
                              .every(check => isCheckSelected(check.id))
                          }
                          onChange={handleSelectAllExpandedSimilarStudyChecks}
                        />
                      </TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Check Type</TableCell>
                      <TableCell>Check Category</TableCell>
                      <TableCell>Data Category</TableCell>
                      <TableCell>Visit</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Query Text</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Study</TableCell>
                      <TableCell align="right">Confidence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expandedFilteredSimilarStudyChecks
                      .slice(
                        expandedSimilarStudiesPage * rowsPerPage,
                        expandedSimilarStudiesPage * rowsPerPage + rowsPerPage
                      )
                      .map((check) => (
                        <TableRow key={check.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isCheckSelected(check.id)}
                              onChange={() => handleCheckToggle(check)}
                            />
                          </TableCell>
                          <TableCell>{check.id}</TableCell>
                          <TableCell>{check.checkType}</TableCell>
                          <TableCell>{check.checkCategory}</TableCell>
                          <TableCell>{check.dataCategory}</TableCell>
                          <TableCell>{check.visit}</TableCell>
                          <TableCell>{check.description}</TableCell>
                          <TableCell>{check.queryText}</TableCell>
                          <TableCell>{check.roles ? check.roles.join(', ') : ''}</TableCell>
                          <TableCell>{check.frequency}</TableCell>
                          <TableCell>{check.similarStudy}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={`${check.confidence}% match`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={expandedFilteredSimilarStudyChecks.length}
                page={expandedSimilarStudiesPage}
                onPageChange={(event, newPage) => setExpandedSimilarStudiesPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setExpandedSimilarStudiesPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSimilarStudiesDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default IDRPCreation;
