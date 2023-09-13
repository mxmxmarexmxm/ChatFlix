import React from 'react';
import { useModal } from '../../context/ModalContext';
import classes from './Modal.module.css';

const Modal = (props) => {
  const { modalVisible, closeModal } = useModal();

  return (
    modalVisible && (
      <div className={classes.modal}>
        <div className={classes['modal-content']}>
          <button onClick={closeModal} className={classes['close-button']}>
            x
          </button>
          {props.children}
        </div>
      </div>
    )
  );
};

export default Modal;
