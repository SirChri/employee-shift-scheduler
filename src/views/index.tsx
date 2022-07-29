// in src/admin/index.tss
import React from 'react';
import { Admin, CustomRoutes, Resource, ListGuesser } from "react-admin";
import { Route } from "react-router-dom";
import simpleRest from "ra-data-simple-rest";
import { DipendenteCreate, DipendenteEdit, DipendentiList } from "./dipendenti";
import { ClienteCreate, ClienteList, ClienteEdit } from './clienti';
import {theme} from '../theme';
import Layout  from '../Layout';
import TimelineView from './timeline';

const dataProvider = simpleRest("http://localhost:5555/api");

const App = () => (
  <Admin 
    dataProvider={dataProvider} 
    theme={theme} 
    layout={Layout}
  >
    <Resource name="dipendente" list={DipendentiList} edit={DipendenteEdit} create={DipendenteCreate}  />
    <Resource name="cliente" list={ClienteList} edit={ClienteEdit} create={ClienteCreate} />
    <Resource name="agenda" list={ListGuesser} />
      <CustomRoutes>
            <Route path="/timeline" element={<TimelineView />}/>
        </CustomRoutes>
  </Admin>
);

export default App;