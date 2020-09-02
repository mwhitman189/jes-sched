import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  color: ${(props) => props.theme.colors.primaryText};
  height: 25px;
  border-radius: 4px;
  border: ${(props) => props.theme.colors.secondaryBackground} solid 2px;
  width: 100%;
  border: ${(props) => props.theme.colors.secondaryBackground} solid 2px;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 160px;
  }
`;

function TextInput({ name, value, setValue }) {
  return <Input name={name} type="text" value={value} onChange={setValue} />;
}

export default TextInput;
