import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import classes from './ChatHead.module.css';

const ChatHead = (props) => {

  return (
    <div className={classes['chat-head-mini']} onClick={props.onClick}>
      {props.unreadMessages !== 0 && (
        <span className={classes.unreadMessages}>{props.unreadMessages}</span>
      )}
      <div onClick={props.readMessages}>
        <img src={props.logo} alt='chat head' />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <AiOutlineClose
          onClick={props.onClose}
          className={classes['close-icon-mini']}
        />
      </div>
    </div>
  );
};

export default ChatHead;
