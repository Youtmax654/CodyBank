import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import { deleteAccountSchema } from "@/schemas/deleteAccount";
import toast from "react-hot-toast";
import { checkPassword } from "@/utils/auth";
import axios from "axios";
import Cookies from "js-cookie";

export default function DeleteAccount({ accountId, onAccountDeleted }: { accountId: string; onAccountDeleted?: () => void }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    };
    const formik = useFormik({
        initialValues: {
            password: "",
        },
        validationSchema: deleteAccountSchema,
        onSubmit: async (values) => {
            try {
                const isPasswordCorrect = await checkPassword(values);
                if (isPasswordCorrect) {
                    const token = Cookies.get("token");
                    await axios.put(`/api/accounts/${accountId}/deactivate`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        data: { password: values.password }
                    });

                    toast.success("Compte clôturé avec succès !");
                    handleClose();

                    if (onAccountDeleted) {
                        onAccountDeleted();
                    }
                } else {
                    toast.error("Mot de passe incorrect");
                }
            } catch (error) {
                toast.error("Vous ne pouvez pas clôturer le compte principal");
            }
        },
    });
    return (
        <div>
            <IconButton onClick={handleOpen}>
                <DeleteIcon color="error" />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-auto bg-white border-2 border-black shadow-2xl p-4">
                    <div>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
                            Clôturer un compte
                        </Typography>

                        <Typography id="modal-modal-description" >
                            Entrez votre mot de passe pour cloturer votre compte.
                        </Typography>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            sx={{ mt: 4 }}
                            id="password"
                            name="password"
                            label="Mot de passe"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            required
                        />
                        <div className="flex flex-row gap-4 pt-5">
                            <Button variant="outlined" onClick={handleClose}>
                                Annuler
                            </Button>
                            <Button variant="contained" type="submit">
                                Cloturer le compte
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}