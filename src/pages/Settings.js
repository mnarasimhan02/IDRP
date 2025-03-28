import React, { useState, useRef } from 'react';
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
  useTheme,
  Alert,
  AlertTitle,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress
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
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { readExcelFile, mapExcelDataToChecks } from '../utils/excelUtils';

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
  
  // Library management states
  const fileInputRef = useRef(null);
  const [globalLibraryChecks, setGlobalLibraryChecks] = useState(() => {
    try {
      const savedChecks = localStorage.getItem('globalLibraryChecks');
      return savedChecks ? JSON.parse(savedChecks) : [];
    } catch (error) {
      console.error('Error loading global library checks:', error);
      return [];
    }
  });
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditCheck, setCurrentEditCheck] = useState(null);
  
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
  
  // Library management functions
  const handleImportButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleExcelImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      setImportSuccess(false);
      setImportError('');
      
      const jsonData = await readExcelFile(file);
      const formattedChecks = mapExcelDataToChecks(jsonData);
      
      // Add source and confidence properties to each check
      const checksWithMetadata = formattedChecks.map(check => ({
        ...check,
        source: 'Global Library',
        confidence: 90 // High confidence for global library checks
      }));
      
      // Save to state and localStorage
      setGlobalLibraryChecks(checksWithMetadata);
      localStorage.setItem('globalLibraryChecks', JSON.stringify(checksWithMetadata));
      
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (error) {
      console.error('Error importing Excel file:', error);
      setImportError(`Error importing Excel file: ${error.message}`);
      setTimeout(() => setImportError(''), 5000); // Hide error message after 5 seconds
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleDeleteCheck = (checkId) => {
    const updatedChecks = globalLibraryChecks.filter(check => check.id !== checkId);
    setGlobalLibraryChecks(updatedChecks);
    localStorage.setItem('globalLibraryChecks', JSON.stringify(updatedChecks));
  };
  
  const handleClearAllChecks = () => {
    if (window.confirm('Are you sure you want to clear all global library checks? This action cannot be undone.')) {
      setGlobalLibraryChecks([]);
      localStorage.setItem('globalLibraryChecks', JSON.stringify([]));
    }
  };
  
  // Edit check functions
  const handleEditCheck = (check) => {
    setCurrentEditCheck({...check});
    setEditDialogOpen(true);
  };
  
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentEditCheck(null);
  };
  
  const handleEditCheckChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditCheck({
      ...currentEditCheck,
      [name]: value
    });
  };
  
  const handleEditRolesChange = (e) => {
    const roles = e.target.value;
    setCurrentEditCheck({
      ...currentEditCheck,
      rolesInvolved: roles
    });
  };
  
  const handleSaveEditedCheck = () => {
    const updatedChecks = globalLibraryChecks.map(check => 
      check.id === currentEditCheck.id ? currentEditCheck : check
    );
    
    setGlobalLibraryChecks(updatedChecks);
    localStorage.setItem('globalLibraryChecks', JSON.stringify(updatedChecks));
    setEditDialogOpen(false);
    setCurrentEditCheck(null);
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
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
          <Tab label="Integrations" icon={<IntegrationInstructionsIcon />} iconPosition="start" />
          <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Library Management" icon={<LibraryBooksIcon />} iconPosition="start" />
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
      
      {/* Library Management Settings */}
      {tabValue === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader 
                title="Global Library of Checks" 
                subheader="Import and manage your global library of checks for IDRP creation"
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<UploadFileIcon />}
                      onClick={handleImportButtonClick}
                      disabled={isImporting}
                    >
                      {isImporting ? 'Importing...' : 'Import from Excel'}
                    </Button>
                    {globalLibraryChecks.length > 0 && (
                      <Button 
                        variant="outlined" 
                        color="error"
                        onClick={handleClearAllChecks}
                      >
                        Clear All
                      </Button>
                    )}
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
              
              {isImporting && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              )}
              
              {importSuccess && (
                <Alert severity="success" sx={{ mx: 2, mt: 2 }}>
                  <AlertTitle>Success</AlertTitle>
                  Successfully imported {globalLibraryChecks.length} checks to the global library.
                </Alert>
              )}
              
              {importError && (
                <Alert severity="error" sx={{ mx: 2, mt: 2 }}>
                  <AlertTitle>Error</AlertTitle>
                  {importError}
                </Alert>
              )}
              
              {globalLibraryChecks.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No checks in the global library. Import an Excel file to add checks.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    The Excel file should contain columns for CheckID, CheckType, CheckCategory, DataCategory, Visit, Description, QueryText, RolesInvolved, and Frequency.
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Check Type</TableCell>
                          <TableCell>Check Category</TableCell>
                          <TableCell>Data Category</TableCell>
                          <TableCell>Visit</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Query Text</TableCell>
                          <TableCell>Roles</TableCell>
                          <TableCell>Frequency</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {globalLibraryChecks
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((check) => (
                            <TableRow key={check.id} hover>
                              <TableCell>{check.id || ''}</TableCell>
                              <TableCell>{check.checkType || ''}</TableCell>
                              <TableCell>{check.checkCategory || ''}</TableCell>
                              <TableCell>{check.dataCategory || ''}</TableCell>
                              <TableCell>{check.visit || ''}</TableCell>
                              <TableCell>{check.description || ''}</TableCell>
                              <TableCell>{check.queryText || ''}</TableCell>
                              <TableCell>
                                {Array.isArray(check.rolesInvolved) && check.rolesInvolved.length > 0
                                  ? check.rolesInvolved.filter(Boolean).join(', ') 
                                  : check.rolesInvolved || ''}
                              </TableCell>
                              <TableCell>{check.frequency || ''}</TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handleEditCheck(check)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteCheck(check.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={globalLibraryChecks.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[25, 50, 100]}
                  />
                </>
              )}
              
              <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  About Global Library of Checks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The global library of checks will be available during IDRP creation as recommendations.
                  These checks will appear in the "Standard Library Recommendations" section with high confidence scores.
                </Typography>
              </Box>
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
      
      {/* Edit Check Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Check</DialogTitle>
        <DialogContent>
          {currentEditCheck && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Check ID"
                  name="id"
                  value={currentEditCheck.id}
                  onChange={handleEditCheckChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Check Type</InputLabel>
                  <Select
                    name="checkType"
                    value={currentEditCheck.checkType}
                    onChange={handleEditCheckChange}
                    label="Check Type"
                  >
                    <MenuItem value="DQ">DQ</MenuItem>
                    <MenuItem value="IRL">IRL</MenuItem>
                    <MenuItem value="Dashboard">Dashboard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Check Category"
                  name="checkCategory"
                  value={currentEditCheck.checkCategory}
                  onChange={handleEditCheckChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data Category"
                  name="dataCategory"
                  value={currentEditCheck.dataCategory}
                  onChange={handleEditCheckChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Visit"
                  name="visit"
                  value={currentEditCheck.visit}
                  onChange={handleEditCheckChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    name="frequency"
                    value={currentEditCheck.frequency}
                    onChange={handleEditCheckChange}
                    label="Frequency"
                  >
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Quarterly">Quarterly</MenuItem>
                    <MenuItem value="Ad hoc">Ad hoc</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={currentEditCheck.description}
                  onChange={handleEditCheckChange}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Query Text"
                  name="queryText"
                  value={currentEditCheck.queryText}
                  onChange={handleEditCheckChange}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Roles Involved</InputLabel>
                  <Select
                    multiple
                    name="rolesInvolved"
                    value={Array.isArray(currentEditCheck.rolesInvolved) ? currentEditCheck.rolesInvolved : []}
                    onChange={handleEditRolesChange}
                    label="Roles Involved"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="Data Manager">Data Manager</MenuItem>
                    <MenuItem value="Medical Monitor">Medical Monitor</MenuItem>
                    <MenuItem value="Safety Reviewer">Safety Reviewer</MenuItem>
                    <MenuItem value="Study Manager">Study Manager</MenuItem>
                    <MenuItem value="Statistician">Statistician</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleSaveEditedCheck} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;
