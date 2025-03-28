import React, { useState, useEffect, useRef } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh'; // Make sure the import is correct
import { readExcelFile, mapExcelDataToChecks } from '../utils/excelUtils';

// Empty arrays for checks
const mockLibraryChecks = [];
const mockSimilarStudyChecks = [];

// Pre-populated mock studies
const mockStudies = [
  {
    studyId: 'ONCO-2025-001',
    studyName: 'Phase 2 Study of XDR-592 in Advanced Solid Tumors',
    phase: 'Phase 2',
    therapeutic: 'Oncology',
    indication: 'Advanced Solid Tumors',
    population: 'Adult patients with advanced solid tumors',
    description: 'A Phase 2, open-label, multi-center study to evaluate the efficacy and safety of XDR-592 in patients with advanced solid tumors who have progressed on standard therapy.'
  },
  {
    studyId: 'CARD-2025-002',
    studyName: 'Phase 3 Study of CardioPlus in Heart Failure',
    phase: 'Phase 3',
    therapeutic: 'Cardiology',
    indication: 'Heart Failure',
    population: 'Adult patients with chronic heart failure',
    description: 'A Phase 3, randomized, double-blind, placebo-controlled study to evaluate the efficacy and safety of CardioPlus in reducing cardiovascular mortality and heart failure hospitalizations.'
  },
  {
    studyId: 'NEUR-2025-003',
    studyName: 'Phase 2 Study of NeuroClear in Alzheimer\'s Disease',
    phase: 'Phase 2',
    therapeutic: 'Neurology',
    indication: 'Alzheimer\'s Disease',
    population: 'Elderly patients with mild to moderate Alzheimer\'s Disease',
    description: 'A Phase 2, randomized, double-blind, placebo-controlled study to evaluate the efficacy and safety of NeuroClear in slowing cognitive decline in patients with Alzheimer\'s Disease.'
  }
];

