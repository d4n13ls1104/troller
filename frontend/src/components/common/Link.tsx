import styled from "styled-components";
import { COLORS } from "util/consts";

const Link = styled.a`
    text-decoration: none;
    color: ${COLORS.ACCENT};
    transition: 100ms;

    :hover {
        color: ${COLORS.ACCENT2};
    }
`

export default Link;