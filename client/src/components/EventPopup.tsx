import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AutocompleteInput, BooleanInput, DateInput, DateTimeInput, FormDataConsumer, ReferenceInput, required, SelectInput, SimpleForm, TimeInput, useCreate, useDelete, useUpdate } from "react-admin";
import { textColorOnHEXBg, eventTypeEnum } from '../utils/Utilities';
import { Create, SaveButton, Toolbar, useRedirect, useNotify } from 'react-admin';
import { Box, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RruleInput from './RruleInput';
import { RRule, datetime } from 'rrule';

const PostCreateToolbar = (props:any) => {
    const redirect = useRedirect();
    const notify = useNotify();
	const [_delete] = useDelete();

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
                        <DateTimeInput fullWidth source="start_date" label="Data inizio" validate={required()} />
                    </Grid>
                    {/*<Grid item xs={3}>
                        {!formData.all_day && <TimeInput fullWidth source="start_time" label="Ora inizio" validate={required()} />}
                    </Grid>*/}
                    <Grid item xs={6}>
                        <DateTimeInput fullWidth source="end_date" label="Data fine" validate={required()} />
                    </Grid>
                    {/*<Grid item xs={3}>
                        {!formData.all_day && <TimeInput fullWidth source="end_time" label="Ora fine" validate={required()} />}
                    </Grid>*/}
                    <Grid item xs={4}>
                        <SelectInput source="type" choices={
                            Object.entries(eventTypeEnum).map(([id, name]) => ({id,name}))
                        } 
                        defaultValue="j"/>
                    </Grid>
                    <Grid item xs={4}>
                            <ReferenceInput source="employee_id" reference="employee" label="Employee" >
                                <AutocompleteInput optionText="fullname" validate={required()} />
                            </ReferenceInput>
                    </Grid>
                    <Grid item xs={4}>
                        {formData.type === "j" && 
                            <ReferenceInput 
                            source="customer_id" 
                            reference="customer"  
                            validate={required()}
                            label="Customer">
                                <AutocompleteInput optionText="name" validate={required()}/>
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
