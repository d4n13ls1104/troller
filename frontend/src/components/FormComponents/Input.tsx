import styled from "styled-components";
import { COLORS } from "util/consts";

const Input = styled.input<{ error?: boolean }>`
    margin: 1%;
    height: 9%;
    width: 60%;
    border-radius: 7px;
    padding-left: 10px;
    border: none;
    outline-style: ${props => (props.error === true ? 'solid' : 'none')};
    outline-width: 3px;
    outline-color: red;
    background-color: ${COLORS.INPUT}
`

export default Input;