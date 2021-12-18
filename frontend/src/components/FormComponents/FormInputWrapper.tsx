import styled from "styled-components";
import { COLORS } from "util/consts";

const FormInputWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 5%;
    height: 100%;
    width: 100%;
    color: ${COLORS.TEXT};
`

export default FormInputWrapper;