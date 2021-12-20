import styled from "styled-components";
import { COLORS } from "util/consts";

const Button = styled.button<{ loading?: string }>`
    margin: 5%;
    height: 10%;
    width: 35%;
    border: none;
    padding: none;
    cursor: ${props => (props.loading === '1' ? 'cursor' : 'pointer')};
    border-radius: 35px;
    box-sizing: none;
    background-color: ${props => (props.loading === '1' ? COLORS.BUTTON_HOVER : COLORS.BUTTON)};
    color: ${COLORS.TEXT};
    transition: 500ms;

    :hover {
        background-color: ${COLORS.BUTTON_HOVER}
    }
`

export default Button;