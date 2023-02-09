import React from 'react';
import { List, Datagrid, TextField, NumberField, BooleanField, EditButton, DeleteButton, CloneButton } from 'react-admin';

import { ColorField } from '../components/ColorInput';

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