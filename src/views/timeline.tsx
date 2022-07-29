
import {Timeline} from "../components/Timeline";
import { makeStyles } from '@material-ui/core/styles';
import { Fab } from "@material-ui/core";
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import React from "react";
import { SimpleForm, required, useCreate, ReferenceInput, SelectInput, DateTimeInput } from 'react-admin';


const useStyles = makeStyles(() => ({
    tl: {
        margin: 15,
        flex: "1 1 auto"
    },
    fabStyle:  {
        right: 20,
        position: 'fixed',
        bottom: 10
    }
  }));

export default function TimelineView() {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [create] = useCreate();

    const postSave = (data: any) => {
        debugger;
        create('agenda', { data });
    };

    return (
            <div className={classes.tl}>
                <Timeline />
                <Fab color="primary" aria-label="add" className={classes.fabStyle} onClick={handleOpen}>
                    <AddIcon />
                </Fab>
                <Dialog 
                    open={open}
                    onClose={handleClose}
                >
                <Box>
                    <SimpleForm onSubmit={postSave} resource="agenda">
                        <DateTimeInput source="start_date" validate={[required()]} label="Data inizio" />
                        <DateTimeInput source="end_date" validate={[required()]} label="Data fine" />
                        <ReferenceInput source="dipendente_id" validate={[required()]} reference="dipendente" label="Dipendente">
                            <SelectInput optionText="nome" />
                        </ReferenceInput>
                        <ReferenceInput source="cliente_id" validate={[required()]} reference="cliente" label="Cliente">
                            <SelectInput optionText="descrizione" />
                        </ReferenceInput>
                    </SimpleForm>
                </Box>
                </Dialog>
            </div>
    );
}
