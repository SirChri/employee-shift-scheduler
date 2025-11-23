import React from 'react';
import { Create, SimpleForm, TextInput, required, PasswordInput } from 'react-admin';

export const UserCreate = () => (
    <Create redirect="list">
        <SimpleForm>
            <TextInput source="username" validate={[required()]}  label="username" />
            <TextInput source="email" validate={[required()]}  label="Email" />
            <PasswordInput source="password" label="Password" validate={[required()]} />
        </SimpleForm>
    </Create>
);