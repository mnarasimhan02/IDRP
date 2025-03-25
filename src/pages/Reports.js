import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import { useState } from 'react';

// Mock data for compliance reports
const mockComplianceReports = [
  {
    id: 'M24-885',
    title: 'M24-885 - Final Lock - Compliance Report',
    studyName: 'M24-885',
    protocolTitle: 'A Phase 2a Multicenter, Randomized, Platform Study of Targeted Therapies for the Treatment of Adult Subjects with Moderate to Severe Crohn\'s Disease',
    therapeuticArea: 'Immunology',
    indication: 'Crohn\'s Disease',
    compound: 'ABBV-766,ABBV-066,ABT-981,ABBV-382',
    phase: 'Phase 2',
    version: '1.0',
    lastUpdated: '2025-03-14',
    status: 'Final',
    totalChecks: 42,
    passedChecks: 40,
    failedChecks: 2,
    checkCategories: [
      'Cardiovascular (Cardiac) Adverse Event',
      'Cardiovascular History and CV Risk Factors',
      'Demographics',
      'Laboratory Results',
      'Medication'
    ]
  },
  {
    id: 'XYZ-123-P2',
    title: 'XYZ-123-P2 - Final Lock - Compliance Report',
    studyName: 'XYZ-123-P2',
    protocolTitle: 'A Phase 3 Study of XYZ-123 in Patients with Rheumatoid Arthritis',
    therapeuticArea: 'Immunology',
    indication: 'Rheumatoid Arthritis',
    compound: 'XYZ-123',
    phase: 'Phase 3',
    version: '1.0',
    lastUpdated: '2025-03-10',
    status: 'Final',
    totalChecks: 38,
    passedChecks: 36,
    failedChecks: 2,
    checkCategories: [
      'Demographics',
      'Laboratory Results',
      'Adverse Events',
      'Concomitant Medications',
      'Efficacy Assessments'
    ]
  },
  {
    id: 'ABC-456',
    title: 'ABC-456 - Interim Analysis - Compliance Report',
    studyName: 'ABC-456',
    protocolTitle: 'A Phase 2b Study of ABC-456 in Patients with Psoriasis',
    therapeuticArea: 'Dermatology',
    indication: 'Psoriasis',
    compound: 'ABC-456',
    phase: 'Phase 2b',
    version: '0.9',
    lastUpdated: '2025-03-01',
    status: 'Draft',
    totalChecks: 35,
    passedChecks: 30,
    failedChecks: 5,
    checkCategories: [
      'Demographics',
      'Vital Signs',
      'Laboratory Results',
      'Adverse Events',
      'Efficacy Assessments'
    ]
  },
  {
    id: 'DEF-789',
    title: 'DEF-789 - Database Lock - Compliance Report',
    studyName: 'DEF-789',
    protocolTitle: 'A Phase 3 Study of DEF-789 in Patients with Ulcerative Colitis',
    therapeuticArea: 'Immunology',
    indication: 'Ulcerative Colitis',
    compound: 'DEF-789',
    phase: 'Phase 3',
    version: '1.0',
    lastUpdated: '2025-02-15',
    status: 'Final',
    totalChecks: 45,
    passedChecks: 43,
    failedChecks: 2,
    checkCategories: [
      'Demographics',
      'Vital Signs',
      'Laboratory Results',
      'Adverse Events',
      'Concomitant Medications',
      'Efficacy Assessments'
    ]
  }
];

