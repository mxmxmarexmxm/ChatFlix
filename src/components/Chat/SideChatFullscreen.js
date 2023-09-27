import React from 'react';
import classes from './SideChatFullscreen.module.css';
import placeholder from '../../assets/img/placeholder.png';
import { Close } from '../../assets/icons/Close';

const SideChatFullscreen = ({
  onSelectChat,
  logo,
  name,
  unreadMessages,
  onClose,
}) => {
  return (
    <div className={classes['side-chat-fullscreen']} onClick={onSelectChat}>
      <div className={classes['title-and-logo-side']}>
        <div className={classes['logo-container-side']}>
          <img
            src={logo}
            alt={name}
            onError={(e) => {
              e.target.src = placeholder;
            }}
          />
        </div>
        <h2>{name}</h2>
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
          <Close height="20px" className={classes['close-icon-side']} fill="gray" />
        </div>
      </div>
    </div>
  );
};

export default SideChatFullscreen;
