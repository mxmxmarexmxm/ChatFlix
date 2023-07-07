import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import classes from './SideChatFullScreen.module.css';
import placeholder from '../assets/img/placeholder.png';

const SideChatFullScreen = (props) => {
  const { onSelectChat, logo, chatName, unreadMessages, onClose } = props;

  return (
    <div className={classes['active-chat-side']} onClick={onSelectChat}>
      <div className={classes['chat-and-logo-side']}>
        <div className={classes['logo-container-side']}>
          <img
            src={logo}
            alt="img"
            onError={(e) => {
              e.target.src = placeholder;
            }}
          />
        </div>
        <h2 className={classes.title}>{chatName}</h2>
      </div>
      <div
        className={classes['badges-container-side']}
        onClick={(e) => e.stopPropagation()}
      >
        {!!unreadMessages > 0 && (
          <div
            className={`${classes['badge-wrapper']} ${classes['unread-messages-badge']}`}
          >
            {unreadMessages < 99 ? unreadMessages : '99+'}
          </div>
        )}
        <div className={classes['badge-wrapper']} onClick={onClose}>
          <AiOutlineClose className={classes['icon-side']} />
        </div>
      </div>
    </div>
  );
};

export default SideChatFullScreen;
