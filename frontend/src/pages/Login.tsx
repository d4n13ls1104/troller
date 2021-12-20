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
import { FieldError, useLoginMutation } from "generated/graphql";
import React, { useEffect, useRef, useState } from "react";
import { LoginType } from "types/UserEntry";
import { API_TIMEOUT, COLORS } from "util/consts";
import * as ERROR from "util/errors"



const Login: React.FC = () => {
    const [, login] = useLoginMutation();
    const [info, setInfo] = useState<LoginType>(LoginInitialValues);
    const [errors, setErrors] = useState<FieldError[]>();
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [isSubmitting, setLoading] = useState<boolean | string>(false);
    // tf2 way of getting loading status for error
    const submitRef = useRef(isSubmitting)
    submitRef.current = isSubmitting;

    useEffect(() => {
        document.body.style.backgroundColor = COLORS.BACKGROUND;
    })

    useEffect(() => {
        if (errors) {
            errors![0].field === "email" ? setEmailError(true) : setEmailError(false);
            errors![0].field === "password" ? setPasswordError(true) : setPasswordError(false);
        }
    }, [errors])

    // error logging
    // useEffect(() => {
    //     console.log(errors);
    // }, [errors])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (submitRef.current) {
                setErrors([ERROR.TIME_OUT]);
                setLoading(false);
            }
        }, API_TIMEOUT)
        return () => clearTimeout(timer)
    }, [isSubmitting])

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (info.email === "") {
            setErrors([ERROR.EMAIL_NOT_PROVIDED])
            return;
        }
        if (info.password === "") {
            setErrors([ERROR.PASSWORD_NOT_PROVIDED])
            return;
        }
        setLoading(true);
        const response = await login(info);
        if (response.data) setLoading(false);
        if (response.data?.login.errors) setErrors(response.data.login.errors);
    }

    return (
        <>
            <FormAlertWrapper>
                {errors !== undefined && errors.length > 0 ? <Error message={errors![0].message} /> : null}
            </FormAlertWrapper>
            <FormNavWrapper>
                <FormHeaderWrapper>
                    <FormHeaderText>Log In</FormHeaderText>
                </FormHeaderWrapper>
                <FormInputWrapper>
                    <Input error={emailError} onChange={(e) => setInfo({ ...info, email: e.target.value })} type="email" value={info.email} placeholder="Email" />
                    <Input error={passwordError} onChange={(e) => setInfo({ ...info, password: e.target.value })} type="password" value={info.password} placeholder="Password" />
                    <Button loading={isSubmitting ? '1' : '0'} type="submit" onClick={handleSubmit}>Log In</Button>
                    <FormText>Don't have an account? <Link href="/register">Sign up</Link>!</FormText>
                    <Link href="/">Forgot Password</Link>
                </FormInputWrapper>
            </FormNavWrapper>
        </>
    );
}





const LoginInitialValues = {
    email: '',
    password: ''
}

export default Login;
