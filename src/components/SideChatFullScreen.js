import React from 'react';
import classes from './SideChatFullScreen.module.css';
import placeholder from '../assets/img/placeholder.png';
import { Close } from '../assets/icons/Close';

const SideChatFullScreen = (props) => {
  const { onSelectChat, logo, chatName, unreadMessages, onClose } = props;

  return (
    <div className={classes['active-chat-side']} onClick={onSelectChat}>
      <div className={classes['chat-and-logo-side']}>
        <div className={classes['logo-container-side']}>
          <img
            src={logo}
            alt={chatName}
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
          <Close height="20px" className={classes['icon-side']} fill="gray" />
        </div>
      </div>
    </div>
  );
};

export default SideChatFullScreen;
