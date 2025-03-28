import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';

function HomePage() {
  const theme = useTheme();

  const features = [
    {
      icon: <AutoAwesomeIcon fontSize="large" color="primary" />,
      title: 'AI-Driven Recommendations',
      description: 'Leverage AI to recommend data quality checks from standard libraries and similar studies.'
    },
    {
      icon: <GroupsIcon fontSize="large" color="primary" />,
      title: 'Role-Based Collaboration',
      description: 'Enable seamless collaboration between data managers, medical monitors, safety reviewers, and study managers.'
    },
    {
      icon: <VerifiedIcon fontSize="large" color="primary" />,
      title: 'Streamlined Workflow',
      description: 'Three-tier workflow from draft to approval with version control and change tracking.'
    },
    {
      icon: <SpeedIcon fontSize="large" color="primary" />,
      title: 'Increased Efficiency',
      description: 'Reduce manual efforts and ensure regulatory compliance with AI-assisted data review.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Intelligent Data Review Plan
          </Typography>
          <Typography variant="h5" component="p" paragraph>
            AI-Assisted Clinical Data Management Solution
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/demo"
              sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
            >
              View Demo
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              to="/features"
            >
              Explore Features
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Overview */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Discover how IDRP can transform your clinical data management workflow
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Workflow Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Streamlined Workflow
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            From AI-generated recommendations to final approval
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 2, 
                border: `2px solid ${theme.palette.status.draft}`,
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom color="status.draft">
                    Draft
                  </Typography>
                  <Typography variant="body1" paragraph>
                    AI generates initial IDRP recommendations based on study attributes and historical data.
                  </Typography>
                  <Typography variant="body1">
                    Users can review, accept, or modify recommendations before moving to the next stage.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 2, 
                border: `2px solid ${theme.palette.status.inReview}`,
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom color="status.inReview">
                    In-Review
                  </Typography>
                  <Typography variant="body1" paragraph>
                    IDRP is shared with stakeholders for collaborative feedback and discussion.
                  </Typography>
                  <Typography variant="body1">
                    Comments and threaded discussions facilitate cross-functional collaboration.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 2, 
                border: `2px solid ${theme.palette.status.approved}`,
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom color="status.approved">
                    Approved
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Finalized IDRP is versioned and ready for execution.
                  </Typography>
                  <Typography variant="body1">
                    Push-to-Veeva integration ensures compliance tracking and regulatory adherence.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Ready to Transform Your Data Review Process?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Explore our demo to see how IDRP can increase efficiency and ensure regulatory compliance.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={RouterLink}
          to="/demo"
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
}

export default HomePage;
