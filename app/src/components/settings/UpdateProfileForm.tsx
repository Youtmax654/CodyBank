import { updateProfileSchema } from "@/schemas/auth";
import { updateProfile } from "@/utils/auth";
import { getUser } from "@/utils/users";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function UpdateProfileForm() {
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
    validationSchema: updateProfileSchema,
    onSubmit: async (values) => {
      await toast.promise(updateProfile(values), {
        loading: "Mise à jour en cours...",
        success: "Mise à jour réussie !",
        error: (err) => {
          switch (err.status) {
            case 409:
              return "Cette adresse email est déjà utilisée";
            default:
              return "Une erreur est survenue, veuillez réessayer plus tard";
          }
        },
      });
    },
  });

  useEffect(() => {
    getUser().then((user) => {
      formik.setValues({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    });
  }, []);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col items-start mx-auto gap-4 w-full"
    >
      <TextField
        fullWidth
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
        fullWidth
        id="last_name"
        name="last_name"
        label="Nom de famille"
        value={formik.values.last_name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.last_name && Boolean(formik.errors.last_name)}
        helperText={formik.touched.last_name && formik.errors.last_name}
        required
      />
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
      <Button color="primary" variant="contained" type="submit">
        Mettre à jour
      </Button>
    </form>
  );
}
