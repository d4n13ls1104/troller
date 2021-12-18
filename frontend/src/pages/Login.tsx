import Link from "components/common/Link";
import Button from "components/FormComponents/Button";
import FormHeaderText from "components/FormComponents/FormHeaderText";
import FormHeaderWrapper from "components/FormComponents/FormHeaderWrapper";
import FormInputWrapper from "components/FormComponents/FormInputWrapper";
import FormText from "components/FormComponents/FormText";
import FormNavWrapper from "components/FormComponents/FormWrapper";
import Input from "components/FormComponents/Input";
import React, { useEffect } from "react";
import { COLORS } from "util/consts";



const Login: React.FC = () => {
    useEffect(() => {
        document.body.style.backgroundColor = COLORS.BACKGROUND;
    })

    return (
        <>
            <FormNavWrapper>
                <FormHeaderWrapper>
                    <FormHeaderText>Log In</FormHeaderText>
                </FormHeaderWrapper>
                <FormInputWrapper>
                    <Input type="email" placeholder="example@example.com"/>
                    <Input type="password" placeholder="Password"/>
                    <Button>Log In</Button>
                    <FormText>Don't have an account? <Link href="/register">Sign up</Link>!</FormText>
                    <Link href="/">Forgot Password</Link>
                </FormInputWrapper>
            </FormNavWrapper>
        </>
    );
}

export default Login;