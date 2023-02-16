import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import classes from './ChatHead.module.css';

const ChatHead = (props) => {
  const unreadMessagesClasses = props.unreadMessages > 0 ? classes.unreadMessages : classes.hidden;

  return (
    <div className={classes['chat-head-mini']} onClick={props.onSelectChat}>
      <div className={classes['badges-container']}>
        <div className={unreadMessagesClasses}>
          <span>{props.unreadMessages}</span>
        </div>
        <div className={classes['icon-wrapper']} onClick={(e) => e.stopPropagation()}>
          <AiOutlineClose onClick={props.onClose} className={classes['close-icon-mini']} />
        </div>
      </div>
      <div className={classes['image-wrappper']}>
        <img src={props.logo} alt="chat head" />
      </div>
    </div>
  );
};

export default ChatHead;
