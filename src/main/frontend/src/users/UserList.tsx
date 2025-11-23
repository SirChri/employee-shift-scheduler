import { CloneButton, Datagrid, EditButton, List, TextField } from 'react-admin';
import { PasswordUpdateBtn } from '../components/PasswordUpdateBtn';


export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="username" />
            <TextField source="email" />
            <EditButton />
            <CloneButton />
            <PasswordUpdateBtn />
        </Datagrid>
    </List>
);