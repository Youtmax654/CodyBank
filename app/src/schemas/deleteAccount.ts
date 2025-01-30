import * as Yup from "yup";

export const deleteAccountSchema = Yup.object({
    password: Yup.string().required("Le mot de passe est obligatoire"),
});