import React from 'react';
import classes from './ToggleChatHeadsBtn.module.css';
import { Plus } from '../../assets/icons/Plus';
import { Minus } from '../../assets/icons/Minus';

const ToggleChatHeadsBtn = (props) => {
  return (
    <div className={classes['icon-wrapper']} onClick={props.onClick}>
      {props.showChatHeads ? (
        <Minus height="50px" className={classes.icon} />
      ) : (
        <Plus height="50px" className={classes.icon} />
      )}
    </div>
  );
};

export default ToggleChatHeadsBtn;
