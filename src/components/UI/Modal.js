import React from 'react';
import { useModal } from '../../context/ModalContext';
import classes from './Modal.module.css';
import { Close } from '../../assets/icons/Close';

const Modal = () => {
  const { modalVisible, closeModal, modalContent } = useModal();

  return (
    modalVisible && (
      <div className={classes.modal}>
        <div className={classes['modal-content']}>
          <button onClick={closeModal} className={classes['close-button']}>
            <Close height="20px" />
          </button>
          {modalContent}
        </div>
      </div>
    )
  );
};

export default Modal;
