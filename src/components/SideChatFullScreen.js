import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import classes from './SideChatFullScreen.module.css';

const SideChatFullScreen = (props) => {
  return (
    <div className={classes['active-chat-side']} onClick={props.onClick}>
      <div className={classes['chat-and-logo-side']}>
        <div className={classes['logo-container-side']}>
          <img src={props.logo} alt="img" />
        </div>
        <h2>{props.chatName}</h2>
      </div>
      <div className={classes['badges-container-side']} onClick={(e) => e.stopPropagation()}>
        {props.unreadMessages > 0 && (
          <div className={`${classes['badge-wrapper']} ${classes['unread-messages-badge']}`}>
            {props.unreadMessages}
          </div>
        )}
        <div className={classes['badge-wrapper']} onClick={props.onClose}>
          <AiOutlineClose className={classes['icon-side']} />
        </div>
      </div>
    </div>
  );
};

export default SideChatFullScreen;
