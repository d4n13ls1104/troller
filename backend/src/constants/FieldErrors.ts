import { FieldError } from "types/user/FieldError.type";

export const GENERIC_FIELD_ERROR: FieldError = {
  message: "Something went wrong. Please try again later",
};

export const EMAIL_ALREADY_REGISTERED: FieldError = {
  field: "email",
  message: "That email is already registered.",
};

export const USERNAME_ALREADY_REGISTERED: FieldError = {
  field: "username",
  message: "That username is already registered.",
};

export const EMAIL_NOT_REGISTERED: FieldError = {
  field: "email",
  message: "No user with that email",
};

export const INVALID_CREDENTIALS: FieldError = {
  field: "password",
  message: "Invalid credentials.",
};
