import React from "react";
import styled from "styled-components";
import BREAKPOINTS from "../../constants/breakpoints";
import STYLES from "../../constants/styles";

const Input = styled.input`
  color: ${STYLES.color_primaryText};
  height: 25px;
  border-radius: 4px;
  border: ${STYLES.color_secondaryBackground} solid 2px;
  width: 100%;
  border: ${STYLES.color_secondaryBackground} solid 2px;
  @media (min-width: ${BREAKPOINTS.md}) {
    width: 160px;
  }
`;

function TextInput({ name, value, setValue }) {
  return <Input name={name} type="text" value={value} onChange={setValue} />;
}

export default TextInput;
