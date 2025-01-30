import * as yup from "yup";

export const newAccountSchema = yup.object({
  name: yup.string().required("Le nom est obligatoire."),
  type: yup
    .string()
    .oneOf(["CHECKING", "SAVINGS"])
    .required("Le type est obligatoire."),
});
