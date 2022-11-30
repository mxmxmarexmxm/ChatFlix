import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Chat from './Chat';
import classes from './FullScreen.module.css';

const FullScreen = (props) => {
  const { fullScreenChat } = props;
  return (
    <div className={classes.screen}>
      <div className={classes['active-chats-container']}>
        {props.activeChats.map((c) => (
          <div
            className={classes['active-chat']}
            key={c.chatName}
            onClick={props.onClick.bind(this, c.chatName)}
          >
            <div className={classes['chat-and-logo']}>
              <div className={classes['logo-container']}>
                <img src={c.logo} alt='img' />
              </div>
              <h2>{c.chatName}</h2>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <div
                className={classes['icon-btn-wrapper']}
                onClick={props.onClose.bind(this, c.chatName)}
              >
                <AiOutlineClose className={classes.icon} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={classes['full-screen-chat-container']}>
        <Chat
          isFullScreen={true}
          maximizeChat={props.maximizeChat}
          logo={fullScreenChat.logo}
          chatName={fullScreenChat.chatName}
          key={fullScreenChat.chatName}
          onClose={props.onClose}
        />
      </div>
    </div>
  );
};

export default FullScreen;
