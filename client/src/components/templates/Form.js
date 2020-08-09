import React from "react";
import styled from "styled-components";
import STYLES from "../../constants/styles";

const Form = styled.form`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  color: ${STYLES.primaryText};
  margin: 1rem 0 0 2rem;
  align-self: flex-start;
  padding: 0 0 10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

function FormTemplate({ title, submitAction, children }) {
  return (
    <Form onSubmit={submitAction}>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Form>
  );
}

export default FormTemplate;
