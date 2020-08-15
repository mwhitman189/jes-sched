import React from "react";
import styled from "styled-components";

const Button = styled.button`
  display: ${(props) => props.theme.btnStyles.display};
  cursor: ${(props) => props.theme.btnStyles.cursor};
  justify-content: ${(props) => props.theme.btnStyles.justifyContent};
  align-items: ${(props) => props.theme.btnStyles.alignItems};
  font-weight: ${(props) => props.theme.btnStyles.fontWeight};
  text-transform: ${(props) => props.theme.btnStyles.textTransform};
  color: ${(props) => props.theme.btnStyles.color};
  background: ${(props) =>
    props.background ? props.background : props.theme.colors.primary};
  border: ${(props) => props.theme.btnStyles.border};
  border-radius: ${(props) => props.theme.btnStyles.borderRadius};
  height: ${(props) => props.theme.btnStyles.height};
  margin: ${(props) => props.theme.btnStyles.margin};
  width: 100%;
  justify-content: ${(props) =>
    props.justification ? props.justification : "flex-start"};

  &:hover {
    background: ${(props) =>
      props.hoverBackground ? props.hoverBackground : "#2b69cc"};
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    width: ${(props) => (props.width ? props.width : "90px")};
    margin: 0 4px;
    justify-content: center;
  }
`;

const ModalTrigger = ({ triggerIcon, triggerText, buttonRef, showModal }) => {
  return (
    <Button ref={buttonRef} onClick={showModal}>
      <span className="material-icons">{triggerIcon}</span>
      {triggerText}
    </Button>
  );
};
export default ModalTrigger;
