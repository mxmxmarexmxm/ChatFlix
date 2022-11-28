import React from 'react';
import Chat from './Chat';
import classes from './FullScreen.module.css';

const FullScreen = (props) => {
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
            <div
              className={classes['button-wrapper']}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={classes['close-btn']}
                onClick={props.onClose.bind(this, c.chatName)}
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={classes['full-screen-chat-container']}>
        <Chat
          isFullScreen={true}
          logo={props.fullScreenChat.logo}
          chatName={props.fullScreenChat.chatName}
          key={props.fullScreenChat.chatName}
          onClose={props.onClose}
        />
      </div>
    </div>
  );
};

export default FullScreen;
