import React from 'react';
import classes from './Modal.module.css';
import logo from '../../assets/img/logo.png';

const Modal = (props) => {
  if (!props.visible) {
    return;
  }
  
  return (
    <div className={classes.dark}>
      <div className={classes.modal}>
        <div className={classes['logo-wrapper']}>
          <img src={logo} alt="logo" />
        </div>
        <h2>{props.title}</h2>
        <div className={classes.actions}>
          <button className="toggle-button" onClick={props.onClose}>
            Close
          </button>
          <button onClick={props.onConfirm}>{props.confirmTitle || "Confirm"}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
