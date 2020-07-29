import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Content = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  color: #f2f0f0;
  font-size: 1rem;
  position: absolute;
  background: #cc3300;
  height: 60px;
  width: 100%;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.5);
  z-index: 1000;
  @media (min-width: 768px) {
    border-radius: 4px;
    width: 200px;
    margin-top: 40px;
  }
`;

export default function Snackbar(props) {
  const { msg, isOpen, setIsOpen } = props;

  if (isOpen)
    setTimeout(function () {
      setIsOpen(false);
    }, 3500);

  return (
    <Container>
      <Content isOpen={isOpen}>{msg}</Content>
    </Container>
  );
}

Snackbar.propTypes = {
  msg: PropTypes.string,
};
