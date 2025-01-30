import { newAccountSchema } from "@/schemas/newAccount";
import { AccountType, addAccount } from "@/utils/accounts";
import { Account } from "@/utils/accounts";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

export default function AddAccount({
  setAccounts,
}: {
  setAccounts: Dispatch<SetStateAction<Account[] | null>>;
}) {
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
      name: "",
      type: "CHECKING" as AccountType,
    },
    validationSchema: newAccountSchema,
    onSubmit: async (values) => {
      console.log("first");
      await toast.promise(addAccount(values), {
        loading: "Creation en cours...",
        success: (account: Account) => {
          setAccounts((prev: Account[] | null) => {
            if (prev) {
              return [...prev, account];
            }
            return null;
          });
          return "Creation réussi !";
        },
      });
      handleClose();
    },
  });

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Ajouter un compte
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-72 bg-white border-2 border-black shadow-2xl p-4">
          <div className="flex flex-col gap-5">
            <div>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                fontWeight="bold"
              >
                Ajouter un compte
              </Typography>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-5">
                <FormControl fullWidth>
                  <InputLabel id="type-label">Type de compte</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    label="Type de compte"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    required
                  >
                    <MenuItem value={"CHECKING" as AccountType}>
                      Compte courant
                    </MenuItem>
                    <MenuItem value={"SAVINGS" as AccountType}>
                      Compte épargne
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="name"
                  label="Nom du compte"
                  variant="outlined"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  required
                />
              </div>
              <div className="flex flex-row gap-4 pt-5">
                <Button variant="outlined" onClick={handleClose}>
                  Annuler
                </Button>
                <Button variant="contained" type="submit">
                  Créer un compte
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
