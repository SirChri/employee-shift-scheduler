import React from 'react';
import { Tabs, Tab, Toolbar, AppBar, Box, Typography } from '@mui/material';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { UserMenu, Logout, LoadingIndicator } from 'react-admin';
import BadgeIcon from '@mui/icons-material/Badge';

const Header = () => {
    const location = useLocation();

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
    } else if (!!matchPath('/event/*', location.pathname)) {
        currentPath = '/event';
    }

    return (
        <AppBar position="static" color="primary">
            <Toolbar variant="dense">
                <Box flex={1} display="flex" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <BadgeIcon
                            sx={{ marginRight: '1em', height: 30 }}
                        />
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
                        >
                        {/*<Tab
                            label={'Timeline'}
                            component={Link}
                            to="/timeline"
                            value="/timeline"
                        />*/}
                        <Tab
                            label={'Calendar'}
                            component={Link}
                            to="/calendar"
                            value="/calendar"
                        />
                            <Tab
                                label={'Customers'}
                                component={Link}
                                to="/customer"
                                value="/customer"
                            />
                            <Tab
                                label={'Employees'}
                                component={Link}
                                to="/employee"
                                value="/employee"
                            />
                            <Tab
                                label={'Summary'}
                                component={Link}
                                to="/event"
                                value="/event"
                            />
                        </Tabs>
                    </Box>
                    <Box display="flex">
                        <LoadingIndicator
                            sx={{
                                '& .RaLoadingIndicator-loader': {
                                    marginTop: 2,
                                },
                            }}
                        />
                        <UserMenu>
                            <Logout />
                            <Tab
                                label={'Users'}
                                component={Link}
                                to="/user"
                                value="/user"
                            />
                        </UserMenu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;