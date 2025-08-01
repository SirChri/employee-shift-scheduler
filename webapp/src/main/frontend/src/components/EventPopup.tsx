import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Chip, Divider, Grid, IconButton, Typography } from '@mui/material';
import { AutocompleteInput, BooleanInput, DateInput, DateTimeInput,  FormDataConsumer, Loading, ReferenceInput, SaveButton, SimpleForm, Toolbar, required, useNotify, useTranslate } from "react-admin";
import { eventTypeEnum } from '../utils/Utilities';
import RruleInput from './RruleInput';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useTimezoneList } from '../hooks/useTimezoneList';
import { ToggleButtonInput } from './ToggleButtonInput';

export const EventPopup = (props: any) => {
    const translate = useTranslate();
    const { onRemoveClick, ...sfProps } = props;
    const { userPreferences, upLoading, upError } = useUserPreferences();
    const { timezones, tzLoading, tzError } = useTimezoneList(true);
    const [showTimezone, setShowTimezone] = useState(false);

    if (tzLoading || upLoading) { return <Loading />; }

    return (
        <SimpleForm
            {...sfProps}
            toolbar={<Toolbar>
                <SaveButton
                    label={translate("ra.action.save")}
                />
                <IconButton sx={{ marginLeft: "auto" }} aria-label="delete" onClick={onRemoveClick}>
                    <DeleteIcon />
                </IconButton>
            </Toolbar>}
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
                                    choices={Object.entries(eventTypeEnum).map(([id, name]) => ({
                                        id,
                                        name: translate("ess.calendar.event.type." + name?.toLowerCase())
                                    }))}
                                />
                                <Divider sx={{ marginY: 2 }} />
                            </Grid>

                            <Grid size={4}>
                                <ReferenceInput source="employee" reference="employee">
                                    <AutocompleteInput
                                        optionText="fullname" label={translate("ess.calendar.event.labels.employee")}
                                        validate={required()} size='small'
                                        filterToQuery={(string) => ({ fullname: { ilike: `${string}` } })}
                                    />
                                </ReferenceInput>
                            </Grid>
                            <Grid size={4}>
                                {formData.type === "JOB" && (
                                    <ReferenceInput source="customer" reference="customer">
                                        <AutocompleteInput
                                            optionText="name" size='small'
                                            validate={required()} label={translate("ess.calendar.event.labels.customer")}
                                            filterToQuery={(string) => ({ name: { ilike: `${string}` } })}
                                        />
                                    </ReferenceInput>
                                )}
                            </Grid>
                            <Grid size={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <BooleanInput
                                        source="all_day"
                                        label={translate("ess.calendar.event.labels.all_day")}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid size={6}>
                                {formData.all_day ? <DateInput fullWidth source="dtstart" label={translate("ess.calendar.event.labels.start_date")} validate={required()} /> : <DateTimeInput fullWidth source="dtstart" label={translate("ess.calendar.event.labels.start_date")} validate={required()} />}
                            </Grid>
                            <Grid size={6}>
                                {formData.all_day ? <DateInput fullWidth source="dtend" label={translate("ess.calendar.event.labels.end_date")} validate={required()} /> : <DateTimeInput fullWidth source="dtend" label={translate("ess.calendar.event.labels.end_date")} validate={required()} />}
                            </Grid>
                            <Grid size={12}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="body1">
                                        {translate("ess.calendar.event.labels.default_timezone")} <Chip label={userPreferences?.timezone} color="secondary" size="small" />
                                    </Typography>

                                    <Button
                                        variant="text"
                                        disabled={userPreferences?.timezone !== formData.dtstart_tz}
                                        size="small"
                                        onClick={() => setShowTimezone(!showTimezone)}
                                    >
                                        {showTimezone || userPreferences?.timezone != formData.dtstart_tz ? translate("ess.calendar.event.labels.hide_timezone") : translate("ess.calendar.event.labels.custom_timezone")}
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
                                            label={translate("ess.calendar.event.labels.start_date_timezone")}
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
                                            label={translate("ess.calendar.event.labels.end_date_timezone")}
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
