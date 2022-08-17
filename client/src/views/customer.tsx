import Grid from '@mui/material/Grid';
import React from 'react';
import { Create, Datagrid, Edit, EditButton, List, required, SimpleForm, TextField, TextInput, DeleteButton, CloneButton } from 'react-admin';

const validateCustomerCreation = (values: any) => {
    const errors: any = {};
    const requiredAttrs = ["name", "vat"];

    for (const att of requiredAttrs) {
        if (!values[att]) {
            errors[att] = 'This field is required';
        }
    }
    return errors
};

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

export const CustomerEdit = () => (
    <Edit redirect="list">
        <SimpleForm validate={validateCustomerCreation}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextInput disabled source="id" />
                </Grid>
                <Grid item xs={4}>
                    <TextInput source="vat" fullWidth label="VAT" />
                </Grid>
                <Grid item xs={4}>
                    <TextInput source="name" fullWidth label="Name" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="email" fullWidth label="Email" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="phone" fullWidth label="Phone (or Mobile)" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="zipcode" fullWidth label="ZIP Code" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="city" fullWidth label="City" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="website" fullWidth label="Website" />
                </Grid>
            </Grid>
        </SimpleForm>
    </Edit>
);

export const CustomerCreate = () => (
    <Create redirect="list">
        <SimpleForm validate={validateCustomerCreation}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextInput source="vat" fullWidth label="VAT" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="name" fullWidth label="Name" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="email" fullWidth label="Email" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="phone" fullWidth label="Phone (or Mobile)" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="zipcode" fullWidth label="ZIP Code" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="city" fullWidth label="City" />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="website" fullWidth label="Website" />
                </Grid>
            </Grid>
        </SimpleForm>
    </Create>
);