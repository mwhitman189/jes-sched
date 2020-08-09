import React from "react";
import styled from "styled-components";

const Input = styled.input`
  cursor: pointer;
  margin: 0;
  padding: 0;
  width: 20px;
  height: 20px;
`;

function Checkbox({ name, isChecked, handleToggle }) {
  return (
    <Input
      name={name}
      type="checkbox"
      checked={isChecked}
      onChange={handleToggle}
    />
  );
}

export default Checkbox;
