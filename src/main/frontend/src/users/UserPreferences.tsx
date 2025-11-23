import React, { useEffect, useState } from 'react';
import { SimpleForm, TextInput, SaveButton, Toolbar, useNotify, useTranslate, Loading, required, ReferenceInput, AutocompleteInput } from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { dataProvider } from '../dataProvider';
import { useGetList } from 'react-admin';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useTimezoneList } from '../hooks/useTimezoneList';

const UserPreferences = () => {
    const notify = useNotify();
    const translate = useTranslate();
    const { userPreferences, upLoading, upError } = useUserPreferences();
    const { timezones, tzLoading, tzError } = useTimezoneList(false);

    const handleSave = (data: any) => {
        // Update user preferences
        dataProvider.updateUserPreferences(data)
            .then(() => {
                notify(translate("ess.users.preferences.success_update"), { type: 'success' });
            })
            .catch((err) => {
                console.error(err);
                notify(translate("ess.users.preferences.error_update"), { type: 'error' });
            });
    };

    if (tzLoading || upLoading) { return <Loading />; }   

    return (
        <Box>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {translate("ess.users.preferences.title")}
                    </Typography>
                    <SimpleForm
                        record={userPreferences}
                        onSubmit={handleSave}
                        toolbar={
                            <Toolbar>
                                <SaveButton label={translate("ra.action.save")} />
                            </Toolbar>
                        }
                    >
                        <AutocompleteInput 
                            source="timezone"
                            choices={timezones}
                            validate={required()}
                            autoFocus
                            optionText="description"
                            optionValue="code"
                            fullWidth
                        />
                        <TextInput source="language" label={translate("ess.users.preferences.language")} fullWidth />
                    </SimpleForm>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserPreferences;