import styled from "styled-components";
import { COLORS } from "util/consts";

const FormWrapper = styled.div`
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    height: 55%;
    width: 25%;
    flex-direction:column;
    background-color: ${COLORS.FOREGROUND};
    border-radius: 25px;
`

export default FormWrapper;