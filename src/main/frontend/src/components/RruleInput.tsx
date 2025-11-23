import { Box, Grid, Typography } from '@mui/material';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { BooleanInput, DateInput, FormDataConsumer, NumberInput, SelectInput, required, useTranslate } from 'react-admin';
import { ToggleButtonInput } from './ToggleButtonInput';

interface RruleInputProps {
  source: string;
}

const RruleInput: React.FC<RruleInputProps> = ({ source }) => {
  const translate = useTranslate(); // Hook for translations

  return (
    <FormDataConsumer>
      {({ formData, scopedFormData }) => {
        return (
          <>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Box display="flex" alignItems="center" sx={{ marginBottom: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      marginRight: 2,
                      lineHeight: '2rem', // Match the height of the BooleanInput
                      display: 'flex',
                      alignItems: 'center', // Vertically center the text
                    }}
                  >
                    {translate("ess.calendar.event.labels.recurring_event")}:
                  </Typography>
                  <BooleanInput
                    source="recurring"
                    label={false} // Remove the label to avoid extra space
                    sx={{
                      display: 'flex',
                      height: '2rem', // Match the height of the Typography
                    }}
                  />
                </Box>
              </Grid>

              {formData.recurring && (
                <>
                  <Grid size={2}>
                    <Typography variant="body1" sx={{ lineHeight: '1.5rem' }}>
                      {translate("ess.calendar.event.labels.every")}
                    </Typography>
                  </Grid>
                  <Grid size={5}>
                    <NumberInput
                      source="interval"
                      validate={required()}
                      defaultValue={1}
                      fullWidth
                      sx={{ margin: '8px 0' }}
                      label={translate("ess.calendar.event.labels.interval")}
                    />
                  </Grid>
                  <Grid size={5}>
                    <SelectInput
                      source="frequency"
                      fullWidth
                      size="small"
                      validate={required()}
                      label={translate("ess.calendar.event.labels.frequency")}
                      defaultValue={2}
                      choices={[
                        { id: 3, name: translate("ess.calendar.event.labels.days") },
                        { id: 2, name: translate("ess.calendar.event.labels.weeks") },
                        { id: 1, name: translate("ess.calendar.event.labels.months") },
                        { id: 0, name: translate("ess.calendar.event.labels.years") },
                      ]}
                    />
                  </Grid>
                  <Grid size={2}>
                    <Typography variant="body1" sx={{ height: '40px' }}>
                      {translate("ess.calendar.event.labels.stop_after")}
                    </Typography>
                  </Grid>
                  <Grid size={5}>
                    <ToggleButtonInput
                      source="until_type"
                      defaultValue={'0'}
                      choices={[
                        { id: '0', name: translate("ess.calendar.event.labels.never") },
                        { id: '1', name: translate("ess.calendar.event.labels.date") },
                        { id: '2', name: translate("ess.calendar.event.labels.occurrences") },
                      ]}
                    />
                  </Grid>
                  <Grid size={5}>
                    {(() => {
                      switch (formData.until_type) {
                        case '1': // Date
                          return (
                            <DateInput
                              fullWidth
                              sx={{ margin: '5px 0' }}
                              source="until_date"
                              validate={required()}
                              label={translate("ess.calendar.event.labels.until_date")}
                            />
                          );
                        case '2': // Number of occurrences
                          return (
                            <NumberInput
                              fullWidth
                              sx={{ margin: '5px 0' }}
                              source="until_occurrences"
                              validate={required()}
                              defaultValue={1}
                              label={translate("ess.calendar.event.labels.until_occurrences")}
                            />
                          );
                        default:
                          return (
                            <DateInput
                              disabled
                              fullWidth
                              sx={{ margin: '5px 0' }}
                              source="until_date"
                              validate={required()}
                              label={translate("ess.calendar.event.labels.until_date")}
                            />
                          );
                      }
                    })()}
                  </Grid>
                </>
              )}
            </Grid>
          </>
        );
      }}
    </FormDataConsumer>
  );
};

RruleInput.propTypes = {
  source: PropTypes.string.isRequired,
};

export default RruleInput;