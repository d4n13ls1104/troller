import styled from "styled-components";
import { COLORS } from "util/consts";

const Button = styled.button`
    margin: 5%;
    height: 10%;
    width: 35%;
    border: none;
    padding: none;
    cursor: pointer;
    border-radius: 35px;
    background-color: ${COLORS.BUTTON};
    color: ${COLORS.TEXT};
    transition: 500ms;

    :hover {
        background-color: ${COLORS.BUTTON_HOVER}
    }
`

export default Button;