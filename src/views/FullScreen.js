import React from 'react';
import Chat from '../components/Chat/Chat';
import classes from './FullScreen.module.css';

const FullScreen = (props) => {
  const { fullScreenChat } = props;
  return (
    <div className={classes.screen}>
      <div className={classes['active-chats-container']}>
        {props.activeChats.map((chat) => (
          <Chat
            isFullScreenSideChat={true}
            key={chat.id}
            chat={chat}
            onSelectChat={() => props.onSelectChat(chat.id)}
            onClose={() => props.onClose(chat.id)}
          />
        ))}
      </div>
      <div className={classes['full-screen-chat-container']}>
        <Chat
          isFullScreen={true}
          chat={fullScreenChat}
          onFullScreenToggle={props.onFullScreenToggle}
          key={fullScreenChat.chatName}
          onClose={props.onClose}
        />
      </div>
    </div>
  );
};

export default FullScreen;
