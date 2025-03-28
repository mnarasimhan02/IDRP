import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HelpIcon from '@mui/icons-material/Help';

const expandedWidth = 240;
const collapsedWidth = 72;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'View IDRPs', icon: <AssignmentIcon />, path: '/idrps' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
];

function Sidebar() {
  const location = useLocation();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: expanded ? expandedWidth : collapsedWidth,
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        [`& .MuiDrawer-paper`]: { 
          width: expanded ? expandedWidth : collapsedWidth, 
          boxSizing: 'border-box',
          mt: 8, // To account for the AppBar height
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden'
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={toggleSidebar}>
          {expanded ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              {expanded ? (
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.light + '20',
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light + '30',
                      }
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                      opacity: expanded ? 1 : 0,
                      transition: theme.transitions.create('opacity', {
                        duration: theme.transitions.duration.shorter,
                      })
                    }}
                  />
                </ListItemButton>
              ) : (
                <Tooltip title={item.text} placement="right">
                  <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.light + '20',
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.light + '30',
                        }
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                      minWidth: 0,
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              )}
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            {expanded ? (
              <ListItemButton 
                component={RouterLink} 
                to="/documentation"
                selected={location.pathname === '/documentation'}
                sx={{
                  minHeight: 48,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light + '20',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light + '30',
                    }
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === '/documentation' ? theme.palette.primary.main : 'inherit',
                  minWidth: 40
                }}>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Documentation" 
                  sx={{ 
                    color: location.pathname === '/documentation' ? theme.palette.primary.main : 'inherit',
                    opacity: expanded ? 1 : 0,
                    transition: theme.transitions.create('opacity', {
                      duration: theme.transitions.duration.shorter,
                    })
                  }}
                />
              </ListItemButton>
            ) : (
              <Tooltip title="Documentation" placement="right">
                <ListItemButton 
                  component={RouterLink} 
                  to="/documentation"
                  selected={location.pathname === '/documentation'}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.light + '20',
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light + '30',
                      }
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: location.pathname === '/documentation' ? theme.palette.primary.main : 'inherit',
                    minWidth: 0,
                    justifyContent: 'center'
                  }}>
                    <HelpIcon />
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
