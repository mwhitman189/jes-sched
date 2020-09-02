import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: ${({ isCheckbox }) => (isCheckbox ? 'row' : 'column')};
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin: 30px 10px 0 0;
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 160px;
  }
`;

const InputLabel = styled.label`
  color: ${({ theme }) => theme.colors.primaryText};
  position: ${({ isCheckbox }) => (isCheckbox ? 'relative' : 'absolute')};
  ${({ isCheckbox }) => !isCheckbox && { transform: 'translateY(-22px)' }}
  font-size: ${({ isCheckbox }) => (isCheckbox ? '1rem' : '0.6rem')};
  margin: ${({ isCheckbox }) => (isCheckbox ? '0 10px 0 5px' : 0)};
  ${({ isCheckbox }) => !isCheckbox && { alignSelf: 'start' }}
`;

const Label = styled.p`
  font-size: 0.7rem;
`;

const Error = styled(Label)`
  color: ${({ theme }) => theme.colors.alert};
`;

function FormInput({ label, error, children }) {
  const isCheckbox = children.type.name === 'Checkbox';

  return (
    <Container isCheckbox={isCheckbox}>
      {isCheckbox ? (
        <>
          {children}
          <InputLabel htmlFor={children.id} isCheckbox={isCheckbox}>
            {label}
          </InputLabel>
        </>
      ) : (
        <>
          <InputLabel htmlFor={children.id}>
            {error ? <Error>{error}</Error> : <Label>{label}</Label>}
          </InputLabel>
          {children}
        </>
      )}
    </Container>
  );
}

export default FormInput;
