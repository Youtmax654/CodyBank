import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useFormik, Formik } from "formik";
import toast from "react-hot-toast";
import { newAccountSchema } from "@/schemas/newAccount";
import { addAccount, AccountType } from "@/utils/account";


export default function AddAccount() {

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            type: "CHECKING" as AccountType,
        },
        validationSchema: newAccountSchema,
        onSubmit: async (values) => {
            console.log("first")
            try {
                await toast.promise(addAccount(values), {
                    loading: "Creation en cours...",
                    success: "Creation réussi !",
                });
                handleClose();
            } catch (error) {
                console.error(error);
            }
        },
    })

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>Ajouter un compte</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-72 bg-white border-2 border-black shadow-2xl p-4">
                    <div className="flex flex-col gap-5">
                        <div>
                            <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
                                Ajouter un compte
                            </Typography>
                        </div>
                        <Formik
                            initialValues={formik.initialValues}
                            onSubmit={
                                async (values) => {
                                    try {
                                        await toast.promise(addAccount(values), {
                                            loading: "Creation en cours...",
                                            success: "Creation réussi !",
                                        });
                                        handleClose();
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }
                            }
                        >
                            {
                                formik => (
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="flex flex-col gap-5">
                                            <FormControl fullWidth>
                                                <InputLabel>Type de compte</InputLabel>
                                                <Select
                                                    name="type"
                                                    value={formik.values.type}
                                                    onChange={formik.handleChange}
                                                >
                                                    <MenuItem value="SAVINGS">Compte épargne</MenuItem>
                                                    <MenuItem value="CHECKING">Compte courant</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                id="name"
                                                label="Nom du compte"
                                                variant="outlined"
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                />

                                        </div>
                                        <div className="flex flex-row gap-5 pt-5">
                                            <Button variant="outlined" onClick={handleClose}>Annuler</Button>
                                            <Button variant="contained" type="submit">Créer un compte</Button>
                                        </div>
                                    </form>
                                )
                            }

                        </Formik>
                    </div>
                </Box>


            </Modal>
        </div>
    )
}