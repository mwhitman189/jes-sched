import React from "react";
import ReactSelect from "react-select";
import styled from "styled-components";

const StyledSelect = styled(ReactSelect)`
  height: 30px;
  & > div {
    color: ${(props) => props.theme.colors.primaryText};
    border-radius: 4px;
    background-color: #fff;
    width: 100%;
    border: ${(props) => props.theme.colors.secondaryBackground} solid 2px;
    @media (min-width: ${(props) => props.theme.breakpoints.md}) {
      width: 160px;
    }
  }
`;

export default (props) => <StyledSelect {...props} />;
