import React from 'react';
import { CloneButton, Datagrid, DeleteButton, EditButton, List, TextField } from 'react-admin';

export const CustomerList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="vat" />
            <TextField source="name" />
            <TextField source="phone" />
            <TextField source="city" />
            <TextField source="website" />
            <EditButton />
            <DeleteButton />
            <CloneButton />
        </Datagrid>
    </List>
);