import React, { Component } from "react";
import { Modal } from "./Modal";
import TriggerButton from "./ModalTrigger";

export class ModalContainer extends Component {
  state = { isShown: false };

  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
      this.toggleScrollLock();
    });
  };

  closeModal = () => {
    this.setState({ isShown: false });
    this.TriggerButton.focus();
    this.toggleScrollLock();
  };

  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  onClickOutside = (event) => {
    if (this.modal && event.target !== this.modal) return this.closeModal();
  };

  toggleScrollLock = () => {
    document.querySelector("html").classList.toggle("scroll-lock");
  };

  render() {
    return (
      <>
        <TriggerButton
          showModal={this.showModal}
          buttonRef={(n) => (this.TriggerButton = n)}
          triggerIcon={this.props.triggerIcon}
          triggerText={this.props.triggerText}
        />

        {this.state.isShown ? (
          <Modal
            onSubmit={this.props.onSubmit}
            modalRef={(n) => (this.modal = n)}
            buttonRef={(n) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
          >
            {this.props.children}
          </Modal>
        ) : null}
      </>
    );
  }
}
export default ModalContainer;
