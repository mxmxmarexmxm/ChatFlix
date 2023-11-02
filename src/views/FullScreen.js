import React, { useState } from 'react';
import Chat from '../components/Chat/Chat';
import classes from './FullScreen.module.css';
import SideChatFullscreen from '../components/Chat/SideChatFullscreen';

const FullScreen = ({
  fullScreenChat,
  onFullScreenToggle,
  activeChats,
  onSelectChat,
  closeChat,
}) => {
  const [showSideChats, setShowSideChats] = useState(true);

  return (
    <div className={classes.fullscreen}>
      <div
        className={`${classes['side-chats-container']}  ${
          !showSideChats && classes['hidden']
        }`}
      >
        {activeChats.map((chat) => (
          <SideChatFullscreen
            key={chat.id}
            chat={chat}
            onSelectChat={() => onSelectChat(chat.id)}
            closeChat={() => closeChat(chat.id)}
          />
        ))}
      </div>

      <div className={classes['fullscreen-chat-container']}>
        <Chat
          isFullScreen
          chat={fullScreenChat}
          onFullScreenToggle={onFullScreenToggle}
          closeChat={closeChat}
          setShowSideChats={setShowSideChats}
        />
      </div>
    </div>
  );
};

export default FullScreen;
