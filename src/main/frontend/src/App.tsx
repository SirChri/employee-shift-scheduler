import React from 'react';
import { Admin, CustomRoutes, Resource, ListGuesser, Login, Authenticated } from "react-admin";

import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from './i18n/en';
import italianMessages from './i18n/it';

import { Route } from "react-router-dom";
import {theme} from './theme';
import Layout  from './Layout';
import TimelineView from './views/timeline';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import NotFound from './views/notfound'
import { QueryClient } from 'react-query';

import EmployeeSummaryList from './views/eventsummary';
import CalendarView from './views/calendar';

import employees from './employees';
import customers from './customers';
import users from './users';

const i18nProvider = polyglotI18nProvider(locale => {
    if (locale === 'it') {
        return italianMessages;
    }

    // Always fallback on english
    return englishMessages;
}, 'en');

const App = () => (
  <Admin 
    dataProvider={dataProvider} 
    authProvider={authProvider}
    theme={theme} 
    layout={Layout}
    i18nProvider={i18nProvider}
  >
    <Resource name="employee" {...employees} />
    <Resource name="customer" {...customers}/>
    <Resource name="users" {...users} />
      <CustomRoutes>
            {<Route path="/timeline" element={<TimelineView />}/>}
            <Route path="/calendar" element={<CalendarView />}/>
            <Route path="/summary" element={<EmployeeSummaryList />}/>
        </CustomRoutes>
        
  </Admin>
);

export default App;
