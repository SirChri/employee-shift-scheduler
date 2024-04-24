import React from 'react';
import Grid from '@mui/material/Grid';
import { Edit, SimpleForm, TextInput, required, useTranslate } from 'react-admin';

export const CustomerEdit = () => {
    const translate = useTranslate();

    return (<Edit redirect="list">
        <SimpleForm>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextInput disabled source="id" />
                </Grid>
                <Grid item xs={4}>
                    <TextInput source="vat" fullWidth label={translate(`resources.customer.fields.vat`)} validate={required()} />
                </Grid>
                <Grid item xs={4}>
                    <TextInput source="name" fullWidth label={translate(`resources.customer.fields.name`)} validate={required()} />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="email" fullWidth label={translate(`resources.customer.fields.email`)} />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="phone" fullWidth label={translate(`resources.customer.fields.phone`)} />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="zipcode" fullWidth label={translate(`resources.customer.fields.zipcode`)} />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="city" fullWidth label={translate(`resources.customer.fields.city`)} />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="website" fullWidth label={translate(`resources.customer.fields.website`)} />
                </Grid>
            </Grid>
        </SimpleForm>
    </Edit>)
}