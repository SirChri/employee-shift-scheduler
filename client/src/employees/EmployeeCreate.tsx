import React from 'react';
import Grid from '@mui/material/Grid';
import { useTranslate, BooleanInput, Create, SimpleForm, TextInput, required, useNotify, useRedirect } from 'react-admin';

import { ColorInput } from '../components/ColorInput';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import timeGrid from '@fullcalendar/timegrid' // a plugin!
import dayGrid from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import Box from '@mui/material/Box';

export const EmployeeCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const translate = useTranslate();

    const onSuccess = (data:any) => {
        notify(`Post created successfully`); // default message is 'ra.notification.created'

        //TODO: handle calendar events creation here
    };

    return (
        <Create redirect="list" mutationOptions={{ onSuccess }}>
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

            <Box width="100%" height="500px">
                <FullCalendar
                    locale="it" //TODO: localize
                    height="500px"
                    initialDate="1996-09-29"
                    selectable={true}
                    slotMinTime="05:00:00"
                    slotMaxTime="22:00:00"
                    dayHeaderContent={(arg) => {
                        return arg.date.toLocaleString("it", {weekday: 'long'}) //TODO: localize
                    }}
                    plugins={[timeGrid, dayGrid, interactionPlugin]}
                    headerToolbar= {{
                        left: '',
                        center: '',
                        right: ''
                    }}
                    eventMaxStack={5}
                    initialView="timeGridWeek"
                />
            </Box>
            </SimpleForm>

        </Create>
    );
};