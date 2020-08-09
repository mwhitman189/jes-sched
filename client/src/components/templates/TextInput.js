import React from "react";
import styled from "styled-components";
import STYLES from "../../constants/styles";

const Input = styled.input`
  color: ${STYLES.color_primaryText};
  height: 25px;
  border-radius: 4px;
`;

function TextInput({ name, value, setValue }) {
  return <Input name={name} type="text" value={value} onChange={setValue} />;
}

export default TextInput;
