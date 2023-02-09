import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, CloneButton } from 'react-admin';


export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="email" />
            <EditButton />
            <CloneButton />
        </Datagrid>
    </List>
);