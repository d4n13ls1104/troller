import Error from "components/common/Error";
import Link from "components/common/Link";
import Button from "components/FormComponents/Button";
import FormAlertWrapper from "components/FormComponents/FormAlertWrapper";
import FormHeaderText from "components/FormComponents/FormHeaderText";
import FormHeaderWrapper from "components/FormComponents/FormHeaderWrapper";
import FormInputWrapper from "components/FormComponents/FormInputWrapper";
import FormText from "components/FormComponents/FormText";
import FormNavWrapper from "components/FormComponents/FormWrapper";
import Input from "components/FormComponents/Input";
import { FieldError, useRegisterMutation } from "generated/graphql";
import React, { useEffect, useRef, useState } from "react";
import { RegisterType } from "types/UserEntry";
import { API_TIMEOUT, COLORS } from "util/consts";
import * as ERROR from "util/errors";
import { validateEmail, validatePassword, validateUsername } from "util/validation";



const Register: React.FC = () => {
    const [, register] = useRegisterMutation();
    const [info, setInfo] = useState<RegisterType>(RegisterInitialValues);
    const [errors, setErrors] = useState<FieldError[]>();
    const [emailError, setEmailError] = useState<boolean>(false);
    const [usernameError, setUsernameError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [isSubmitting, setLoading] = useState<boolean | string>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    // tf2 way of getting loading status for error
    const submitRef = useRef(isSubmitting)
    submitRef.current = isSubmitting;

    useEffect(() => {
        document.body.style.backgroundColor = COLORS.BACKGROUND;
    })

    useEffect(() => {
        if (errors) {
            errors![0].field === "email" ? setEmailError(true) : setEmailError(false);
            errors![0].field === "username" ? setUsernameError(true) : setUsernameError(false);
            errors![0].field === "password" ? setPasswordError(true) : setPasswordError(false);
        }
    }, [errors])

    // error logging
    // useEffect(() => {
    //     console.log(errors);
    // }, [errors])

    useEffect(() => {
        setTimeout(() => {
            if (isSubmitting) {
                setErrors([ERROR.TIME_OUT]);
                setLoading(false);
            }
        }, API_TIMEOUT)
    }, [isSubmitting])

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (info.email === "") {
            setErrors([ERROR.EMAIL_NOT_PROVIDED])
            return;
        }
        if (info.username === "") {
            setErrors([ERROR.USERNAME_NOT_PROVIDED])
            return;
        }
        if (info.password === "") {
            setErrors([ERROR.PASSWORD_NOT_PROVIDED])
            return;
        }
        if (confirmPassword === "" || confirmPassword !== info.password) {
            setErrors([ERROR.PASSWORD_MISMATCH])
            return;
        }

        const email = validateEmail(info.email)
        const username = validateUsername(info.username)
        const password = validatePassword(info.password)

        if (!email) {
            setErrors([ERROR.INVALID_EMAIL])
            return;
        }
        if (!username) {
            setErrors([ERROR.INVALID_USERNAME])
            return;
        }
        if (!password) {
            setErrors([ERROR.INVALID_PASSWORD_REGEX])
            return;
        }

        setLoading(true);
        const response = await register(info);
        if (response.data) setLoading(false);
        if (response.data?.register.errors) {
            setErrors(response.data.register.errors)
        }
    }

    return (
        <>
            <FormAlertWrapper>
                {errors !== undefined && errors.length > 0 ? <Error message={errors![0].message} /> : null}
            </FormAlertWrapper>
            <FormNavWrapper>
                <FormHeaderWrapper>
                    <FormHeaderText>Sign Up</FormHeaderText>
                </FormHeaderWrapper>
                <FormInputWrapper>
                    <Input error={emailError} onChange={(e) => setInfo({ ...info, email: e.target.value })} type="email" value={info.email} placeholder="Email" />
                    <Input error={usernameError} onChange={(e) => setInfo({ ...info, username: e.target.value })} type="username" value={info.username} placeholder="Username" />
                    <Input error={passwordError} onChange={(e) => setInfo({ ...info, password: e.target.value })} type="password" value={info.password} placeholder="Password" />
                    <Input error={passwordError} onChange={(e) => setConfirmPassword(e.target.value)} type="password" value={confirmPassword} placeholder="Confirm Password" />
                    <Button loading={isSubmitting ? '1' : '0'} type="submit" onClick={handleSubmit}>Register</Button>
                    <FormText>Already have an account? <Link href="/login">Log in</Link>!</FormText>
                </FormInputWrapper>
            </FormNavWrapper>
        </>
    );
}





const RegisterInitialValues = {
    email: '',
    username: '',
    password: ''
}

export default Register;
