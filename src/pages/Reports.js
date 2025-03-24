import React, { useState } from 'react';
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
  Divider,
  useTheme
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

// Mock data for reports
const mockComplianceData = [
  {
    study: 'STUDY-001',
    totalChecks: 42,
    completedChecks: 35,
    pendingChecks: 5,
    failedChecks: 2,
    lastRun: '2025-03-19',
    status: 'In Progress'
  },
  {
    study: 'STUDY-002',
    totalChecks: 36,
    completedChecks: 30,
    pendingChecks: 6,
    failedChecks: 0,
    lastRun: '2025-03-19',
    status: 'In Progress'
  },
  {
    study: 'STUDY-003',
    totalChecks: 51,
    completedChecks: 51,
    pendingChecks: 0,
    failedChecks: 0,
    lastRun: '2025-03-18',
    status: 'Complete'
  },
  {
    study: 'STUDY-004',
    totalChecks: 47,
    completedChecks: 45,
    pendingChecks: 0,
    failedChecks: 2,
    lastRun: '2025-03-17',
    status: 'Complete'
  }
];

const mockIssuesData = [
  {
    study: 'STUDY-001',
    issueId: 'ISS-001',
    description: 'Missing date of birth for 3 subjects',
    severity: 'Medium',
    status: 'Open',
    assignedTo: 'John Doe',
    openDate: '2025-03-15'
  },
  {
    study: 'STUDY-001',
    issueId: 'ISS-002',
    description: 'Out of range lab values for 2 subjects',
    severity: 'High',
    status: 'Open',
    assignedTo: 'Jane Smith',
    openDate: '2025-03-16'
  },
  {
    study: 'STUDY-002',
    issueId: 'ISS-003',
    description: 'Protocol deviation for visit scheduling',
    severity: 'Low',
    status: 'Closed',
    assignedTo: 'Robert Johnson',
    openDate: '2025-03-10',
    closedDate: '2025-03-12'
  },
  {
    study: 'STUDY-004',
    issueId: 'ISS-004',
    description: 'Prohibited medication detected',
    severity: 'High',
    status: 'Open',
    assignedTo: 'Sarah Williams',
    openDate: '2025-03-17'
  },
  {
    study: 'STUDY-004',
    issueId: 'ISS-005',
    description: 'Missing efficacy endpoint data',
    severity: 'High',
    status: 'Closed',
    assignedTo: 'John Doe',
    openDate: '2025-03-15',
    closedDate: '2025-03-18'
  }
];

// Severity color mapping
const severityColors = {
  'Low': '#4caf50',    // Green
  'Medium': '#ff9800', // Orange
  'High': '#f44336'    // Red
};

// Status color mapping
const statusColors = {
  'Open': '#f44336',   // Red
  'Closed': '#4caf50', // Green
  'In Progress': '#2196f3', // Blue
  'Complete': '#4caf50' // Green
};

function Reports() {
  const theme = useTheme();
  const [selectedStudy, setSelectedStudy] = useState('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 7 Days');
  
  const handleStudyChange = (event) => {
    setSelectedStudy(event.target.value);
  };
  
  const handleTimeframeChange = (event) => {
    setSelectedTimeframe(event.target.value);
  };
  
  // Filter data based on selected study
  const filteredComplianceData = selectedStudy === 'All' 
    ? mockComplianceData 
    : mockComplianceData.filter(item => item.study === selectedStudy);
    
  const filteredIssuesData = selectedStudy === 'All'
    ? mockIssuesData
    : mockIssuesData.filter(item => item.study === selectedStudy);
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Compliance
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Study</InputLabel>
              <Select
                value={selectedStudy}
                label="Study"
                onChange={handleStudyChange}
              >
                <MenuItem value="All">All Studies</MenuItem>
                <MenuItem value="STUDY-001">STUDY-001</MenuItem>
                <MenuItem value="STUDY-002">STUDY-002</MenuItem>
                <MenuItem value="STUDY-003">STUDY-003</MenuItem>
                <MenuItem value="STUDY-004">STUDY-004</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={selectedTimeframe}
                label="Timeframe"
                onChange={handleTimeframeChange}
              >
                <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                <MenuItem value="Last 90 Days">Last 90 Days</MenuItem>
                <MenuItem value="Year to Date">Year to Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="contained" 
              startIcon={<FileDownloadIcon />}
              fullWidth
            >
              Export Report
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Completed Checks
                </Typography>
              </Box>
              <Typography variant="h4">
                {filteredComplianceData.reduce((sum, item) => sum + item.completedChecks, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HourglassEmptyIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Pending Checks
                </Typography>
              </Box>
              <Typography variant="h4">
                {filteredComplianceData.reduce((sum, item) => sum + item.pendingChecks, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ErrorIcon color="error" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Failed Checks
                </Typography>
              </Box>
              <Typography variant="h4">
                {filteredComplianceData.reduce((sum, item) => sum + item.failedChecks, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ErrorIcon color="error" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Open Issues
                </Typography>
              </Box>
              <Typography variant="h4">
                {filteredIssuesData.filter(issue => issue.status === 'Open').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Compliance Table */}
      <Typography variant="h6" gutterBottom>
        Compliance Status
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Study</TableCell>
              <TableCell>Total Checks</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>Failed</TableCell>
              <TableCell>Last Run</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComplianceData.map((item) => (
              <TableRow key={item.study}>
                <TableCell>{item.study}</TableCell>
                <TableCell>{item.totalChecks}</TableCell>
                <TableCell>{item.completedChecks}</TableCell>
                <TableCell>{item.pendingChecks}</TableCell>
                <TableCell>{item.failedChecks}</TableCell>
                <TableCell>{item.lastRun}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    size="small"
                    sx={{ 
                      backgroundColor: statusColors[item.status] + '20',
                      color: statusColors[item.status],
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Issues Table */}
      <Typography variant="h6" gutterBottom>
        Data Issues
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Issue ID</TableCell>
              <TableCell>Study</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Open Date</TableCell>
              <TableCell>Closed Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIssuesData.map((issue) => (
              <TableRow key={issue.issueId}>
                <TableCell>{issue.issueId}</TableCell>
                <TableCell>{issue.study}</TableCell>
                <TableCell>{issue.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={issue.severity} 
                    size="small"
                    sx={{ 
                      backgroundColor: severityColors[issue.severity] + '20',
                      color: severityColors[issue.severity],
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={issue.status} 
                    size="small"
                    sx={{ 
                      backgroundColor: statusColors[issue.status] + '20',
                      color: statusColors[issue.status],
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>{issue.assignedTo}</TableCell>
                <TableCell>{issue.openDate}</TableCell>
                <TableCell>{issue.closedDate || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Reports;
