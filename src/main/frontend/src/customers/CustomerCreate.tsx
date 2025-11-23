import React from 'react';
import Grid from '@mui/material/Grid';
import { Create, SimpleForm, TextInput, required, useTranslate } from 'react-admin';


export const CustomerCreate = () => {
    const translate = useTranslate();

    return (<Create redirect="list">
        <SimpleForm>
            <Grid container spacing={2}>
                <Grid size={6}>
                    <TextInput source="vat" fullWidth label={translate(`resources.customer.fields.vat`)} validate={required()} />
                </Grid>
                <Grid size={6}>
                    <TextInput source="name" fullWidth label={translate(`resources.customer.fields.name`)} validate={required()} />
                </Grid>
                <Grid size={6}>
                    <TextInput source="email" fullWidth label={translate(`resources.customer.fields.email`)} />
                </Grid>
                <Grid size={6}>
                    <TextInput source="phone" fullWidth label={translate(`resources.customer.fields.phone`)} />
                </Grid>
                <Grid size={6}>
                    <TextInput source="zipcode" fullWidth label={translate(`resources.customer.fields.zipcode`)} />
                </Grid>
                <Grid size={6}>
                    <TextInput source="city" fullWidth label={translate(`resources.customer.fields.city`)} />
                </Grid>
                <Grid size={6}>
                    <TextInput source="website" fullWidth label={translate(`resources.customer.fields.website`)} />
                </Grid>
            </Grid>
        </SimpleForm>
    </Create>)
}