import React from 'react';
import { List, Datagrid, TextField, NumberField, BooleanField, EditButton, DeleteButton, CloneButton } from 'react-admin';

import { ColorField } from '../components/ColorInput';

export const EmployeeList = () => (
    <List>
        <Datagrid rowClick="edit">
            <ColorField source="color" />
            <TextField source="number" />
            <TextField source="name" />
            <TextField source="surname" />
            <TextField source="phone" />
            <TextField source="email" />
            <NumberField source="weekHrs" />
            <BooleanField source="active" />
            <EditButton />
            <DeleteButton />
            <CloneButton />
        </Datagrid>
    </List>
);