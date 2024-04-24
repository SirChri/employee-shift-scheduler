import React from 'react';
import { SimpleForm, TextInput, Edit } from 'react-admin';

export const UserEdit = () => (
    <Edit redirect="list">
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput disabled source="username" />
            <TextInput source="email" />
        </SimpleForm>
    </Edit>
);