import React from 'react';
import Chat from '../components/Chat';
import classes from './FullScreen.module.css';

const FullScreen = (props) => {
  const { fullScreenChat } = props;
  return (
    <div className={classes.screen}>
      <div className={classes['active-chats-container']}>
        {props.activeChats.map((chat) => (
          <Chat
            fullScreenSideChat={true}
            key={chat.chatName}
            chat={chat}
            onClick={props.onClick.bind(this, chat.chatName)}
            onClose={props.onClose.bind(this, chat.chatName)}
          />
        ))}
      </div>
      <div className={classes['full-screen-chat-container']}>
        <Chat
          isFullScreen={true}
          chat={fullScreenChat}
          maximizeChat={props.maximizeChat}
          key={fullScreenChat.chatName}
          onClose={props.onClose}
        />
      </div>
    </div>
  );
};

export default FullScreen;
