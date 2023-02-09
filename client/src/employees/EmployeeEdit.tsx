import React from 'react';
import Grid from '@mui/material/Grid';
import { BooleanInput, SimpleForm, TextInput, required, Edit, useTranslate } from 'react-admin';

import {  ColorInput } from '../components/ColorInput';

export const EmployeeEdit = () => {
    const translate = useTranslate();

    return (<Edit redirect="list">
        <SimpleForm>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <TextInput disabled source="id" />
                </Grid>
                <Grid item xs={3}>
                    <TextInput source="number" fullWidth label={translate(`resources.employee.fields.number`)} validate={required()}/>
                </Grid>
                <Grid item xs={3}>
                    <BooleanInput source="active" fullWidth label={translate(`resources.employee.fields.active`)} defaultValue={true} />
                </Grid>
                <Grid item xs={3}>
                    <ColorInput source="color" label={translate(`resources.employee.fields.color`)} fullWidth validate={required()} />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="name" fullWidth label={translate(`resources.employee.fields.name`)} validate={required()} />
                </Grid>
                <Grid item xs={6}>
                    <TextInput source="surname" fullWidth label={translate(`resources.employee.fields.surname`)} validate={required()} />
                </Grid>
                <Grid item xs={4}>
                    <TextInput source="phone" fullWidth label={translate(`resources.employee.fields.phone`)} />
                </Grid>
                <Grid item xs={4}>
                    <TextInput source="email" fullWidth label={translate(`resources.employee.fields.email`)} />
                </Grid>
            </Grid>
        </SimpleForm>
    </Edit>)
}