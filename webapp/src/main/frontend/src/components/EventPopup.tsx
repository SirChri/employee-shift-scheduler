import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Grid, IconButton } from '@mui/material';
import { AutocompleteInput, BooleanInput, DateTimeInput, FormDataConsumer, ReferenceInput, SaveButton, SelectInput, SimpleForm, Toolbar, required, useDelete } from "react-admin";
import { eventTypeEnum } from '../utils/Utilities';
import RruleInput from './RruleInput';

const PostCreateToolbar = (props:any) => {
    return (
        <Toolbar>
            <SaveButton
                label="Save"
            />
            <IconButton sx={{ marginLeft: "auto" }} aria-label="delete" onClick={() => {
                props.onRemoveClick()
            }}>
                <DeleteIcon />
            </IconButton>
        </Toolbar>
    );
};

export const EventPopup = (props: any) => {
    const { onRemoveClick, ...sfProps } = props;

    return (
        <SimpleForm
            {...sfProps}
            toolbar={<PostCreateToolbar onRemoveClick={onRemoveClick}></PostCreateToolbar>}>

            <FormDataConsumer>
            {({ formData, ...rest }) => 
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <BooleanInput source="all_day" label="Tutto il giorno" />
                    </Grid>
                    <Grid item xs={6}>
                        <DateTimeInput fullWidth source="dtstart" label="Data inizio" validate={required()} />
                    </Grid>
                    {/*<Grid item xs={3}>
                        {!formData.all_day && <TimeInput fullWidth source="start_time" label="Ora inizio" validate={required()} />}
                    </Grid>*/}
                    <Grid item xs={6}>
                        <DateTimeInput fullWidth source="dtend" label="Data fine" validate={required()} />
                    </Grid>
                    {/*<Grid item xs={3}>
                        {!formData.all_day && <TimeInput fullWidth source="end_time" label="Ora fine" validate={required()} />}
                    </Grid>*/}
                    <Grid item xs={4}>
                        <SelectInput source="type" validate={required()} choices={
                            Object.entries(eventTypeEnum).map(([id, name]) => ({id,name}))
                        } />
                    </Grid>
                    <Grid item xs={4}>
                            <ReferenceInput source="employee" reference="employee" label="Employee" >
                                <AutocompleteInput optionText="fullname" validate={required()} filterToQuery={string => ({ fullname: {ilike: `${string}`}} )}/>
                            </ReferenceInput>
                    </Grid>
                    <Grid item xs={4}>
                        {formData.type === "JOB" && 
                            <ReferenceInput 
                            source="customer" 
                            reference="customer"  
                            label="Customer">
                                <AutocompleteInput optionText="name" validate={required()} filterToQuery={string => ({ name: {ilike: `${string}`}} )}/>
                            </ReferenceInput>
                        }
                    </Grid>
                </Grid>
                <RruleInput source="rrule" />
            </Box>
        }
        </FormDataConsumer>
        </SimpleForm>
    )
}
