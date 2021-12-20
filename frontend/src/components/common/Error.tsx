import React from "react";
import styled from "styled-components";
import { COLORS } from "util/consts";

const Error: React.FC<{ message: string }> = ({ message }) => {
    return (
        <>
            <ErrorWrapper>
                <p>{message}</p>
            </ErrorWrapper>
        </>
    );
}

const ErrorWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30%;
    width: 18%;
    padding-left: 10px;
    border-radius 5px;
    border: solid;
    border-width: 3px;
    border-color: red;
    background-color: #b52016;
    color: ${COLORS.TEXT};
`

export default Error;