import React from "react";
import styled from "styled-components";

const Dialog = styled.dialog`
  position: absolute;
  background-color: #f0f0f0;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  width: 260px;
  margin: 0 auto;
  border: none;
  top: 20%;
  z-index: 2000;
  border-radius: 4px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
`;

const ButtonContainer = styled.div`
  padding: 5px;
  margin: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Button = styled.button`
  display: flex;
  cursor: pointer;
  justify-content: center;
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
    <Dialog id="dialog" isOpen={isOpen}>
      <ButtonContainer>
        {items.map((i) => (
          <Button key={i.title} onClick={() => selectItem(i)}>
            {i.title}
          </Button>
        ))}
      </ButtonContainer>
    </Dialog>
  );
}
export default NewEntryDialog;
