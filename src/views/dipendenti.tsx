import { Datagrid, DeleteButton, EditButton, List, TextField } from 'react-admin';
import { Create, SimpleForm, TextInput, required } from 'react-admin';
import { Edit } from 'react-admin';

export const DipendentiList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="nome" />
            <TextField source="cognome" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const DipendenteCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextInput source="nome" validate={[required()]} fullWidth label="Nome" />
            <TextInput source="cognome" validate={[required()]}  label="Cognome" />
        </SimpleForm>
    </Create>
);

export const DipendenteEdit = () => (
    <Edit redirect="list">
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="nome" />
            <TextInput source="cognome" />
        </SimpleForm>
    </Edit>
);