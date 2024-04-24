import Grid from '@mui/material/Grid';
import { BooleanInput, Create, SimpleForm, TextInput, required, useTranslate } from 'react-admin';

import { ColorInput } from '../components/ColorInput';

export const EmployeeCreate = () => {
    const translate = useTranslate();

    return (
        <Create redirect="list">
            <SimpleForm>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextInput source="number" fullWidth label={translate(`resources.employee.fields.number`)} validate={required()}/>
                    </Grid>
                    <Grid item xs={4}>
                        <BooleanInput source="active" fullWidth label={translate(`resources.employee.fields.active`)} defaultValue={true} />
                    </Grid>
                    <Grid item xs={4}>
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

        </Create>
    );
};
