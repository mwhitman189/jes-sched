import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isCheckbox ? "row" : "column")};
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin: 30px 10px 0 0;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 160px;
  }
`;

const InputLabel = styled.label`
  color: ${(props) => props.theme.colors.primaryText};
  position: ${(props) => (props.isCheckbox ? "relative" : "absolute")};
  ${(props) => !props.isCheckbox && { transform: "translateY(-22px)" }}
  font-size: ${(props) => (props.isCheckbox ? "1rem" : "0.6rem")};
  margin: ${(props) => (props.isCheckbox ? "0 10px 0 5px" : 0)};
  ${(props) => !props.isCheckbox && { alignSelf: "start" }}
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