// Mock data for IDRP checks
const mockIDRPChecks = {
  'M24-885': {
    checks: [
      {
        id: 'IDRP Check-1290352',
        dataCategory: 'Cardiovascular (Cardiac) Adverse Event',
        description: 'If the answer to "Was the subject hospitalized?" is "yes" and "Visit hospital emergency room?" is "yes" then date of admission should be equal to Date and time of visit Form: Cardiovascular (Cardiac) Adverse Event CRF. Time should be ignored during date comparison.',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      },
      {
        id: 'IDRP Check-1290353',
        dataCategory: 'Cardiovascular (Cardiac) Adverse Event',
        description: 'If "Is this a Cardiovascular (Cardiac) AE?" is "Yes" then Cardiovascular Adverse event Form should be present and completed',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      },
      {
        id: 'IDRP Check-1290354',
        dataCategory: 'Cardiovascular History and CV Risk Factors',
        description: 'Date Cardiovascular History and CV Risk Factors form should be on or before corresponding AE start date',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      },
      {
        id: 'IDRP Check-1290355',
        dataCategory: 'Cardiovascular History and CV Risk Factors',
        description: 'If response for "Is this a cardiovascular (cardiac) AE?" is "Yes" on AE page then data for "Cardiovascular History and CV Risk Factors" eCRF should be entered.',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      },
      {
        id: 'IDRP Check-1290359',
        dataCategory: 'Demographics',
        description: 'Date of collection must be on or prior to investigator decision',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      }
    ]
  },
  'XYZ-123-P2': {
    checks: [
      {
        id: 'IDRP Check-2345001',
        dataCategory: 'Demographics',
        description: 'Date of birth must be at least 18 years before screening date',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      },
      {
        id: 'IDRP Check-2345002',
        dataCategory: 'Laboratory Results',
        description: 'All screening lab values must be within eligibility criteria range',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      },
      {
        id: 'IDRP Check-2345003',
        dataCategory: 'Adverse Events',
        description: 'All serious adverse events must have corresponding SAE forms completed',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      }
    ]
  },
  'ABC-456': {
    checks: [
      {
        id: 'IDRP Check-3456001',
        dataCategory: 'Demographics',
        description: 'All subjects must have complete demographic information',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      },
      {
        id: 'IDRP Check-3456002',
        dataCategory: 'Vital Signs',
        description: 'Vital signs must be recorded at every visit',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      }
    ]
  },
  'DEF-789': {
    checks: [
      {
        id: 'IDRP Check-4567001',
        dataCategory: 'Demographics',
        description: 'All subjects must have complete demographic information',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      },
      {
        id: 'IDRP Check-4567002',
        dataCategory: 'Efficacy Assessments',
        description: 'Primary efficacy endpoint must be completed for all subjects at week 8',
        role: 'Data Manager',
        frequency: 'Weekly',
        reviews: 0,
        queriesClosed: 0,
        tasksCompleted: 0,
        observations: 0
      }
    ]
  }
};

// Status color mapping
const statusColors = {
  'Draft': '#757575',      // Grey
  'In Progress': '#2196f3', // Blue
  'Final': '#4caf50'       // Green
};

