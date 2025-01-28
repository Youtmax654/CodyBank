import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { registrationSchema } from "../../schemas/auth";
import { register } from "../../utils/auth";

export default function RegisterForm() {
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      await toast.promise(register(values), {
        loading: "Enregistrement en cours...",
        success: "Enregistrement réussi !",
        error: "Erreur lors de l'enregistrement",
      });
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col justify-center items-center gap-4 bg-white rounded-md w-1/2 h-full"
    >
      <div className="flex flex-row w-1/2 gap-4">
        <TextField
          id="first_name"
          name="first_name"
          label="Prénom"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
          required
        />
        <TextField
          id="last_name"
          name="last_name"
          label="Nom"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
          required
        />
      </div>
      <TextField
        className="w-1/2"
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        required
      />
      <TextField
        className="w-1/2"
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
      <TextField
        className="w-1/2"
        id="confirm_password"
        name="confirm_password"
        label="Confirmer le mot de passe"
        type="password"
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
        S'inscrire
      </Button>
    </form>
  );
}
