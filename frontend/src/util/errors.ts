import { FieldError } from "generated/graphql"
import { ERRORS } from "./consts"

// the tf2 way to implement errors lol

export const TIME_OUT: FieldError = {
    "message": ERRORS.AUTH_TIME_OUT
}


export const EMAIL_NOT_PROVIDED: FieldError = {
    "field": "email",
    "message": ERRORS.EMAIL_NOT_PROVIDED
}


export const PASSWORD_NOT_PROVIDED: FieldError = {
    "field": "password",
    "message": ERRORS.PASSWORD_NOT_PROVIDED
}


export const USERNAME_NOT_PROVIDED: FieldError = {
    "field": "username",
    "message": ERRORS.USERNAME_NOT_PROVIDED
}


export const PASSWORD_MISMATCH: FieldError = {
    "field": "password",
    "message": ERRORS.PASSWORD_MISMATCH
}

export const INVALID_EMAIL: FieldError = {
    "field": "email",
    "message": ERRORS.INVALID_EMAIL
}

export const INVALID_USERNAME: FieldError = {
    "field": "username",
    "message": ERRORS.INVALID_USERNAME
}

export const INVALID_PASSWORD_REGEX: FieldError = {
    "field": "password",
    "message": ERRORS.INVALID_PASSWORD_REGEX
}
