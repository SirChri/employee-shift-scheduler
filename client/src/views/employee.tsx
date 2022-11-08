import Grid from '@mui/material/Grid';
import React from 'react';
import { Datagrid, DeleteButton, EditButton, List, TextField, CloneButton, BooleanInput, BooleanField } from 'react-admin';
import { Create, SimpleForm, TextInput } from 'react-admin';
import { Edit } from 'react-admin';
import { ColorField, ColorInput } from '../components/ColorInput';

const validateEmployeeCreation = (values: any) => {
    const errors: any = {};
    const requiredAttrs = ["name", "surname", "number"];

    for (const att of requiredAttrs) {
        if (!values[att]) {
            errors[att] = 'This field is required';
        }
    }
    return errors
};

export const EmployeeList = () => (
    <List>
        <Datagrid rowClick="edit">
            <ColorField source="color"></ColorField>
            <TextField source="number" />
            <TextField source="name" />
            <TextField source="surname" />
            <TextField source="phone" />
            <TextField source="email" />
            <BooleanField source="active" />
            <EditButton />
            <DeleteButton />
            <CloneButton />
        </Datagrid>
    </List>
);

export const EmployeeCreate = () => (
    <Create redirect="list">
        <SimpleForm validate={validateEmployeeCreation}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextInput source="number" fullWidth label="Number" />
                </Grid>
                <Grid item xs={6}>
                    <BooleanInput source="active" fullWidth label="Is active?" defaultValue={true} />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="name" fullWidth label="Name (First Name)" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="surname" fullWidth label="Surname (Last Name)" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="phone" fullWidth label="Phone (or Mobile)" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="email" fullWidth label="Email" />
                </Grid>
            </Grid>
        </SimpleForm>
    </Create>
);

export const EmployeeEdit = () => (
    <Edit redirect="list">
        <SimpleForm validate={validateEmployeeCreation}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <TextInput disabled source="id" />
                </Grid>
                <Grid item xs={3}>
                    <TextInput source="number" fullWidth label="Number" />
                </Grid>
                <Grid item xs={3}>
                    <BooleanInput source="active" fullWidth label="Is active?" defaultValue={true} />
                </Grid>
                <Grid item xs={3}>
                    <ColorInput source="color" label="Color" fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="name" fullWidth label="Name (First Name)" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="surname" fullWidth label="Surname (Last Name)" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="phone" fullWidth label="Phone (or Mobile)" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="email" fullWidth label="Email" />
                </Grid>
            </Grid>
        </SimpleForm>
    </Edit>
);