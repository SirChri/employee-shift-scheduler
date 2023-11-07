import * as React from 'react';
import * as PropTypes from 'prop-types';
import { BooleanInput, DateInput, FieldTitle, FormDataConsumer, Labeled, NumberField, NumberInput, RadioButtonGroupInput, SelectArrayInput, SelectInput, TextInput, required } from 'react-admin';
import { RRule, datetime } from 'rrule';
import { Box, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from '@mui/material';
import { DateTime } from 'rrule/dist/esm/datetime';

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
    {({ formData, scopedFormData, getSource }) => {
      return (
        <>
        <Grid container spacing={2}>
            <Grid item xs={4}>
              <BooleanInput source={"recurring"} label={formData.recurring ? "Ripeti ogni" : "Ripeti"} />
            </Grid>
            {formData.recurring && 
              <>
              <Grid item xs={4}>
                  <NumberInput source={"interval"} validate={required()} defaultValue={1} label="Intervallo" />
              </Grid>
              <Grid item xs={4}>
                <SelectInput
                  source={`frequency`}
                  style={{
                    marginTop: "0"
                  }}
                  validate={required()}
                  label="Frequenza"
                  defaultValue={RRule.DAILY}
                  choices={[
                    { id: RRule.DAILY, name: 'Days' },
                    { id: RRule.WEEKLY, name: 'Weeks' },
                    { id: RRule.MONTHLY, name: 'Months' },
                    { id: RRule.YEARLY, name: 'Years' },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                {formData.freq === RRule.WEEKLY ? <SelectArrayInput
                  fullWidth
                  label="Si ripete il"
                  source={`byweekday`}
                  defaultValue={() => {
                    return formData.start_date ?  (new Date(formData.start_date)).getUTCDay() % 7 : null
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
                /> : null }
                <RadioButtonGroupInput source="until" label={"Fine:"} sx={{
                    '&': {width: "100%"},
                    '& .MuiFormControlLabel-label': {width: "100%"}
                  }} row={false} defaultValue={0}
                  choices={[
                      { id: 0},
                      { id: 1},
                      { id: 2},
                  ]} optionText={(choice) => {
                    switch(choice.id) {
                      case 1: //date
                        return (
                          <Grid container spacing={2}  alignItems="center" >
                            <Grid item xs={4}>
                              {"Data:"}
                            </Grid>
                            <Grid item xs={8}>
                              <DateInput fullWidth disabled={formData.until != 1} source={"until_date"} validate={formData.until == 1 ? required() : undefined}  />
                            </Grid>
                          </Grid>
                          )
                      case 2: //occurrences
                        return (
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={4}>
                              {"Dopo:"}
                            </Grid>
                            <Grid item xs={8}>
                              <NumberInput fullWidth disabled={formData.until != 2} source={"until_occurrences"} validate={formData.until == 2 ? required() : undefined}  defaultValue={1} />
                            </Grid>
                          </Grid>
                        )
                      default:
                        return (
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                              {"Mai:"}
                            </Grid>
                          </Grid>
                        )
                    }
                  }} />
                </Grid>
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

  