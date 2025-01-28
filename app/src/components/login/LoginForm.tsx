import { Button, TextField } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { loginSchema } from "../../schemas/auth";
import { login } from "../../utils/auth";

export default function LoginForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await toast.promise(login(values), {
        loading: "Connexion en cours...",
        success: () => {
          navigate({ to: "/dashboard" });
          return "Connexion réussie !";
        },
        error: (err) => {
          switch (err.status) {
            case 401:
              return "Votre email ou mot de passe est incorrect";
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
      className="flex flex-col items-start mx-auto gap-4 w-1/2"
    >
      <TextField
        fullWidth
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
        fullWidth
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
      <Button color="primary" variant="contained" type="submit">
        Se connecter
      </Button>
    </form>
  );
}
