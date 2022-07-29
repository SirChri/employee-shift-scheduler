
import {Timeline} from "../components/Timeline";
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import React from "react";
import { SimpleForm, required, useCreate, ReferenceInput, SelectInput, DateTimeInput } from 'react-admin';

export default function TimelineView() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [create] = useCreate();

    const postSave = (data: any) => {
        debugger;
        create('agenda', { data });
    };

    return (
            <div style={{
                margin: 15,
                flex: "1 1 auto"
            }}>
                <Timeline />
                <Fab color="primary" aria-label="add" style={{
                    right: 20,
                    position: 'fixed',
                    bottom: 10
                }} onClick={handleOpen}>
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
