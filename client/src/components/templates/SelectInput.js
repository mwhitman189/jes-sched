import React from "react";
import styled from "styled-components";

const Input = styled.select`
  color: ${(props) => props.theme.colors.primaryText};
  border-radius: 4px;
  background-color: #fff;
  padding: 4px 0;
  width: 100%;
  border: ${(props) => props.theme.colors.secondaryBackground} solid 2px;
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    width: 160px;
  }
`;

const Option = styled.option``;

function SelectInput({
  name,
  currValue,
  listItems,
  setValue,
  valueKey,
  nameKey,
}) {
  return (
    <Input name={name} value={currValue} onChange={setValue}>
      {listItems.map((item) => (
        <Option key={`${name}-${item[valueKey]}`} value={item[valueKey]}>
          {item[nameKey]}
        </Option>
      ))}
    </Input>
  );
}

export default SelectInput;
