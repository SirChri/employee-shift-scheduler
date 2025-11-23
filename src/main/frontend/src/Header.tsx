import React from 'react';
import { Tabs, Tab, Toolbar, AppBar, Box, Typography, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { UserMenu, Logout, LoadingIndicator, useTranslate, usePermissions, LogoutClasses } from 'react-admin';
import EventIcon from '@mui/icons-material/Event';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DescriptionIcon from '@mui/icons-material/Description';
import ApartmentIcon from '@mui/icons-material/Apartment';
import GroupsIcon from '@mui/icons-material/Groups';

import { LocalesMenuButton } from 'react-admin';

const Header = () => {
    const location = useLocation();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const navigate = useNavigate();

    let currentPath = '/';
    if (!!matchPath('/customer/*', location.pathname)) {
        currentPath = '/customer';
    } else if (!!matchPath('/employee/*', location.pathname)) {
        currentPath = '/employee';
    //} else if (!!matchPath('/timeline/*', location.pathname)) {
    //    currentPath = '/timeline';
    } else if (!!matchPath('/calendar/*', location.pathname)) {
        currentPath = '/calendar';
    } else if (!!matchPath('/user/*', location.pathname)) {
        currentPath = '/user';
    } else if (!!matchPath('/summary/*', location.pathname)) {
        currentPath = '/summary';
    }

    return (
        <AppBar position="static" color="primary">
            <Toolbar variant="dense">
                <Box flex={1} display="flex" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <img alt="Shift Scheduler Logo" src='./logo.png' height="32" style={{padding: "5px", paddingRight: "10px"}} />
                        <Typography component="span" variant="h5">
                            Shift Scheduler
                        </Typography>
                    </Box>
                    <Box>
                        <Tabs
                            value={currentPath}
                            aria-label="Navigation Tabs"
                            indicatorColor="secondary"
                            textColor="inherit"
                            style={{height: "48px"}}
                        >
                        {/*<Tab
                            label={'Timeline'}
                            component={Link}
                            to="/timeline"
                            value="/timeline"
                        />*/}
                        <Tab
                            label={translate(`ess.calendar.name`)}
                            icon={<EventIcon />} iconPosition="start"
                            component={Link}
                            to="/calendar"
                            sx={{ minHeight: '48px', height: '48px' }}
                            value="/calendar"
                        />
                        <Tab
                            label={translate(`ess.summary.name`)}
                            icon={<DescriptionIcon />} iconPosition="start"
                            component={Link}
                            sx={{ minHeight: '48px', height: '48px' }}
                            to="/summary"
                            value="/summary"
                        />
                        <Tab
                            
                            label={translate(`resources.customer.name`, {
                                smart_count: 2,
                            })}
                            icon={<ApartmentIcon />} iconPosition="start"
                            component={Link}
                            sx={{ minHeight: '48px', height: '48px' }}
                            to="/customer"
                            value="/customer"
                        />
                        <Tab
                            label={translate(`resources.employee.name`, {
                                smart_count: 2,
                            })}
                            icon={<GroupsIcon />} iconPosition="start"
                            component={Link}
                            sx={{ minHeight: '48px', height: '48px' }}
                            to="/employee"
                            value="/employee"
                        />
                        </Tabs>
                    </Box>
                    <Box display="flex" sx={{
                        marginTop: "4px"
                    }}>
                        <LocalesMenuButton
                            languages={[
                                { locale: 'en', name: 'English' },
                                { locale: 'it', name: 'Italiano' },
                            ]}
                        />
                        <LoadingIndicator
                            sx={{
                                '& .RaLoadingIndicator-loader': {
                                    marginTop: 2,
                                },
                            }}
                        />
                        <UserMenu>
                            <Logout />
                            { permissions?.includes("ROLE_ADMIN") && <MenuItem
                                onClick={() => {
                                    navigate('/user')
                                }}  
                                component={'li'}
                            >
                                <ListItemIcon>
                                    {<GroupAddIcon fontSize="small" />}
                                </ListItemIcon>
                                <ListItemText>
                                    {'Manage Users'}
                                </ListItemText>
                            </MenuItem> }
                            <MenuItem
                                onClick={() => {
                                    navigate('/user/preferences')
                                }}  
                                component={'li'}
                            >
                                <ListItemIcon>
                                    {<ManageAccountsIcon fontSize="small" />}
                                </ListItemIcon>
                                <ListItemText>
                                    {translate("ess.users.preferences.title")}
                                </ListItemText>
                            </MenuItem>
                        </UserMenu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;