import React from 'react';
import useChatMessages from '../hooks/useChatMessages';
import classes from './UnreadFavChatBadge.module.css';

const UnreadFavChatBadge = ({ chat }) => {
  const { unreadMessages } = useChatMessages(chat.name);

  return (
    <>
      {unreadMessages > 0 && (
        <div className={classes['unread-fav-chat-badge']}>
          <span>{unreadMessages}</span>
        </div>
      )}
    </>
  );
};

export default UnreadFavChatBadge;
