// in src/admin/index.tss
import React from 'react';
import { Admin, CustomRoutes, Resource, ListGuesser, Login, Authenticated } from "react-admin";
import { Route } from "react-router-dom";
import { EmployeeCreate, EmployeeEdit, EmployeeList } from "./employee";
import { CustomerCreate, CustomerList, CustomerEdit } from './customer';
import {theme} from '../theme';
import Layout  from '../Layout';
import TimelineView from './timeline';
import { dataProvider } from '../dataProvider';
import { authProvider } from '../authProvider';
import { UserList, UserEdit, UserCreate } from './user'
import NotFound from './notfound'
import { QueryClient } from 'react-query';
import  EmployeeSummaryList from './empsummary';

const App = () => (
  <Admin 
    catchAll={NotFound}
    dataProvider={dataProvider} 
    authProvider={authProvider}
    theme={theme} 
    layout={Layout}
    requireAuth
  >
    <Resource name="employee" list={EmployeeList} edit={EmployeeEdit} create={EmployeeCreate}/>
    <Resource name="customer" list={CustomerList} edit={CustomerEdit} create={CustomerCreate}/>
    <Resource name="agenda" list={EmployeeSummaryList} />
    <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} />
      <CustomRoutes>
            <Route path="/timeline" element={<TimelineView />}/>
        </CustomRoutes>
        
  </Admin>
);

export default App;