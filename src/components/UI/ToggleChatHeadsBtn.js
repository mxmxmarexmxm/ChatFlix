import React from 'react';
import { BsDashSquareFill, BsPlusSquareFill } from 'react-icons/bs';
import classes from './ToggleChatHeadsBtn.module.css';

const ToggleChatHeadsBtn = (props) => {
  return (
    <div className={classes['icon-wrapper']} onClick={props.onClick}>
      {props.showChatHeads ? (
        <BsDashSquareFill className={classes.icon} />
      ) : (
        <BsPlusSquareFill className={classes.icon} />
      )}
    </div>
  );
};

export default ToggleChatHeadsBtn;
