import React from 'react';
import { Create, SimpleForm, TextInput, required, PasswordInput } from 'react-admin';

export const UserCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextInput source="name" validate={[required()]}  label="name" />
            <TextInput source="email" validate={[required()]}  label="Email" />
            <PasswordInput source="password" label="Password" />
        </SimpleForm>
    </Create>
);