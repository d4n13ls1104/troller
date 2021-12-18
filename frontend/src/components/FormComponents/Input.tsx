import styled from "styled-components";
import { COLORS } from "util/consts";

const Input = styled.input`
    margin: 2%;
    height: 9%;
    width: 60%;
    border-radius: 10px;
    padding-left: 10px;
    border: none;
    background-color: ${COLORS.INPUT}
`

export default Input;