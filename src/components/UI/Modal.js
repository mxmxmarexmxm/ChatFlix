import React, { useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import classes from './Modal.module.css';
import { Close } from '../../assets/icons/Close';

const Modal = () => {
  const { modalVisible, closeModal, modalContent } = useModal();

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [closeModal]);

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
