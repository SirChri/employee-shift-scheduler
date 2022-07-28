// in src/admin/index.tsx
import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from "react-router-dom";
import simpleRest from "ra-data-simple-rest";
import { DipendenteCreate, DipendenteEdit, DipendentiList } from "./dipendenti";
import { ClienteCreate, ClienteList, ClienteEdit } from './clienti';
import {theme} from '../theme';
import Layout  from '../Layout';
import { Timeline } from '../components/Timeline';

const dataProvider = simpleRest("http://localhost:8080/api");

const App = () => (
  <Admin 
    dataProvider={dataProvider} 
    theme={theme} 
    layout={Layout}
  >
    <Resource name="dipendente" list={DipendentiList} edit={DipendenteEdit} create={DipendenteCreate}  />
    <Resource name="cliente" list={ClienteList} edit={ClienteEdit} create={ClienteCreate} />
    <CustomRoutes>
            <Route path="/timeline" element={<Timeline />}/>
        </CustomRoutes>
  </Admin>
);

export default App;