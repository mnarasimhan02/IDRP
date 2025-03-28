import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  AvatarGroup,
  Divider,
  useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WizardIcon from '@mui/icons-material/AutoFixHigh';
import TableViewIcon from '@mui/icons-material/TableView';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Mock data for the demo
const mockChecks = [
  {
    id: 'CHK-001',
    type: 'Demographics',
    description: 'Check for missing date of birth',
    queryText: 'Identify all subjects with missing DOB',
    roles: ['DM', 'MM'],
    frequency: 'Daily',
    source: 'Library',
    status: 'Approved'
  },
  {
    id: 'CHK-002',
    type: 'Vitals',
    description: 'Flag abnormal blood pressure readings',
    queryText: 'Identify subjects with SBP > 160 or DBP > 100',
    roles: ['DM', 'MM', 'SR'],
    frequency: 'Daily',
    source: 'Similar Study',
    status: 'In-Review'
  },
  {
    id: 'CHK-003',
    type: 'Labs',
    description: 'Check for out-of-range liver enzymes',
    queryText: 'Identify subjects with ALT or AST > 3x ULN',
    roles: ['DM', 'MM', 'SR'],
    frequency: 'Weekly',
    source: 'AI Suggested',
    status: 'Draft'
  },
  {
    id: 'CHK-004',
    type: 'Adverse Events',
    description: 'Review serious adverse events',
    queryText: 'List all SAEs reported in the last 7 days',
    roles: ['DM', 'MM', 'SR', 'SM'],
    frequency: 'Daily',
    source: 'Library',
    status: 'Approved'
  },
  {
    id: 'CHK-005',
    type: 'Concomitant Medications',
    description: 'Check for prohibited medications',
    queryText: 'Identify subjects taking medications from the prohibited list',
    roles: ['DM', 'MM'],
    frequency: 'Weekly',
    source: 'AI Suggested',
    status: 'Draft'
  }
];

// Role colors for avatars
const roleColors = {
  DM: '#1976d2', // Data Manager - Blue
  MM: '#9c27b0', // Medical Monitor - Purple
  SR: '#f44336', // Safety Reviewer - Red
  SM: '#4caf50'  // Study Manager - Green
};

function DemoPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return theme.palette.status.draft;
      case 'In-Review':
        return theme.palette.status.inReview;
      case 'Approved':
        return theme.palette.status.approved;
      default:
        return theme.palette.grey[500];
    }
  };

  // Function to get source icon/color
  const getSourceChip = (source) => {
    switch (source) {
      case 'Library':
        return <Chip label={source} size="small" color="primary" variant="outlined" />;
      case 'Similar Study':
        return <Chip label={source} size="small" color="secondary" variant="outlined" />;
      case 'AI Suggested':
        return <Chip label={source} size="small" color="success" variant="outlined" />;
      default:
        return <Chip label={source} size="small" variant="outlined" />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            IDRP Demo
          </Typography>
          <Typography variant="h5" component="p">
            Experience the key features of the Intelligent Data Review Plan
          </Typography>
        </Container>
      </Box>

      {/* Demo Tabs */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ width: '100%', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<WizardIcon />} label="IDRP Wizard" />
            <Tab icon={<TableViewIcon />} label="IDRP View" />
            <Tab icon={<AssessmentIcon />} label="Reports" />
          </Tabs>
        </Paper>

        {/* Dashboard Tab */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" paragraph>
              Monitor multiple IDRPs across studies with status indicators and quick actions.
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  bgcolor: theme.palette.status.draft + '20', 
                  borderLeft: `4px solid ${theme.palette.status.draft}` 
                }}>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                      Draft
                    </Typography>
                    <Typography variant="h3" component="p">
                      3
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      IDRPs in draft stage
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  bgcolor: theme.palette.status.inReview + '20', 
                  borderLeft: `4px solid ${theme.palette.status.inReview}` 
                }}>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                      In-Review
                    </Typography>
                    <Typography variant="h3" component="p">
                      5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      IDRPs in review stage
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  bgcolor: theme.palette.status.approved + '20', 
                  borderLeft: `4px solid ${theme.palette.status.approved}` 
                }}>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                      Approved
                    </Typography>
                    <Typography variant="h3" component="p">
                      8
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      IDRPs approved and active
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h5" component="h3" gutterBottom>
              Recent IDRPs
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Study ID</TableCell>
                    <TableCell>Therapeutic Area</TableCell>
                    <TableCell>Phase</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>STUDY-001</TableCell>
                    <TableCell>Oncology</TableCell>
                    <TableCell>Phase III</TableCell>
                    <TableCell>
                      <Chip 
                        label="Approved" 
                        size="small" 
                        sx={{ bgcolor: theme.palette.status.approved, color: 'white' }} 
                      />
                    </TableCell>
                    <TableCell>2025-03-15</TableCell>
                    <TableCell>
                      <Button size="small" color="primary">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>STUDY-002</TableCell>
                    <TableCell>Cardiology</TableCell>
                    <TableCell>Phase II</TableCell>
                    <TableCell>
                      <Chip 
                        label="In-Review" 
                        size="small" 
                        sx={{ bgcolor: theme.palette.status.inReview, color: 'white' }} 
                      />
                    </TableCell>
                    <TableCell>2025-03-18</TableCell>
                    <TableCell>
                      <Button size="small" color="primary">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>STUDY-003</TableCell>
                    <TableCell>Neurology</TableCell>
                    <TableCell>Phase I</TableCell>
                    <TableCell>
                      <Chip 
                        label="Draft" 
                        size="small" 
                        sx={{ bgcolor: theme.palette.status.draft, color: 'white' }} 
                      />
                    </TableCell>
                    <TableCell>2025-03-19</TableCell>
                    <TableCell>
                      <Button size="small" color="primary">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* IDRP Wizard Tab */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              IDRP Creation Wizard
            </Typography>
            <Typography variant="body1" paragraph>
              Step-by-step process for creating a new Intelligent Data Review Plan.
            </Typography>
            
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Step 1: Study Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Study Details
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Study ID</Typography>
                        <Typography variant="body1">STUDY-004</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Therapeutic Area</Typography>
                        <Typography variant="body1">Immunology</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Indication</Typography>
                        <Typography variant="body1">Rheumatoid Arthritis</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Phase</Typography>
                        <Typography variant="body1">Phase II</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Additional Information
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Study Start Date</Typography>
                        <Typography variant="body1">2025-04-01</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Estimated End Date</Typography>
                        <Typography variant="body1">2026-10-31</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Number of Sites</Typography>
                        <Typography variant="body1">12</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Estimated Enrollment</Typography>
                        <Typography variant="body1">150 subjects</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="primary">
                  Next: iDRP Assist
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* IDRP View Tab */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              Detailed IDRP View
            </Typography>
            <Typography variant="body1" paragraph>
              Comprehensive view of IDRP with standardized columns and inline actions.
            </Typography>
            
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Chip 
                      label="In-Review" 
                      sx={{ bgcolor: theme.palette.status.inReview, color: 'white' }} 
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h5" component="h3">
                      STUDY-002: Cardiology Phase II Trial
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      Version: Draft
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary" size="small">
                      Export
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Check ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockChecks.map((check) => (
                      <TableRow key={check.id} hover>
                        <TableCell>{check.id}</TableCell>
                        <TableCell>{check.type}</TableCell>
                        <TableCell>{check.description}</TableCell>
                        <TableCell>
                          <AvatarGroup max={3}>
                            {check.roles.map((role, index) => (
                              <Avatar 
                                key={index} 
                                sx={{ 
                                  width: 24, 
                                  height: 24, 
                                  fontSize: '0.75rem',
                                  bgcolor: roleColors[role] 
                                }}
                              >
                                {role}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                        </TableCell>
                        <TableCell>{check.frequency}</TableCell>
                        <TableCell>{getSourceChip(check.source)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={check.status} 
                            size="small" 
                            sx={{ 
                              bgcolor: getStatusColor(check.status), 
                              color: 'white' 
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {/* Reports Tab */}
        {tabValue === 3 && (
          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              Reports & Compliance Tracking
            </Typography>
            <Typography variant="body1" paragraph>
              Detailed reports and compliance tracking for regulatory adherence.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                      Compliance Summary
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1">Total Checks:</Typography>
                      <Typography variant="body1" fontWeight="bold">42</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1">Compliant Checks:</Typography>
                      <Typography variant="body1" fontWeight="bold" color="success.main">38</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1">Non-Compliant Checks:</Typography>
                      <Typography variant="body1" fontWeight="bold" color="error.main">4</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Compliance Rate:</Typography>
                      <Typography variant="body1" fontWeight="bold" color="success.main">90.5%</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Button variant="outlined" color="primary" fullWidth>
                      View Detailed Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom>
                      Push to Veeva Status
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Study ID</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Push Date</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>STUDY-001</TableCell>
                            <TableCell>1.0</TableCell>
                            <TableCell>2025-03-10</TableCell>
                            <TableCell>
                              <Chip label="Success" size="small" color="success" />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>STUDY-002</TableCell>
                            <TableCell>Draft</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>
                              <Chip label="Pending" size="small" color="warning" />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>STUDY-004</TableCell>
                            <TableCell>1.0</TableCell>
                            <TableCell>2025-03-18</TableCell>
                            <TableCell>
                              <Chip label="Success" size="small" color="success" />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Divider sx={{ my: 2 }} />
                    <Button variant="outlined" color="primary" fullWidth>
                      Push Selected to Veeva
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default DemoPage;
