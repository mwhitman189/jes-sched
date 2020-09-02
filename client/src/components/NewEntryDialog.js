import React from 'react';
import styled from 'styled-components';

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
  background: ${({ background }) => (background || '#4287f5')};
  border: none;
  border-radius: 4px;
  margin: 3px 4px;
  height: 40px;
  width: ${({ width }) => (width || '160px')};
  &:hover {
    background: ${({ hoverBackground }) => (hoverBackground || '#2b69cc')};
  }
`;

function NewEntryDialog(props) {
  const { items } = props;

  const selectItem = (item) => {
    item.onClickEvent();
  };

  return (
    <ButtonContainer id="button-container">
      {items.map((i) => (
        <Button key={i.title} onClick={() => selectItem(i)}>
          <span className="material-icons">person</span>
          {i.title}
        </Button>
      ))}
    </ButtonContainer>
  );
}
export default NewEntryDialog;
