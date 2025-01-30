import { updatePasswordSchema } from "@/schemas/auth";
import { changePassword } from "@/utils/auth";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import toast from "react-hot-toast";

export default function UpdatePasswordForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: updatePasswordSchema,
    onSubmit: async (values) => {
      await toast.promise(changePassword(values), {
        loading: "Mise à jour en cours...",
        success: () => {
          navigate({ to: "/login" });
          return "Votre mot de passe a bien éte mis à jour !";
        },
        error: (err) => {
          switch (err.status) {
            case 401:
              return "Votre mot de passe actuel est incorrect";
            default:
              return "Une erreur est survenue, veuillez réessayer plus tard";
          }
        },
      });
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col items-start mx-auto gap-4 w-full"
    >
      <TextField
        fullWidth
        id="old_password"
        name="old_password"
        type="password"
        label="Mot de passe actuel"
        value={formik.values.old_password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.old_password && Boolean(formik.errors.old_password)
        }
        helperText={formik.touched.old_password && formik.errors.old_password}
        required
      />
      <TextField
        fullWidth
        id="new_password"
        name="new_password"
        type="password"
        label="Nouveau mot de passe"
        value={formik.values.new_password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.new_password && Boolean(formik.errors.new_password)
        }
        helperText={formik.touched.new_password && formik.errors.new_password}
        required
      />
      <TextField
        fullWidth
        id="confirm_password"
        name="confirm_password"
        type="password"
        label="Confirmer le mot de passe"
        value={formik.values.confirm_password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.confirm_password &&
          Boolean(formik.errors.confirm_password)
        }
        helperText={
          formik.touched.confirm_password && formik.errors.confirm_password
        }
        required
      />
      <Button color="primary" variant="contained" type="submit">
        Mettre à jour
      </Button>
    </form>
  );
}
