import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import classes from './SideChatFullScreen.module.css';
import placeholder from '../assets/img/placeholder.png';

const SideChatFullScreen = (props) => {
  return (
    <div className={classes['active-chat-side']} onClick={props.onSelectChat}>
      <div className={classes['chat-and-logo-side']}>
        <div className={classes['logo-container-side']}>
          <img
            src={props.logo}
            alt="img"
            onError={(e) => {
              e.target.src = placeholder;
            }}
          />
        </div>
        <h2 className={classes.title}>{props.chatName}</h2>
      </div>
      <div
        className={classes['badges-container-side']}
        onClick={(e) => e.stopPropagation()}
      >
        {props.unreadMessages > 0 && (
          <div
            className={`${classes['badge-wrapper']} ${classes['unread-messages-badge']}`}
          >
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