const steps = ['Study Information', 'iDRP Assist', 'Review & Finalize'];

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
  
  // List of team members for role assignments
  const teamMembers = [
    'John Smith',
    'Sarah Johnson',
    'Michael Chen',
    'Emily Davis',
    'David Wilson',
    'Jennifer Lee',
    'Robert Brown',
    'Lisa Taylor',
    'James Anderson',
    'Maria Rodriguez'
  ];
  
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
  const [expandedFilterCategory, setExpandedFilterCategory] = useState('');
  const [expandedFilterDataCategory, setExpandedFilterDataCategory] = useState('');
  const [expandedLibraryPage, setExpandedLibraryPage] = useState(0);
  const [expandedSimilarStudiesPage, setExpandedSimilarStudiesPage] = useState(0);
  const [librarySearchTerm, setLibrarySearchTerm] = useState('');
  const [libraryFilterType, setLibraryFilterType] = useState('');
  const [libraryFilterCategory, setLibraryFilterCategory] = useState('');
  const [libraryFilterDataCategory, setLibraryFilterDataCategory] = useState('');
  
  // Excel import related states
  const [importedChecks, setImportedChecks] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  
  // Load global library checks from localStorage
  const [globalLibraryChecks, setGlobalLibraryChecks] = useState(() => {
    try {
      const savedChecks = localStorage.getItem('globalLibraryChecks');
      return savedChecks ? JSON.parse(savedChecks) : [];
    } catch (error) {
      console.error('Error loading global library checks:', error);
      return [];
    }
  });
  
  // Function to handle Excel file import
  const handleExcelImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      const jsonData = await readExcelFile(file);
      const formattedChecks = mapExcelDataToChecks(jsonData);
      
      // Add source and confidence properties to each check
      const checksWithMetadata = formattedChecks.map(check => ({
        ...check,
        source: 'Excel Import',
        confidence: 85 // Default confidence for imported checks
      }));
      
      setImportedChecks(checksWithMetadata);
      
      // Add imported checks to selected checks
      setSelectedChecks(prevChecks => {
        // Filter out duplicates based on ID
        const existingIds = prevChecks.map(check => check.id);
        const newChecks = checksWithMetadata.filter(check => !existingIds.includes(check.id));
        return [...prevChecks, ...newChecks];
      });
      
      alert(`Successfully imported ${formattedChecks.length} checks from Excel file.`);
    } catch (error) {
      console.error('Error importing Excel file:', error);
      alert(`Error importing Excel file: ${error.message}`);
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Function to trigger file input click
  const handleImportButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
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

  // Combine global library checks with mock library checks
  const combinedLibraryChecks = [...globalLibraryChecks];
  const expandedLibraryChecks = generateMoreMockChecks(combinedLibraryChecks, 0, 'LIB');
  const expandedSimilarStudyChecks = generateMoreMockChecks(mockSimilarStudyChecks, 0, 'SIM');

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

  // Filter library checks based on search term and filter type
  const filteredLibraryChecks = combinedLibraryChecks.filter(check => {
    const matchesSearch = searchTerm === '' || 
      check.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.queryText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === '' || check.checkType === filterType;
    
    return matchesSearch && matchesFilter;
  });
  
  const filteredSimilarStudyChecks = mockSimilarStudyChecks.filter(check => {
    const matchesSearch = searchTerm === '' || 
      check.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.queryText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === '' || check.checkType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const expandedFilteredLibraryChecks = expandedLibraryChecks.filter(check => {
    const matchesSearch = librarySearchTerm === '' || 
      check.description.toLowerCase().includes(librarySearchTerm.toLowerCase()) ||
      check.queryText.toLowerCase().includes(librarySearchTerm.toLowerCase()) ||
      check.id.toLowerCase().includes(librarySearchTerm.toLowerCase());
    
    const matchesFilterType = libraryFilterType === '' || check.checkType === libraryFilterType;
    const matchesFilterCategory = libraryFilterCategory === '' || check.checkCategory === libraryFilterCategory;
    const matchesFilterDataCategory = libraryFilterDataCategory === '' || check.dataCategory === libraryFilterDataCategory;
    
    return matchesSearch && matchesFilterType && matchesFilterCategory && matchesFilterDataCategory;
  });

  const expandedFilteredSimilarStudyChecks = expandedSimilarStudyChecks.filter(check => {
    const matchesSearch = expandedSearchTerm === '' || 
      check.description.toLowerCase().includes(expandedSearchTerm.toLowerCase()) ||
      check.queryText.toLowerCase().includes(expandedSearchTerm.toLowerCase()) ||
      check.id.toLowerCase().includes(expandedSearchTerm.toLowerCase());
    
    const matchesFilterType = expandedFilterType === '' || check.checkType === expandedFilterType;
    const matchesFilterCategory = expandedFilterCategory === '' || check.checkCategory === expandedFilterCategory;
    const matchesFilterDataCategory = expandedFilterDataCategory === '' || check.dataCategory === expandedFilterDataCategory;
    
    return matchesSearch && matchesFilterType && matchesFilterCategory && matchesFilterDataCategory;
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
          <Box sx={{ p: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Study Information</AlertTitle>
              Select a study from the dropdown and assign roles for this IDRP. All study details will be automatically populated.
            </Alert>
            
            <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Study Selection</Typography>
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
                  <Grid item xs={12}>
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
                        label="Study ID"
                        name="studyId"
                        value={studyInfo.studyId}
                        onChange={handleStudyInfoChange}
                      >
                        <MenuItem value="" disabled>Select a Study</MenuItem>
                        {mockStudies.map((study) => (
                          <MenuItem key={study.studyId} value={study.studyId}>
                            {study.studyId} - {study.studyName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {studyInfo.studyId && (
              <>
                <Card elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
                  <CardHeader 
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
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
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Study Name:</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>{studyInfo.studyName}</Typography>
                        
                        <Typography variant="subtitle2" color="text.secondary">Phase:</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>{studyInfo.studyPhase}</Typography>
                        
                        <Typography variant="subtitle2" color="text.secondary">Therapeutic Area:</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>{studyInfo.therapeutic}</Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Indication:</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>{studyInfo.indication}</Typography>
                        
                        <Typography variant="subtitle2" color="text.secondary">Population:</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>{studyInfo.population}</Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Description:</Typography>
                        <Typography variant="body1">{studyInfo.description}</Typography>
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
                            label="Owner (Data Manager)"
                            name="owner"
                            value={studyInfo.owner}
                            onChange={handleStudyInfoChange}
                          >
                            <MenuItem value="" disabled>Select Owner</MenuItem>
                            {teamMembers.map((member) => (
                              <MenuItem key={member} value={member}>{member}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
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
                          <InputLabel>Reviewers</InputLabel>
                          <Select
                            multiple
                            label="Reviewers"
                            name="reviewers"
                            value={studyInfo.reviewers}
                            onChange={handleMultiSelectChange}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            {teamMembers.map((member) => (
                              <MenuItem key={member} value={member}>
                                <Checkbox checked={studyInfo.reviewers.indexOf(member) > -1} />
                                <ListItemText primary={member} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
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
                          <InputLabel>Approvers</InputLabel>
                          <Select
                            multiple
                            label="Approvers"
                            name="approvers"
                            value={studyInfo.approvers}
                            onChange={handleMultiSelectChange}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            {teamMembers.map((member) => (
                              <MenuItem key={member} value={member}>
                                <Checkbox checked={studyInfo.approvers.indexOf(member) > -1} />
                                <ListItemText primary={member} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </>
            )}
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AutoAwesomeIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
              iDRP Assist
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
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={handleImportButtonClick}
                          startIcon={<UploadFileIcon />}
                          sx={{ ml: 1 }}
                        >
                          Import from Excel
                        </Button>
                        <input
                          type="file"
                          accept=".xlsx, .xls, .csv"
                          ref={fileInputRef}
                          onChange={handleExcelImport}
                          style={{ display: 'none' }}
                        />
                      </Box>
                    }
                  />
                  <Divider />
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper', zIndex: 1300 }}>
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
                          <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>ID</TableCell>
                          <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Type</TableCell>
                          <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Category</TableCell>
                          <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Data Category</TableCell>
                          <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Visit</TableCell>
                          <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Description</TableCell>
                          <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Query Text</TableCell>
                          <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Roles</TableCell>
                          <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Frequency</TableCell>
                          <TableCell align="right" sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Confidence</TableCell>
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
                              <TableCell>
                                <Tooltip title={check.description} placement="top">
                                  <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.description}</Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip title={check.queryText} placement="top">
                                  <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.queryText}</Typography>
                                </Tooltip>
                              </TableCell>
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
                          <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper', zIndex: 1300 }}>
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
                          <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>ID</TableCell>
                          <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Type</TableCell>
                          <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Category</TableCell>
                          <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Data Category</TableCell>
                          <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Visit</TableCell>
                          <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Description</TableCell>
                          <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Query Text</TableCell>
                          <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Roles</TableCell>
                          <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Frequency</TableCell>
                          <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Study</TableCell>
                          <TableCell align="right" sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Confidence</TableCell>
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
                              <TableCell>
                                <Tooltip title={check.description} placement="top">
                                  <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.description}</Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell>
                                <Tooltip title={check.queryText} placement="top">
                                  <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.queryText}</Typography>
                                </Tooltip>
                              </TableCell>
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
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Check Type</TableCell>
                              <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Category</TableCell>
                              <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Data Category</TableCell>
                              <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Visit</TableCell>
                              <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Description</TableCell>
                              <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Query Text</TableCell>
                              <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Roles</TableCell>
                              <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Frequency</TableCell>
                              <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}></TableCell>
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
                              <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper', zIndex: 1300 }}>
                                <Checkbox
                                  checked={true}
                                  onChange={() => {}}
                                />
                              </TableCell>
                              <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>ID</TableCell>
                              <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Type</TableCell>
                              <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Category</TableCell>
                              <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Data Category</TableCell>
                              <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Visit</TableCell>
                              <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Description</TableCell>
                              <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Query Text</TableCell>
                              <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Roles</TableCell>
                              <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Frequency</TableCell>
                              <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Source</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedChecks.map((check) => (
                              <TableRow key={check.id} hover>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={true}
                                    onChange={() => {}}
                                  />
                                </TableCell>
                                <TableCell>{check.id}</TableCell>
                                <TableCell>{check.checkType}</TableCell>
                                <TableCell>{check.checkCategory}</TableCell>
                                <TableCell>{check.dataCategory}</TableCell>
                                <TableCell>{check.visit}</TableCell>
                                <TableCell>
                                  <Tooltip title={check.description} placement="top">
                                    <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.description}</Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <Tooltip title={check.queryText} placement="top">
                                    <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.queryText}</Typography>
                                  </Tooltip>
                                </TableCell>
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
    setLibrarySearchTerm(searchTerm);
    setLibraryFilterType(filterType);
    setLibraryFilterCategory('');
    setLibraryFilterDataCategory('');
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

  const handleAddSelectedChecks = (selectedChecks) => {
    // Add all selected checks to the IDRP
    const newSelectedChecks = [...selectedChecks];
    setSelectedChecks(prevSelectedChecks => {
      // Filter out checks that are already selected
      const newChecks = newSelectedChecks.filter(
        newCheck => !prevSelectedChecks.some(check => check.id === newCheck.id)
      );
      return [...prevSelectedChecks, ...newChecks];
    });
    
    // Show success message
    alert(`${selectedChecks.length} checks added to IDRP`);
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
        <DialogContent sx={{ flex: 1, overflow: 'hidden', p: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            {/* Search field */}
            <TextField
              size="small"
              placeholder="Search..."
              value={librarySearchTerm}
              onChange={(e) => setLibrarySearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 200 }}
            />
            
            {/* Check Type filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="check-type-filter-label">Check Type</InputLabel>
              <Select
                labelId="check-type-filter-label"
                label="Check Type"
                value={libraryFilterType}
                onChange={(e) => setLibraryFilterType(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="DQ">DQ</MenuItem>
                <MenuItem value="IRL">IRL</MenuItem>
                <MenuItem value="Dashboard">Dashboard</MenuItem>
                <MenuItem value="Protocol Compliance">Protocol Compliance</MenuItem>
                <MenuItem value="Data Quality">Data Quality</MenuItem>
              </Select>
            </FormControl>
            
            {/* Check Category filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="check-category-filter-label">Check Category</InputLabel>
              <Select
                labelId="check-category-filter-label"
                label="Check Category"
                value={libraryFilterCategory}
                onChange={(e) => setLibraryFilterCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Data Quality">Data Quality</MenuItem>
                <MenuItem value="Missing Data">Missing Data</MenuItem>
                <MenuItem value="Safety">Safety</MenuItem>
                <MenuItem value="Efficacy">Efficacy</MenuItem>
                <MenuItem value="Protocol Compliance">Protocol Compliance</MenuItem>
              </Select>
            </FormControl>
            
            {/* Data Category filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="data-category-filter-label">Data Category</InputLabel>
              <Select
                labelId="data-category-filter-label"
                label="Data Category"
                value={libraryFilterDataCategory}
                onChange={(e) => setLibraryFilterDataCategory(e.target.value)}
              >
                <MenuItem value="">All Data Categories</MenuItem>
                <MenuItem value="Data">Data</MenuItem>
                <MenuItem value="Demographics">Demographics</MenuItem>
                <MenuItem value="Laboratory Data">Laboratory Data</MenuItem>
                <MenuItem value="Adverse Events">Adverse Events</MenuItem>
              </Select>
            </FormControl>
            
            {/* Rows per page selector */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="rows-per-page-label">Rows</InputLabel>
              <Select
                labelId="rows-per-page-label"
                label="Rows"
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setExpandedLibraryPage(0);
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            
            {/* Reset filters button */}
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<RefreshIcon />}
              onClick={() => {
                setLibrarySearchTerm('');
                setLibraryFilterType('');
                setLibraryFilterCategory('');
                setLibraryFilterDataCategory('');
              }}
            >
              Reset Filters
            </Button>
          </Box>
          
          <Paper elevation={0} variant="outlined" sx={{ height: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column' }}>
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper', zIndex: 1300 }}>
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
                    <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>ID</TableCell>
                    <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Type</TableCell>
                    <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Category</TableCell>
                    <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Data Category</TableCell>
                    <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Visit</TableCell>
                    <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Description</TableCell>
                    <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Query Text</TableCell>
                    <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Roles</TableCell>
                    <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Frequency</TableCell>
                    <TableCell align="right" sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Confidence</TableCell>
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
                        <TableCell sx={{ minWidth: 120, maxWidth: 120 }}>{check.id}</TableCell>
                        <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>{check.checkType}</TableCell>
                        <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>{check.checkCategory}</TableCell>
                        <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>{check.dataCategory}</TableCell>
                        <TableCell sx={{ minWidth: 120, maxWidth: 120 }}>{check.visit}</TableCell>
                        <TableCell sx={{ minWidth: 250 }}>
                          <Tooltip title={check.description} placement="top">
                            <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.description}</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ minWidth: 250 }}>
                          <Tooltip title={check.queryText} placement="top">
                            <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.queryText}</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ minWidth: 150, maxWidth: 150 }}>
                          {check.rolesInvolved && check.rolesInvolved.length > 0 ? (
                            <Tooltip title={check.rolesInvolved.join(', ')} placement="top">
                              <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.rolesInvolved.join(', ')}</Typography>
                            </Tooltip>
                          ) : ''}
                        </TableCell>
                        <TableCell sx={{ minWidth: 120, maxWidth: 120 }}>{check.frequency}</TableCell>
                        <TableCell align="right" sx={{ minWidth: 120, maxWidth: 120 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {expandedFilteredLibraryChecks.length} items found
                </Typography>
              </Box>
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
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              // Add selected checks
              const selectedChecks = expandedFilteredLibraryChecks.filter(check => 
                isCheckSelected(check.id)
              );
              handleAddSelectedChecks(selectedChecks);
              handleCloseLibraryDialog();
            }}
          >
            Add Selected
          </Button>
          <Button variant="contained" onClick={handleCloseLibraryDialog} color="primary">
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
                      <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper', zIndex: 1300 }}>
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
                      <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>ID</TableCell>
                      <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Type</TableCell>
                      <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Check Category</TableCell>
                      <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Data Category</TableCell>
                      <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Visit</TableCell>
                      <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Description</TableCell>
                      <TableCell sx={{ minWidth: 250, bgcolor: 'background.paper', zIndex: 1200 }}>Query Text</TableCell>
                      <TableCell sx={{ minWidth: 150, maxWidth: 150, bgcolor: 'background.paper', zIndex: 1200 }}>Roles</TableCell>
                      <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Frequency</TableCell>
                      <TableCell sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Study</TableCell>
                      <TableCell align="right" sx={{ minWidth: 120, maxWidth: 120, bgcolor: 'background.paper', zIndex: 1200 }}>Confidence</TableCell>
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
                          <TableCell>
                            <Tooltip title={check.description} placement="top">
                              <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.description}</Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={check.queryText} placement="top">
                              <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{check.queryText}</Typography>
                            </Tooltip>
                          </TableCell>
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