function Reports() {
  const theme = useTheme();
  const [selectedStudy, setSelectedStudy] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [pushToVeevaDialog, setPushToVeevaDialog] = useState(false);
  const [currentReportId, setCurrentReportId] = useState(null);
  
  // Filter reports based on selected study
  const filteredReports = selectedStudy === 'All' 
    ? mockComplianceReports 
    : mockComplianceReports.filter(report => report.studyName === selectedStudy);
  
  const handleStudyChange = (event) => {
    setSelectedStudy(event.target.value);
  };
  
  const handleViewReport = (reportId) => {
    const report = mockComplianceReports.find(r => r.id === reportId);
    setSelectedReport(report);
    setOpenReportDialog(true);
  };
  
  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
  };
  
  const handlePushToVeeva = (reportId) => {
    setCurrentReportId(reportId);
    setPushToVeevaDialog(true);
  };
  
  const handleConfirmPushToVeeva = () => {
    toast.success(`Successfully pushed ${currentReportId} compliance report to Veeva`);
    setPushToVeevaDialog(false);
  };
  
  const handleCancelPushToVeeva = () => {
    setPushToVeevaDialog(false);
  };
  
  const handleDownloadCSV = (reportId) => {
    toast.success(`Downloaded ${reportId} compliance report as CSV`);
  };
  
  const handleDownloadPDF = (reportId) => {
    toast.success(`Downloaded ${reportId} compliance report as PDF`);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Compliance Reports
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Study</InputLabel>
              <Select
                value={selectedStudy}
                label="Study"
                onChange={handleStudyChange}
              >
                <MenuItem value="All">All Studies</MenuItem>
                {mockComplianceReports.map(report => (
                  <MenuItem key={report.studyName} value={report.studyName}>
                    {report.studyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Compliance Reports Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Study ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Report Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Version</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Updated</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Checks</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.studyName}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.version}</TableCell>
                  <TableCell>{report.lastUpdated}</TableCell>
                  <TableCell>
                    <Chip 
                      label={report.status} 
                      size="small"
                      sx={{ 
                        backgroundColor: statusColors[report.status] + '20',
                        color: statusColors[report.status],
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>{report.totalChecks}</TableCell>
                  <TableCell>
                    <Tooltip title="View Report">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleViewReport(report.id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download CSV">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleDownloadCSV(report.id)}
                      >
                        <FileDownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                      <IconButton 
                        size="small" 
                        color="secondary"
                        onClick={() => handleDownloadPDF(report.id)}
                      >
                        <PictureAsPdfIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Push to Veeva">
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handlePushToVeeva(report.id)}
                      >
                        <CloudUploadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No compliance reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Report Detail Dialog */}
      <Dialog
        open={openReportDialog}
        onClose={handleCloseReportDialog}
        maxWidth="lg"
        fullWidth
      >
        {selectedReport && (
          <>
            <DialogTitle>
              {selectedReport.title}
              <Typography variant="subtitle2" color="text.secondary">
                Version {selectedReport.version} | {selectedReport.lastUpdated}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Study Number</Typography>
                  <Typography variant="body1">{selectedReport.studyName}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Full Protocol Title</Typography>
                  <Typography variant="body1">{selectedReport.protocolTitle}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Therapeutic Area</Typography>
                  <Typography variant="body1">{selectedReport.therapeuticArea}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Indication</Typography>
                  <Typography variant="body1">{selectedReport.indication}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Compound</Typography>
                  <Typography variant="body1">{selectedReport.compound}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phase</Typography>
                  <Typography variant="body1">{selectedReport.phase}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                IDRP Checks
              </Typography>
              
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell>IDRP Check ID</TableCell>
                      <TableCell>Data Category</TableCell>
                      <TableCell>IDRP Check Description</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell># of Reviews</TableCell>
                      <TableCell>Queries Closed</TableCell>
                      <TableCell>Tasks Completed</TableCell>
                      <TableCell>Observations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockIDRPChecks[selectedReport.studyName] && mockIDRPChecks[selectedReport.studyName].checks ? (
                      mockIDRPChecks[selectedReport.studyName].checks.map((check) => (
                        <TableRow key={check.id}>
                          <TableCell>{check.id}</TableCell>
                          <TableCell>{check.dataCategory}</TableCell>
                          <TableCell>{check.description}</TableCell>
                          <TableCell>{check.role}</TableCell>
                          <TableCell>{check.frequency}</TableCell>
                          <TableCell align="center">{check.reviews}</TableCell>
                          <TableCell align="center">{check.queriesClosed}</TableCell>
                          <TableCell align="center">{check.tasksCompleted}</TableCell>
                          <TableCell align="center">{check.observations}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No IDRP checks found for this study
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => handleDownloadCSV(selectedReport.id)}
                >
                  Download CSV
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={() => handleDownloadPDF(selectedReport.id)}
                  color="secondary"
                >
                  Download PDF
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => {
                    handleCloseReportDialog();
                    handlePushToVeeva(selectedReport.id);
                  }}
                  color="success"
                >
                  Push to Veeva
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
      
      {/* Push to Veeva Confirmation Dialog */}
      <Dialog
        open={pushToVeevaDialog}
        onClose={handleCancelPushToVeeva}
      >
        <DialogTitle>Push to Veeva</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to push the {currentReportId} compliance report to Veeva?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPushToVeeva}>Cancel</Button>
          <Button onClick={handleConfirmPushToVeeva} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Reports;
