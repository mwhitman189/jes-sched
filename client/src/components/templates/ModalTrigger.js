import React from "react";
import styled from "styled-components";

const Button = styled.button`
  display: ${({ theme }) => theme.btnStyles.display};
  cursor: ${({ theme }) => theme.btnStyles.cursor};
  justify-content: ${({ theme }) => theme.btnStyles.justifyContent};
  align-items: ${({ theme }) => theme.btnStyles.alignItems};
  font-weight: ${({ theme }) => theme.btnStyles.fontWeight};
  text-transform: ${({ theme }) => theme.btnStyles.textTransform};
  color: ${({ theme }) => theme.btnStyles.color};
  background: ${({ background, theme }) =>
    background ? background : theme.colors.primary};
  border: ${({ theme }) => theme.btnStyles.border};
  border-radius: ${({ theme }) => theme.btnStyles.borderRadius};
  height: ${({ theme }) => theme.btnStyles.height};
  margin: ${({ theme }) => theme.btnStyles.margin};
  width: 100%;
  justify-content: ${({ justification }) =>
    justification ? justification : "center"};

  &:hover {
    background: ${({ hoverBackground }) =>
      hoverBackground ? hoverBackground : "#2b69cc"};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: ${({ width }) => (width ? width : "90px")};
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
