import React, { useEffect } from "react";
import styled from "styled-components";

const Dialog = styled.dialog`
  position: absolute;
  background-color: #f0f0f0;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  width: 260px;
  margin: 0 auto;
  border: none;
  top: 20%;
  z-index: 4;
  border-radius: 4px;
  box-shadow: ${(props) => props.theme.effects.shadow};
`;

const ButtonContainer = styled.div`
  padding: 5px;
  margin: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Button = styled.button`
  display: flex;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;
  font-weight: 800;
  text-transform: uppercase;
  color: #fff;
  background: ${(props) => (props.background ? props.background : "#4287f5")};
  border: none;
  border-radius: 4px;
  margin: 3px 4px;
  height: 40px;
  width: ${(props) => (props.width ? props.width : "160px")};
  &:hover {
    background: ${(props) =>
      props.hoverBackground ? props.hoverBackground : "#2b69cc"};
  }
`;

function NewEntryDialog(props) {
  const { items, isOpen, closeDialog } = props;

  const selectItem = (item) => {
    item.onClickEvent();
    closeDialog();
  };

  return (
    <Dialog id="dialog" role="dialog" aria-labelledby="dialog" isOpen={isOpen}>
      <ButtonContainer id="button-container">
        {items.map((i) => (
          <Button key={i.title} onClick={() => selectItem(i)}>
            <span class="material-icons">person</span>
            {i.title}
          </Button>
        ))}
      </ButtonContainer>
    </Dialog>
  );
}
export default NewEntryDialog;
