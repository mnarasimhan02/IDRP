import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

function Documentation() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        IDRP Documentation
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          Welcome to the Intelligent Data Review Plan (IDRP) documentation. This guide will help you understand how to use the IDRP system effectively.
        </Typography>
      </Paper>

      {/* Creating an IDRP Section */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="creating-idrp-content"
          id="creating-idrp-header"
          sx={{ cursor: 'pointer' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
            Creating an Intelligent Data Review Plan
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            An Intelligent Data Review Plan (IDRP) is a comprehensive document that outlines the approach for reviewing clinical trial data. It includes various checks and validations to ensure data quality and integrity.
          </Typography>
          
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
            Column Structure for IDRP Checks
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell><strong>Column</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Auto-populated?</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Check ID</TableCell>
                  <TableCell>Unique identifier for the check (e.g., IDRP-001)</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Check Type</TableCell>
                  <TableCell>Type of check (DQ, IRL, Dashboard)</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Check Category</TableCell>
                  <TableCell>Category of the check (Safety, Efficacy, etc.)</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Data Category</TableCell>
                  <TableCell>Category of data being checked</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Visit</TableCell>
                  <TableCell>Visit where the check applies</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Detailed description of the check</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Query Text</TableCell>
                  <TableCell>Text of the query to be raised</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Roles Involved</TableCell>
                  <TableCell>Roles responsible for the check</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Frequency</TableCell>
                  <TableCell>How often the check should be performed</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell>Origin of the check (Library, Similar Study, Custom)</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
            Steps to Create a New IDRP:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 1: Navigate to the Dashboard and click 'Create New IDRP'" 
                secondary="This will open the IDRP creation wizard"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 2: Enter Study Information" 
                secondary="Fill in the study details, including Study ID, Therapeutic Area, Indication, and Phase"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 3: Review iDRP Assist" 
                secondary="The system will suggest checks based on the study information. You can accept, modify, or reject these recommendations"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 4: Add Custom Checks" 
                secondary="Add any additional checks specific to your study needs"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 5: Submit for Review" 
                secondary="Once all checks are added, submit the IDRP for review by clicking the 'Submit for Review' button"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* iDRP Assist Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="recommendations-content"
          id="recommendations-header"
          sx={{ cursor: 'pointer' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
            Working with iDRP Assist
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            The IDRP system uses iDRP Assist to recommend data quality checks based on your study attributes and historical data from similar studies.
          </Typography>
          
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
            Types of iDRP Assist Recommendations:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Standard Library Recommendations" 
                secondary="Checks recommended from the standard library based on study attributes"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Similar Study Recommendations" 
                secondary="Checks recommended based on historical data from similar studies"
              />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
            How to Use iDRP Assist Recommendations:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Review Each Recommendation" 
                secondary="Carefully review each recommended check for relevance to your study"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Accept Relevant Checks" 
                secondary="Click the 'Accept' button to add a recommended check to your IDRP"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Modify if Needed" 
                secondary="You can modify any recommended check before accepting it by clicking the 'Edit' button"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Reject Irrelevant Checks" 
                secondary="Click the 'Reject' button to dismiss a recommendation that is not relevant to your study"
              />
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            The iDRP Assist system learns from your choices and will improve its recommendations over time based on your feedback.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Workflow Status Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="workflow-content"
          id="workflow-header"
          sx={{ cursor: 'pointer' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
            IDRP Workflow Status
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            The IDRP system uses a 4-status workflow to manage the lifecycle of an IDRP from creation to approval.
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Allowed Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell><strong>Draft</strong></TableCell>
                  <TableCell>Initial state of a newly created IDRP</TableCell>
                  <TableCell>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Add new checks" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Modify existing checks" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Delete checks" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Submit for review" />
                      </ListItem>
                    </List>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>In-Review</strong></TableCell>
                  <TableCell>IDRP is under review by stakeholders</TableCell>
                  <TableCell>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Add comments" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Mark as reviewed" />
                      </ListItem>
                    </List>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Reviewed</strong></TableCell>
                  <TableCell>IDRP has been reviewed and can be updated based on feedback</TableCell>
                  <TableCell>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Add new checks" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Modify existing checks" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Submit for approval" />
                      </ListItem>
                    </List>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Approved</strong></TableCell>
                  <TableCell>IDRP has been approved and is ready for execution</TableCell>
                  <TableCell>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="View checks" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Inactivate checks" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ArrowRightIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Create new version" />
                      </ListItem>
                    </List>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
            Status Transition Rules:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Draft → In-Review" 
                secondary="When the IDRP owner submits the IDRP for review"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="In-Review → Reviewed" 
                secondary="When all reviewers have completed their review"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Reviewed → Approved" 
                secondary="When the IDRP owner submits the IDRP for approval and it is approved by the approver"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Approved → Draft (New Version)" 
                secondary="When a new version is created from an approved IDRP"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Versioning Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="versioning-content"
          id="versioning-header"
          sx={{ cursor: 'pointer' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
            IDRP Versioning
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            The IDRP system uses versioning to track changes to IDRPs over time. This ensures that all stakeholders are working with the correct version of the IDRP.
          </Typography>
          
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
            Versioning Rules:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Only approved IDRPs can be versioned" 
                secondary="You cannot create a new version of a Draft, In-Review, or Reviewed IDRP"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Only major versions are used" 
                secondary="Versions are numbered as 1.0, 2.0, 3.0, etc."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="The first approved version is 1.0" 
                secondary="When an IDRP is first approved, it is assigned version 1.0"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="New versions start in Draft status" 
                secondary="When a new version is created, it starts in Draft status and must go through the workflow again"
              />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
            Creating a New Version:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 1: Open an approved IDRP" 
                secondary="Navigate to the IDRP detail page of an approved IDRP"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 2: Click 'Create New Version'" 
                secondary="This button is available in the top action bar for approved IDRPs"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 3: Confirm the action" 
                secondary="A confirmation dialog will appear. Click 'Confirm' to create the new version"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Step 4: Edit the new version" 
                secondary="The new version will be in Draft status and can be edited as needed"
              />
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            All versions of an IDRP are preserved in the system and can be viewed in the IDRP history tab. This provides a complete audit trail of changes to the IDRP over time.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Documentation;
