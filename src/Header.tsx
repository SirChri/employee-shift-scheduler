import React from 'react';
import { Tabs, Tab, Toolbar, AppBar, Box, Typography } from '@mui/material';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { UserMenu, Logout, LoadingIndicator } from 'react-admin';
import BadgeIcon from '@mui/icons-material/Badge';

const Header = () => {
    const location = useLocation();

    let currentPath = '/';
    if (!!matchPath('/cliente/*', location.pathname)) {
        currentPath = '/cliente';
    } else if (!!matchPath('/dipendente/*', location.pathname)) {
        currentPath = '/dipendente';
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
                            Employee Shift Scheduler
                        </Typography>
                    </Box>
                    <Box>
                        <Tabs
                            value={currentPath}
                            aria-label="Navigation Tabs"
                            indicatorColor="secondary"
                            textColor="inherit"
                        >
                            <Tab
                                label={'Timeline'}
                                component={Link}
                                to="/timeline"
                                value="/"
                            />
                            <Tab
                                label={'Clienti'}
                                component={Link}
                                to="/cliente"
                                value="/cliente"
                            />
                            <Tab
                                label={'Dipendenti'}
                                component={Link}
                                to="/dipendente"
                                value="/dipendente"
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
                        </UserMenu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;