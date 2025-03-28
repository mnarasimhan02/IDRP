import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';

function AboutPage() {
  const outcomes = [
    {
      title: "Increased Efficiency",
      description: "Reduce manual efforts in data review by up to 40% with AI-driven recommendations."
    },
    {
      title: "Better Collaboration",
      description: "Enable seamless communication between stakeholders with role-based access and threaded discussions."
    },
    {
      title: "Regulatory Compliance",
      description: "Ensure adherence to regulatory requirements with standardized checks and Veeva integration."
    },
    {
      title: "Streamlined Workflow",
      description: "Simplify the process from draft to approval with clear status indicators and version control."
    }
  ];

  const team = [
    {
      name: "Jane Smith",
      role: "Product Manager",
      avatar: "JS",
      bio: "Jane has over 10 years of experience in clinical data management and product development."
    },
    {
      name: "Michael Johnson",
      role: "Lead Developer",
      avatar: "MJ",
      bio: "Michael specializes in AI-driven applications and has worked on multiple clinical trial platforms."
    },
    {
      name: "Sarah Williams",
      role: "UX Designer",
      avatar: "SW",
      bio: "Sarah focuses on creating intuitive user experiences for complex clinical data systems."
    },
    {
      name: "David Chen",
      role: "Data Scientist",
      avatar: "DC",
      bio: "David brings expertise in machine learning and predictive analytics for clinical data."
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            About IDRP
          </Typography>
          <Typography variant="h5" component="p">
            Learn about the Intelligent Data Review Plan and its impact on clinical data management
          </Typography>
        </Container>
      </Box>

      {/* Project Overview */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              Project Overview
            </Typography>
            <Typography variant="body1" paragraph>
              The Intelligent Data Review Plan (IDRP) is designed to revolutionize how clinical data managers approach data review in clinical trials. By leveraging AI-driven recommendations, collaborative workflows, and modern UI components, IDRP significantly reduces manual efforts while ensuring regulatory compliance.
            </Typography>
            <Typography variant="body1" paragraph>
              Our solution addresses key challenges in clinical data management, including the time-consuming nature of manual data review, the complexity of cross-functional collaboration, and the need for standardized approaches to ensure data quality and compliance.
            </Typography>
            <Typography variant="body1">
              With IDRP, clinical data managers can focus on high-value activities while the AI handles routine recommendations, ultimately leading to faster, more efficient, and more compliant clinical trials.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Key Benefits
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AutoAwesomeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="AI-Driven Recommendations" 
                    secondary="Leverage machine learning to suggest relevant data quality checks" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GroupsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cross-Functional Collaboration" 
                    secondary="Enable seamless teamwork between different stakeholders" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Standardized Approach" 
                    secondary="Ensure consistency with standardized column structure across all checks" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Efficiency Gains" 
                    secondary="Reduce manual efforts and accelerate the data review process" 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Expected Outcomes */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Expected Outcomes
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
            The implementation of IDRP delivers significant improvements in clinical data management
          </Typography>
          <Grid container spacing={3}>
            {outcomes.map((outcome, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom color="primary">
                      {outcome.title}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2">
                      {outcome.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Meet the Team */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Meet the Team
        </Typography>
        <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }}>
          The talented individuals behind the IDRP project
        </Typography>
        <Grid container spacing={3}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '1.5rem'
                  }}
                >
                  {member.avatar}
                </Avatar>
                <Typography variant="h5" component="h3" align="center" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" align="center" gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body2" align="center">
                  {member.bio}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Interested in Learning More?
          </Typography>
          <Typography variant="body1" paragraph>
            Contact us to discover how IDRP can transform your clinical data management workflow
          </Typography>
          <Typography variant="h6">
            contact@idrp-portfolio.com
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default AboutPage;
