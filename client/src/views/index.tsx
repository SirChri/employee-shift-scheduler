// in src/admin/index.tss
import React from 'react';
import { Admin, CustomRoutes, Resource, ListGuesser, Login, Authenticated } from "react-admin";
import { Route } from "react-router-dom";
import { DipendenteCreate, DipendenteEdit, DipendentiList } from "./dipendenti";
import { ClienteCreate, ClienteList, ClienteEdit } from './clienti';
import {theme} from '../theme';
import Layout  from '../Layout';
import TimelineView from './timeline';
import dataProvider from '../dataProvider';
import { authProvider } from '../authProvider';
import { UserList, UserEdit, UserCreate } from './user'
import NotFound from './notfound'

const App = () => (
  <Admin 
    catchAll={NotFound}
    dataProvider={dataProvider} 
    authProvider={authProvider}
    theme={theme} 
    layout={Layout}
    requireAuth
  >
    <Resource name="dipendente" list={DipendentiList} edit={DipendenteEdit} create={DipendenteCreate}/>
    <Resource name="cliente" list={ClienteList} edit={ClienteEdit} create={ClienteCreate}/>
    <Resource name="agenda" list={ListGuesser} />
    <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} />
      <CustomRoutes>
            <Route path="/timeline" element={<TimelineView />}/>
        </CustomRoutes>
  </Admin>
);

export default App;