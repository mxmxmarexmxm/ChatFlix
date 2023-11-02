import React, { useState } from 'react';
import Chat from '../components/Chat/Chat';
import classes from './FullScreen.module.css';
import SideChatFullscreen from '../components/Chat/SideChatFullscreen';
import { useChatContext } from '../context/ChatContext';

const FullScreen = () => {
  const [showSideChats, setShowSideChats] = useState(true);
  const { activeChatsBottom, activeChatsRight, fullScreenChat } =
    useChatContext();

  return (
    <div className={classes.fullscreen}>
      <div
        className={`${classes['side-chats-container']}  ${
          !showSideChats && classes['hidden']
        }`}
      >
        {[...activeChatsBottom, ...activeChatsRight].map((chat) => (
          <SideChatFullscreen key={chat.id} chat={chat} />
        ))}
      </div>

      <div className={classes['fullscreen-chat-container']}>
        <Chat
          isFullScreen
          chat={fullScreenChat}
          setShowSideChats={setShowSideChats}
        />
      </div>
    </div>
  );
};

export default FullScreen;
