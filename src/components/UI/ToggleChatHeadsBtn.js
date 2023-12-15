import React from 'react';
import classes from './ToggleChatHeadsBtn.module.css';
import { Plus } from '../../assets/icons/Plus';
import { Minus } from '../../assets/icons/Minus';

const ToggleChatHeadsBtn = ({ onClick, showChatHeads }) => {
  return (
    <div className={classes['icon-wrapper']} onClick={onClick}>
      {showChatHeads ? <Minus /> : <Plus />}
    </div>
  );
};

export default ToggleChatHeadsBtn;
