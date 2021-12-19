import * as yup from "yup";

export const usernameValidationSchema = yup
  .string()
  .min(3)
  .max(16)
  .matches(/^[a-zA-Z0-9_.]*$/, {
    message: "Username may only contain letters, numbers or '_', '.'",
  })
  .required();
