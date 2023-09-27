import React from 'react';
import Chat from '../components/Chat/Chat';
import classes from './FullScreen.module.css';

const FullScreen = ({
  fullScreenChat,
  onFullScreenToggle,
  activeChats,
  onSelectChat,
  onClose,
}) => {
  return (
    <div className={classes.screen}>
      <div className={classes['active-chats-container']}>
        {activeChats.map((chat) => (
          <Chat
            isFullScreenSideChat
            key={chat.id}
            chat={chat}
            onSelectChat={() => onSelectChat(chat.id)}
            onClose={() => onClose(chat.id)}
          />
        ))}
      </div>
      <div className={classes['full-screen-chat-container']}>
        <Chat
          isFullScreen
          chat={fullScreenChat}
          onFullScreenToggle={onFullScreenToggle}
          key={fullScreenChat.name}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default FullScreen;
