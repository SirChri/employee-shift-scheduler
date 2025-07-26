import { Box, Grid, Typography } from '@mui/material';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { BooleanInput, DateInput, FormDataConsumer, NumberInput, RadioButtonGroupInput, SelectArrayInput, SelectInput, required } from 'react-admin';
import { ToggleButtonInput } from './ToggleButtonInput';

interface RruleInputProps {
  source: string;
}

/**
 * common: 
 * - repeat every X (num) day/week/month/year (select)
 * - end: never/date/after X occurrences (radio)
 * 
 * week:
 * - repeat on jan/feb/mar/... (multiple, default current day of week selected)
 * 
 * month:
 * - every month the day X/every month the first/second/... (preset) X (preset)
 * 
 * 
 * @param param0 
 * @returns 
 */
const RruleInput: React.FC<RruleInputProps> = ({ source }) => (
  <FormDataConsumer>
    {({ formData, scopedFormData }) => {
      return (
        <>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Box display="flex" alignItems="center" sx={{
                marginBottom: 2
              }}>
                <Typography
                  variant="body1"
                  sx={{
                    marginRight: 2,
                    lineHeight: '2rem', // Match the height of the BooleanInput
                    display: 'flex',
                    alignItems: 'center', // Vertically center the text
                  }}
                >
                  Recurring event:
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

            {formData.recurring &&
              <>
                <Grid size={2}>
                  {/* Label */}
                  <Typography variant="body1" sx={{
                    lineHeight: '1.5rem', // Match the height of the BooleanInput
                  }}>
                    Every:
                  </Typography>

                </Grid>
                <Grid size={5}>
                  {/* Number Input */}
                  <NumberInput
                    source="interval"
                    validate={required()}
                    defaultValue={1}
                    fullWidth
                    sx={{
                      margin: '8px 0'
                    }}
                    label="Intervallo"
                  />
                </Grid>

                <Grid size={5}>
                  {/* Frequency Select */}
                  <SelectInput
                    source="frequency"
                    fullWidth
                    size='small'
                    validate={required()}
                    label="Frequenza"
                    defaultValue={2}
                    choices={[
                      { id: 3, name: 'Days' },
                      { id: 2, name: 'Weeks' },
                      { id: 1, name: 'Months' },
                      { id: 0, name: 'Years' },
                    ]}
                  />
                </Grid>
                <Grid size={2}>
                  {/* Label */}
                  <Typography variant="body1" sx={{
                    height: '40px', // Match the height of the BooleanInput
                  }}>
                    Stop after:
                  </Typography>

                </Grid>
                <Grid size={5}>
                  <ToggleButtonInput
                    source="until_type"
                    defaultValue={'0'}
                    choices={[
                      { id: '0', name: 'Never' },
                      { id: '1', name: 'Date' },
                      { id: '2', name: '#' },
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
                          />
                        );
                    }
                  })()}
                </Grid>

                {/*<Grid size={12}>
                  formData.frequency === 2 ? <SelectArrayInput
                    fullWidth
                    label="Si ripete il"
                    source={`byweekday`}
                    defaultValue={() => {
                      return formData.dtstart ? (new Date(formData.dtstart)).getUTCDay() % 7 : null
                    }}
                    choices={[
                      { id: 0, name: 'Domenica' },
                      { id: 1, name: 'Lunedì' },
                      { id: 2, name: 'Martedì' },
                      { id: 3, name: 'Mercoledì' },
                      { id: 4, name: 'Giovedì' },
                      { id: 5, name: 'Venerdì' },
                      { id: 6, name: 'Sabato' },
                    ]}
                  /> : <></> //TODO: handle days freq
                </Grid>*/}
              </>
            }
          </Grid>
        </>
      );
    }}
  </FormDataConsumer>
);

RruleInput.propTypes = {
  source: PropTypes.string.isRequired,
};

export default RruleInput;

