import React from "react";
import ReactDOM from "react-dom";
import FocusTrap from "focus-trap-react";
import styled from "styled-components";

const ModalArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2.5em 0 0;
  border-radius: 4px;
  border: none;
  background-color: #ffffff;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 600px) {
    padding: 2.5em 1.5em 1.5em 1.5em;
    left: 50%;
    top: 50%;
    height: auto;
    transform: translate(-50%, -50%);
    max-width: 30em;
    max-height: calc(100% - 1em);
  }
`;

export const Modal = ({
  onClickOutside,
  onKeyDown,
  modalRef,
  buttonRef,
  closeModal,
  children,
}) => {
  return ReactDOM.createPortal(
    <FocusTrap>
      <aside
        tag="aside"
        role="dialog"
        tabIndex="-1"
        aria-modal="true"
        className="modal-cover"
        onClick={onClickOutside}
        onKeyDown={onKeyDown}
      >
        <ModalArea ref={modalRef}>
          <button
            ref={buttonRef}
            aria-label="Close Modal"
            aria-labelledby="close-modal"
            className="_modal-close"
            onClick={closeModal}
          >
            <span id="close-modal" className="_hide-visual">
              Close
            </span>
            <svg className="_modal-close-icon" viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
          <div className="modal-body">{children}</div>
        </ModalArea>
      </aside>
    </FocusTrap>,
    document.body
  );
};

export default Modal;
