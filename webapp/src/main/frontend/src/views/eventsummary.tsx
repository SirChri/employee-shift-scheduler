import * as React from "react";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { Box, Card, CardContent, Grid, IconButton, Skeleton } from '@mui/material';
import { useState } from 'react';
import { AutocompleteArrayInput, DateTimeInput, FormDataConsumer, ReferenceArrayInput, SaveButton, SimpleForm, Toolbar, required, useLocaleState } from 'react-admin';

export default function EmployeeSummaryList() {
    // State variable to store the source URL of the PDF file
    const [pdfSource, setPdfSource] = useState('');
    const [locale, setLocale] = useLocaleState();

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                <Card
						sx={{
							overflowY: "auto",
							height: "85vh",
							marginTop: "10px"
						}}
					>
						<CardContent sx={{ pt: 1 }}>
                            <SimpleForm
                                onSubmit={(data) => {
                                    let url = `../api/event/print?locale=${locale}&start=${data.start.toISOString()}&end=${data.end.toISOString()}`;
                                    if (data.employee && data.employee[0]) {
                                        url += `&employees=${data.employee.join(",")}`
                                    }
                                    setPdfSource(url)
                                }}
                                toolbar={<Toolbar>
                                    <SaveButton label={"Generate"} icon={<SettingsSuggestIcon />} />
                                    <IconButton sx={{ marginLeft: "auto" }} aria-label="delete" onClick={() => {
                                        //debugger;
                                    }}>
                                        <RestartAltIcon />
                                    </IconButton>
                                </Toolbar>}>

                                <FormDataConsumer>
                                {({ formData, ...rest }) => 
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <DateTimeInput source="start" alwaysOn fullWidth validate={required()}/>
                                        </Grid> 
                                        <Grid item xs={12}>
                                            <DateTimeInput source="end" alwaysOn fullWidth validate={required()}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                                <ReferenceArrayInput source="employee" reference="employee" label="Employee" >
                                                    <AutocompleteArrayInput optionText="fullname" filterToQuery={string => ({ fullname: {ilike: `${string}`}} )}/>
                                                </ReferenceArrayInput>
                                        </Grid>
                                    </Grid>
                                </Box>
                            }
                            </FormDataConsumer>
                            
                            </SimpleForm>
						</CardContent>
					</Card>
                </Grid>
                <Grid item xs={8} marginTop={"10px"}>
                    {pdfSource && <iframe 
                        src={pdfSource} 
                        width="100%" height="100%" />}
                    {!pdfSource && <Skeleton variant="rounded" width="100%" height="100%" />}
                </Grid>
            </Grid>
        </div>
    );
};
