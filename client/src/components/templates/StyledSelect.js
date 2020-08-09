import React from "react";
import ReactSelect from "react-select";
import styled from "styled-components";
import STYLES from "../../constants/styles";
import BREAKPOINTS from "../../constants/breakpoints";

const StyledSelect = styled(ReactSelect)`
  height: 30px;
  & > div {
    color: ${STYLES.color_primaryText};
    border-radius: 4px;
    background-color: #fff;
    width: 100%;
    border: ${STYLES.color_secondaryBackground} solid 2px;
    @media (min-width: ${BREAKPOINTS.md}) {
      width: 160px;
    }
  }
`;

export default (props) => <StyledSelect {...props} />;
