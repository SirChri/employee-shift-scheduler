import React from 'react';
import { Create, Datagrid, Edit, EditButton, List, required, SimpleForm, TextField, TextInput, DeleteButton, PasswordInput, CloneButton } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="email" />
            <EditButton />
            <DeleteButton />
            <CloneButton />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit redirect="list">
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <TextInput source="email" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextInput source="name" validate={[required()]}  label="Nome" />
            <TextInput source="email" validate={[required()]}  label="Email" />
            <PasswordInput source="password" label="Password" />
        </SimpleForm>
    </Create>
);