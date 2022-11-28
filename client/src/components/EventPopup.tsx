import React from 'react';
import { BooleanInput, DateTimeInput, FormDataConsumer, ReferenceInput, required, SelectInput, SimpleForm, useDelete } from "react-admin";
import { textColorOnHEXBg, eventTypeEnum } from '../utils/Utilities';
import { Create, SaveButton, Toolbar, useRedirect, useNotify } from 'react-admin';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PostCreateToolbar = (props:any) => {
    const redirect = useRedirect();
    const notify = useNotify();
	const [_delete] = useDelete();
    
    return (
        <Toolbar>
            <SaveButton
                label="Save"
            />
            <IconButton aria-label="delete" onClick={() => {
                props.onRemoveClick()
            }}>
                <DeleteIcon />
            </IconButton>
        </Toolbar>
    );
};

export const EventPopup = (props: any) => {
    let onRemoveClick = props.onRemoveClick;

    return (
        <SimpleForm
            {...props}
            toolbar={<PostCreateToolbar onRemoveClick={onRemoveClick}></PostCreateToolbar>}>
            <BooleanInput source="all_day" label="Tutto il giorno" />
            <DateTimeInput source="start_date" label="Data inizio" />
            <DateTimeInput source="end_date" label="Data fine" />
            <SelectInput source="type" choices={
                Object.entries(eventTypeEnum).map(([id, name]) => ({id,name}))
            } 
            defaultValue="j"/>
            <ReferenceInput source="employee_id" reference="employee" label="Employee"  validate={required()} >
                <SelectInput optionText="fullname" />
            </ReferenceInput>
            <FormDataConsumer>
            {({ formData, ...rest }) => formData.type === "j" &&
                <ReferenceInput 
                source="customer_id" 
                reference="customer" 
                label="Customer">
                    <SelectInput optionText="name" />
                </ReferenceInput>
            }
        </FormDataConsumer>
        </SimpleForm>
    )
}