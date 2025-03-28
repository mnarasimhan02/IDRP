import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme
} from '@mui/material';
import RecommendIcon from '@mui/icons-material/Recommend';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WizardIcon from '@mui/icons-material/AutoFixHigh';
import TableViewIcon from '@mui/icons-material/TableView';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function FeaturesPage() {
  const theme = useTheme();

  const featureSections = [
    {
      title: "iDRP Assist Recommendations",
      icon: <RecommendIcon fontSize="large" color="primary" />,
      description: "Leverage iDRP Assist to recommend data quality checks based on study attributes and historical data.",
      details: [
        "Recommendations from Standard Library based on study attributes",
        "Suggestions from Similar Studies with comparable metadata",
        "Real-time notifications for newly surfaced checks",
        "Standardized column structure across all check types"
      ]
    },
    {
      title: "Role-Based Collaboration",
      icon: <GroupWorkIcon fontSize="large" color="primary" />,
      description: "Enable seamless collaboration between different stakeholders in the clinical trial process.",
      details: [
        "Support for Data Managers, Medical Monitors, Safety Reviewers, and Study Managers",
        "Comments and threaded discussions for each data check",
        "Role-based color-coded avatars and labels",
        "Real-time notifications for updates and approvals"
      ]
    },
    {
      title: "Workflow Management",
      icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />,
      description: "Three-tier workflow from draft to approval with version control and change tracking.",
      details: [
        "Draft → iDRP Assist generated IDRP with user review capabilities",
        "In-Review → Shared with stakeholders for feedback",
        "Approved → Finalized and ready for execution",
        "Version control with major versions (1.0, 2.0, 3.0)",
        "Push-to-Veeva integration for compliance tracking"
      ]
    },
    {
      title: "Dashboard Overview",
      icon: <DashboardIcon fontSize="large" color="primary" />,
      description: "Comprehensive dashboard to monitor IDRPs across studies with filtering options.",
      details: [
        "Display multiple IDRPs with status indicators",
        "Filter by TA → Indication → Phase hierarchy",
        "Filter by study status (Draft, In-Review, Approved)",
        "Quick actions for viewing, editing, and exporting",
        "Real-time notifications for important workflow events"
      ]
    },
    {
      title: "IDRP Creation Wizard",
      icon: <WizardIcon fontSize="large" color="primary" />,
      description: "Step-by-step wizard for creating new IDRPs with iDRP Assist recommendations.",
      details: [
        "Step 1: Study Information capture",
        "Step 2: iDRP Assist with accept/modify/reject options",
        "Step 3: Review & Submit with role-based assignments",
        "Differentiation between library, study-specific, and iDRP Assist generated checks",
        "Standardized column structure validation"
      ]
    },
    {
      title: "Detailed IDRP View",
      icon: <TableViewIcon fontSize="large" color="primary" />,
      description: "Comprehensive view of IDRP with standardized columns and inline actions.",
      details: [
        "Header Section with study details and metadata",
        "Table of Checks with standardized columns",
        "Hover effects & inline actions (Edit, Approve, Comment)",
        "Color-coded status chips",
        "Download options in CSV and Excel formats"
      ]
    },
    {
      title: "Reports & Compliance",
      icon: <AssessmentIcon fontSize="large" color="primary" />,
      description: "Detailed reports and compliance tracking for regulatory adherence.",
      details: [
        "Clickable reports with expandable views",
        "Compliance report per study",
        "Push-to-Veeva option per row",
        "Study-wide compliance summary",
        "Exportable reports in Excel and CSV formats"
      ]
    },
    {
      title: "Enhanced Landing Page",
      icon: <HomeIcon fontSize="large" color="primary" />,
      description: "Modern landing page with status cards and recommendation sections.",
      details: [
        "Cards for IDRP status (Draft, In-Review, Approved)",
        "Collapsible Library-Based and Study-Based recommendations",
        "Clickable IDRP/Study references",
        "Role-based view filtering",
        "Hierarchical filters for TA → Indication → Phase"
      ]
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            IDRP Features
          </Typography>
          <Typography variant="h5" component="p">
            Discover the comprehensive features of the Intelligent Data Review Plan
          </Typography>
        </Container>
      </Box>

      {/* Features Overview */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {featureSections.map((section, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
                      {section.icon}
                      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 2 }}>
                        {section.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {section.description}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <List>
                      {section.details.map((detail, detailIndex) => (
                        <ListItem key={detailIndex}>
                          <ListItemIcon>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={detail} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Technical Considerations */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Technical Considerations
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Built with modern technologies and best practices
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom color="primary">
                    Modern UI
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2">
                    Material Design UI with responsive components and modern aesthetics
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom color="primary">
                    Real-Time Features
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2">
                    Real-time collaboration, notifications, and updates for seamless teamwork
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom color="primary">
                    Access Control
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2">
                    Role-Based Access Control (RBAC) for secure and appropriate permissions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom color="primary">
                    Integration
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2">
                    Push-to-Veeva integration for compliance and seamless workflow
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default FeaturesPage;
