import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CloudIcon from '@mui/icons-material/Cloud';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Settings() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    dailyDigest: false,
    newCommentNotification: true,
    statusChangeNotification: true,
    newIssueNotification: true
  });
  const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);
  const [selectedIntegrationType, setSelectedIntegrationType] = useState('');
  
  // Mock data for API keys and integrations
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Veeva Integration Key', key: 'vee-********-****-****', created: '2025-01-15', expires: '2026-01-15' },
    { id: 2, name: 'Export Service Key', key: 'exp-********-****-****', created: '2025-02-10', expires: '2026-02-10' }
  ]);
  
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Veeva Vault', status: 'Connected', lastSync: '2025-03-19' },
    { id: 2, name: 'EDC System', status: 'Connected', lastSync: '2025-03-18' },
    { id: 3, name: 'CTMS', status: 'Disconnected', lastSync: 'Never' }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationChange = (event) => {
    setNotificationSettings({
      ...notificationSettings,
      [event.target.name]: event.target.checked
    });
  };
  
  const handleIntegrationDialogOpen = () => {
    setIntegrationDialogOpen(true);
  };
  
  const handleIntegrationDialogClose = () => {
    setIntegrationDialogOpen(false);
    setSelectedIntegrationType('');
  };
  
  const handleIntegrationTypeChange = (event) => {
    setSelectedIntegrationType(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
          <Tab label="Integrations" icon={<IntegrationInstructionsIcon />} iconPosition="start" />
          <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
        </Tabs>
      </Paper>
      
      {/* Profile Settings */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="User Information" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      defaultValue="John"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      defaultValue="Doe"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      defaultValue="john.doe@example.com"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      defaultValue="Clinical Data Manager"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Primary Role</InputLabel>
                      <Select
                        defaultValue="DM"
                        label="Primary Role"
                      >
                        <MenuItem value="DM">Data Manager</MenuItem>
                        <MenuItem value="MM">Medical Monitor</MenuItem>
                        <MenuItem value="SR">Safety Reviewer</MenuItem>
                        <MenuItem value="SM">Study Manager</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" fullWidth>
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Preferences" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Default Dashboard View</InputLabel>
                      <Select
                        defaultValue="all"
                        label="Default Dashboard View"
                      >
                        <MenuItem value="all">All Studies</MenuItem>
                        <MenuItem value="recent">Recent Studies</MenuItem>
                        <MenuItem value="mine">My Studies</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Theme</InputLabel>
                      <Select
                        defaultValue="light"
                        label="Theme"
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="system">System Default</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader title="Export Settings" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Default Export Format</InputLabel>
                      <Select
                        defaultValue="excel"
                        label="Default Export Format"
                      >
                        <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                        <MenuItem value="csv">CSV</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Include in Exports</InputLabel>
                      <Select
                        multiple
                        defaultValue={['metadata', 'comments']}
                        label="Include in Exports"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="metadata">Metadata</MenuItem>
                        <MenuItem value="comments">Comments</MenuItem>
                        <MenuItem value="history">Version History</MenuItem>
                        <MenuItem value="roles">Role Assignments</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Notification Settings */}
      {tabValue === 1 && (
        <Card>
          <CardHeader title="Notification Preferences" />
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Email Notifications" 
                secondary="Receive notifications via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="In-App Notifications" 
                secondary="Receive notifications within the application"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  name="inAppNotifications"
                  checked={notificationSettings.inAppNotifications}
                  onChange={handleNotificationChange}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Daily Digest" 
                secondary="Receive a daily summary of all notifications"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  name="dailyDigest"
                  checked={notificationSettings.dailyDigest}
                  onChange={handleNotificationChange}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="New Comments" 
                secondary="Get notified when someone comments on your IDRP"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  name="newCommentNotification"
                  checked={notificationSettings.newCommentNotification}
                  onChange={handleNotificationChange}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Status Changes" 
                secondary="Get notified when an IDRP status changes"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  name="statusChangeNotification"
                  checked={notificationSettings.statusChangeNotification}
                  onChange={handleNotificationChange}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="New Issues" 
                secondary="Get notified when new data issues are detected"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  name="newIssueNotification"
                  checked={notificationSettings.newIssueNotification}
                  onChange={handleNotificationChange}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained">
              Save Preferences
            </Button>
          </Box>
        </Card>
      )}
      
      {/* Integration Settings */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="External Integrations" 
                action={
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<AddIcon />}
                    onClick={handleIntegrationDialogOpen}
                  >
                    Add
                  </Button>
                }
              />
              <Divider />
              <List>
                {integrations.map((integration) => (
                  <React.Fragment key={integration.id}>
                    <ListItem>
                      <ListItemIcon>
                        <CloudIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={integration.name} 
                        secondary={`Status: ${integration.status} | Last Sync: ${integration.lastSync}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="API Keys" 
                action={
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<AddIcon />}
                  >
                    Generate
                  </Button>
                }
              />
              <Divider />
              <List>
                {apiKeys.map((apiKey) => (
                  <React.Fragment key={apiKey.id}>
                    <ListItem>
                      <ListItemIcon>
                        <VpnKeyIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={apiKey.name} 
                        secondary={`Key: ${apiKey.key} | Created: ${apiKey.created} | Expires: ${apiKey.expires}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Security Settings */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Change Password" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" fullWidth>
                      Update Password
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Two-Factor Authentication" />
              <Divider />
              <CardContent>
                <Typography variant="body2" paragraph>
                  Two-factor authentication adds an extra layer of security to your account.
                  When enabled, you'll need to provide a verification code in addition to your password when signing in.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Enable Two-Factor Authentication
                </Button>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Session Management
                </Typography>
                <Typography variant="body2" paragraph>
                  You are currently logged in from 1 device.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error"
                  fullWidth
                >
                  Sign Out From All Devices
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Add Integration Dialog */}
      <Dialog open={integrationDialogOpen} onClose={handleIntegrationDialogClose}>
        <DialogTitle>Add New Integration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the type of integration you want to add.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Integration Type</InputLabel>
            <Select
              value={selectedIntegrationType}
              label="Integration Type"
              onChange={handleIntegrationTypeChange}
            >
              <MenuItem value="veeva">Veeva Vault</MenuItem>
              <MenuItem value="edc">EDC System</MenuItem>
              <MenuItem value="ctms">CTMS</MenuItem>
              <MenuItem value="ecoa">eCOA</MenuItem>
              <MenuItem value="custom">Custom API</MenuItem>
            </Select>
          </FormControl>
          {selectedIntegrationType && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Integration Name"
                  placeholder="E.g., Production Veeva Vault"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="API URL"
                  placeholder="https://api.example.com"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="API Key"
                  type="password"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIntegrationDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleIntegrationDialogClose}
            disabled={!selectedIntegrationType}
          >
            Add Integration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;
