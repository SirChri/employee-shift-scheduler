import React, { HtmlHTMLAttributes } from 'react';
import { CssBaseline } from '@mui/material';
import { CoreLayoutProps } from 'react-admin';
import { ErrorBoundary } from 'react-error-boundary';

import { Error } from 'react-admin';
import Header from './Header';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexFlow: "column",
        height: "100vh"
    }
}));

const Layout = (props: LayoutProps) => {
    const classes = useStyles();
    const { children } = props;
    return (
        <div className={classes.root}>
            <CssBaseline />
            <Header />
            {/* @ts-ignore */}
            <ErrorBoundary FallbackComponent={Error}>
                {children}
            </ErrorBoundary>
        </div>
    );
};

export interface LayoutProps
    extends CoreLayoutProps,
        Omit<HtmlHTMLAttributes<HTMLDivElement>, 'title'> {}

export default Layout;