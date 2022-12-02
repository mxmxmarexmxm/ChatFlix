import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import classes from './ChatHead.module.css';

const ChatHead = (props) => {
  const unreadMessagesNum = props.unreadMessages +1;

  return (
    <div className={classes['chat-head-mini']} onClick={props.onClick}>
      {unreadMessagesNum !== 0 && (
        <span className={classes.unreadMessages}>{unreadMessagesNum}</span>
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
