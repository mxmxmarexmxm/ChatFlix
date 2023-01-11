import React from 'react';
import classes from './Modal.module.css';

const Modal = (props) => {
  if (!props.show) {
    return;
  }
  
  return (
    <div className={classes.dark}>
      <div className={classes.modal}>
        <h2>Are you realy want to logout ? </h2>
        <div className={classes.actions}>
          <button className="toggle-button" onClick={props.onClose}>
            Close
          </button>
          <button onClick={props.onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
