import React from 'react';
import { Create, Datagrid, Edit, EditButton, List, required, SimpleForm, TextField, TextInput, DeleteButton, CloneButton } from 'react-admin';

export const ClienteList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="descrizione" />
            <TextField source="indirizzo" />
            <EditButton />
            <DeleteButton />
            <CloneButton />
        </Datagrid>
    </List>
);

export const ClienteEdit = () => (
    <Edit redirect="list">
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="descrizione" />
            <TextInput source="indirizzo" />
        </SimpleForm>
    </Edit>
);

export const ClienteCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextInput source="descrizione" validate={[required()]} fullWidth label="Descrizione" />
            <TextInput source="indirizzo" validate={[required()]}  label="Indirizzo" />
        </SimpleForm>
    </Create>
);