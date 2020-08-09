import React from "react";
import styled from "styled-components";
import STYLES from "../../constants/styles";

const Container = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isCheckbox ? "row" : "column")};
  justify-content: center;
  align-items: center;
`;

const InputLabel = styled.label`
  color: ${STYLES.color_primaryText};
  position: ${(props) => (props.isCheckbox ? "relative" : "absolute")};
  font-size: ${(props) => (props.isCheckbox ? "1rem" : "0.6rem")};
  margin: ${(props) => (props.isCheckbox ? "0 10px 0 5px" : 0)};
`;

function FormInput({ label, children }) {
  const isCheckbox = children.type.name === "Checkbox";

  return (
    <Container isCheckbox={isCheckbox}>
      {isCheckbox ? (
        <>
          {children}
          <InputLabel htmlFor={children.props.id} isCheckbox={isCheckbox}>
            {label}
          </InputLabel>
        </>
      ) : (
        <>
          <InputLabel htmlFor={children.props.id}>{label}</InputLabel>
          {children}
        </>
      )}
    </Container>
  );
}

export default FormInput;
