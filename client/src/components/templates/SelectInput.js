import React from "react";
import styled from "styled-components";
import BREAKPOINTS from "../../constants/breakpoints";
import STYLES from "../../constants/styles";

const Input = styled.select`
  color: ${STYLES.color_primaryText};
  border-radius: 4px;
  background-color: #fff;
  padding: 4px 0;
  width: 100%;
  border: ${STYLES.color_secondaryBackground} solid 2px;
  @media (min-width: ${BREAKPOINTS.md}) {
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
