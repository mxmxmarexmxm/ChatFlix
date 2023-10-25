import React from 'react';
import classes from './ChatHead.module.css';
import placehoder from '../../assets/img/placeholder.png';
import { Close } from '../../assets/icons/Close';
import useUnreadMessages from '../../hooks/useUnreadMessages';

const ChatHead = ({ chat, onSelectChat, closeChat }) => {
  const { unreadMessages } = useUnreadMessages(chat.name);
  return (
    <div className={classes['chat-head']} onClick={onSelectChat}>
      <div className={classes['badges-container']}>
        {!!unreadMessages && (
          <div className={classes['unread-messages']}>
            <span>{unreadMessages < 99 ? unreadMessages : '99+'}</span>
          </div>
        )}
        <div
          className={classes['close-icon-wrapper']}
          onClick={(e) => e.stopPropagation()}
        >
          <Close onClick={closeChat} className={classes['close-icon']} />
        </div>
      </div>
      <div className={classes['logo-wrappper']}>
        <img
          src={chat.logo}
          alt="chat head"
          onError={(e) => {
            e.target.src = placehoder;
          }}
        />
      </div>
    </div>
  );
};

export default ChatHead;
