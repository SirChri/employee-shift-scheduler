import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { Button, RaRecord, SaveButton, SimpleForm, TextInput, Toolbar, required, useCreatePath, useNotify, useRecordContext, useResourceContext, useTranslate } from "react-admin";
import { dataProvider } from "../dataProvider";

export const PasswordUpdateBtn = <RecordType extends RaRecord = any>(
    props: any
) => {
    const notify = useNotify();
    const translate = useTranslate();
    const record = useRecordContext(props);

    const {
        icon = <LockResetIcon />,
        label = translate("ess.users.password_update.btn_label")
    } = props;

    // State to manage dialog open/close
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    if (!record) return null;

    // Function to handle button click
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDialogOpen(true); // Open the dialog
    };

    // Function to handle form submission
    const handleFormSubmit = (e: any) => {
        e.stopPropagation();

        if (!newPassword)
            return;

        dataProvider.updatePassword({
            user: record.id as number,
            password: newPassword
        })
			.then((res) => {
                setIsDialogOpen(false)
                notify(translate("ess.users.password_update.updated")) 
			})
			.catch(err => {
				console.error(err);
                notify(translate("ess.users.password_update.updated_error")) 
			});
    };

    return (
        <>
            <Button
                label={label}
                onClick={handleButtonClick}
            >
                {icon}
            </Button>

            {/* Dialog for password update */}
            <Dialog onClick={(e:any) => {
                e.stopPropagation();
            }} open={isDialogOpen} onClose={(e:any) => {
                e.stopPropagation();

                setIsDialogOpen(false)
            }}>
                <DialogTitle>{translate("ess.users.password_update.btn_label")}</DialogTitle>
                <DialogContent>

                    <SimpleForm 
                    toolbar={
                        <Toolbar>
                            <SaveButton
                                onClick={handleFormSubmit}
                                label="Save"
                            />

                            <IconButton sx={{ marginLeft: "auto" }} aria-label="cancel" onClick={(e: any) => {
                                e.stopPropagation();
                                setIsDialogOpen(false)
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>}
                    >
                    {/* Form for password update */}
                        <TextInput 
                            source="username"
                            label="Username"
                            fullWidth
                            defaultValue={record.username}
                            disabled
                        />
                        <TextInput
                            source="password"
                            label={translate("ess.users.password_update.field_label")}
                            type="password"
                            fullWidth
                            value={newPassword}
                            validate={required()}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoFocus
                        />
                    </SimpleForm>
                 </DialogContent>
            </Dialog>
        </>
    );
};
