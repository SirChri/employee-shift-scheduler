import React, { useCallback, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Badge, Box, Button, Chip, Divider, FormControlLabel, Grid, IconButton, styled, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { AutocompleteInput, BooleanInput, CommonInputProps, DateInput, DateTimeInput, FieldTitle, FormDataConsumer, Loading, ReferenceInput, SaveButton, SelectInput, SimpleForm, Toolbar, required, useDelete, useInput, useNotify, useRecordContext, useTranslate } from "react-admin";
import { eventTypeEnum } from '../utils/Utilities';
import RruleInput from './RruleInput';
import { dataProvider } from '../dataProvider';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useTimezoneList } from '../hooks/useTimezoneList';
import clsx from 'clsx';
import { ToggleButtonInput } from './ToggleButtonInput';

const PostCreateToolbar = (props: any) => {
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
    const notify = useNotify();
    const translate = useTranslate();
    const { onRemoveClick, ...sfProps } = props;
    const { userPreferences, upLoading, upError } = useUserPreferences();
    const { timezones, tzLoading, tzError } = useTimezoneList(true);
    const [showTimezone, setShowTimezone] = useState(false);

    if (tzLoading || upLoading) { return <Loading />; }

    return (
        <SimpleForm
            {...sfProps}
            toolbar={<PostCreateToolbar onRemoveClick={onRemoveClick}></PostCreateToolbar>}
        >
            <FormDataConsumer>
                {({ formData, ...rest }) => (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}
                            alignItems="stretch" // Ensure fields take full width
                        >
                            <Grid size={12}>
                                <ToggleButtonInput
                                    source="type"
                                    label="Event Type"
                                    choices={Object.entries(eventTypeEnum).map(([id, name]) => ({
                                        id,
                                        name,
                                    }))}
                                />
                                <Divider sx={{ marginY: 2 }} />
                            </Grid>

                            <Grid size={4}>
                                <ReferenceInput source="employee" reference="employee" label="Employee">
                                    <AutocompleteInput
                                        optionText="fullname"
                                        validate={required()} size='small'
                                        filterToQuery={(string) => ({ fullname: { ilike: `${string}` } })}
                                    />
                                </ReferenceInput>
                            </Grid>
                            <Grid size={4}>
                                {formData.type === "JOB" && (
                                    <ReferenceInput source="customer" reference="customer" label="Customer">
                                        <AutocompleteInput
                                            optionText="name" size='small'
                                            validate={required()}
                                            filterToQuery={(string) => ({ name: { ilike: `${string}` } })}
                                        />
                                    </ReferenceInput>
                                )}
                            </Grid>
                            <Grid size={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <BooleanInput
                                        source="all_day"
                                        label="All Day"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid size={6}>
                                {formData.all_day ? <DateInput fullWidth source="dtstart" label="Start Date" validate={required()} /> : <DateTimeInput fullWidth source="dtstart" label="Start Date" validate={required()} />}
                            </Grid>
                            <Grid size={6}>
                                {formData.all_day ? <DateInput fullWidth source="dtend" label="End Date" validate={required()} /> : <DateTimeInput fullWidth source="dtend" label="End Date" validate={required()} />}
                            </Grid>
                            <Grid size={12}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="body1">
                                        Default Timezone: <Chip label={userPreferences?.timezone} color="secondary" size="small" />
                                    </Typography>

                                    <Button
                                        variant="text"
                                        disabled={userPreferences?.timezone !== formData.dtstart_tz}
                                        size="small"
                                        onClick={() => setShowTimezone(!showTimezone)}
                                    >
                                        {showTimezone || userPreferences?.timezone != formData.dtstart_tz ? "Hide Timezone" : "Custom Timezone"}
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Timezone Fields */}
                            {(showTimezone || userPreferences?.timezone != formData.dtstart_tz) && (
                                <>
                                    <Grid size={6}>
                                        <AutocompleteInput
                                            source="dtstart_tz"
                                            defaultValue={userPreferences?.timezone}
                                            choices={timezones}
                                            optionText="description"
                                            optionValue="code"
                                            label="Start Date Timezone"
                                            size='small'
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <AutocompleteInput
                                            source="dtend_tz"
                                            defaultValue={userPreferences?.timezone}
                                            choices={timezones}
                                            optionText="description"
                                            optionValue="code"
                                            label="End Date Timezone"
                                            size='small'
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>

                        <Divider sx={{ marginY: 2 }} />
                        <RruleInput source="rrule" />
                    </Box>
                )}
            </FormDataConsumer>
        </SimpleForm>
    )
}
