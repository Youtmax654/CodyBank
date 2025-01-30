import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Veuillez entrer une adresse email valide.")
    .required("L'adresse email est obligatoire."),
  password: yup.string().required("Le mot de passe est obligatoire"),
});

export const registrationSchema = yup.object({
  first_name: yup.string().required("Le prenom est obligatoire."),
  last_name: yup.string().required("Le nom est obligatoire."),
  email: yup
    .string()
    .email("Veuillez entrer une adresse email valide.")
    .required("L'adresse email est obligatoire."),
  password: yup
    .string()
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      "Le mot de passe doit contenir au moins 8 caractères, 1 chiffre et 1 caractère spécial."
    )
    .required("Le mot de passe est obligatoire"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas.")
    .required("La confirmation du mot de passe est obligatoire"),
});

export const updatePasswordSchema = yup.object({
  old_password: yup.string().required("Le mot de passe actuel est requis"),
  new_password: yup
    .string()
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      "Le nouveau mot de passe doit contenir au moins 8 caractères, 1 chiffre et 1 caractère spécial."
    )
    .required("Le nouveau mot de passe est requis"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Les mots de passe ne correspondent pas.")
    .required("La confirmation du nouveau mot de passe est requise"),
});

export const updateProfileSchema = yup.object({
  first_name: yup.string().required("Le prenom est obligatoire."),
  last_name: yup.string().required("Le nom est obligatoire."),
  email: yup
    .string()
    .email("Veuillez entrer une adresse email valide.")
    .required("L'adresse email est obligatoire."),
});
