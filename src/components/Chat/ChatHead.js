import React from 'react';
import classes from './ChatHead.module.css';
import placehoder from '../../assets/img/placeholder.png';
import { Close } from '../../assets/icons/Close';
import useChatMessages from '../../hooks/useChatMessages';
import { useChatContext } from '../../context/ChatContext';

const ChatHead = ({ chat }) => {
  const { unreadMessages } = useChatMessages(chat.name);
  const { selectChatHandler, closeChatHandler } = useChatContext();
  return (
    <div
      className={classes['chat-head']}
      onClick={() => selectChatHandler(chat)}
    >
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
          <Close
            onClick={() => closeChatHandler(chat.id)}
            className={classes['close-icon']}
          />
        </div>
      </div>
      <div className={classes['logo-wrappper']}>
        <img
          src={chat.logo}
          alt={chat.name}
          onError={(e) => {
            e.target.src = placehoder;
          }}
        />
      </div>
    </div>
  );
};

export default ChatHead;
