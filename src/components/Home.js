import classes from './Home.module.css';
import { chatsData } from '../data/data.js';
import { useState } from 'react';
import Chat from './Chat';
import ChatRow from './ChatRow';
import FullScreen from './FullScreen';

const rowTitles = [
  'frontend',
  'backend',
  'JS',
  'frameworks',
  'language',
  'markup',
  'frontend frameworks',
];

const Home = (props) => {
  const [activeChatsBottom, setActiveChatsBottom] = useState([]);
  const [showMessages, setShowMessages] = useState(null);
  const [fullScreenChat, setFullScreenChat] = useState(null);

  const onSelectChatHandler = (chatData) => {
    const indexOfChat = activeChatsBottom.findIndex(
      (chat) => chat.chatName === chatData.chatName
    );

    if (indexOfChat < 0) {
      setActiveChatsBottom((cur) => [chatData, ...cur]);
    }

    setShowMessages(chatData.chatName);
  };

  const onCloseHandler = (chatName) => {
    console.log(chatName);
    const chats = [...activeChatsBottom];
    const filtered = chats.filter((chat) => chat.chatName !== chatName);
    setActiveChatsBottom(filtered);
  };

  const clearShowHandler = () => {
    setShowMessages(null);
  };

  const fullScreenChatHandler = (chatName) => {
    if (fullScreenChat) {
      setFullScreenChat(null);
    }
    const fullChat = activeChatsBottom.filter((c) => c.chatName === chatName);
    setFullScreenChat(fullChat);
  };

  if (fullScreenChat) {
    return (
      <FullScreen
        onClick={fullScreenChatHandler}
        onClose={onCloseHandler}
        fullScreenChat={fullScreenChat}
        activeChats={activeChatsBottom}
      />
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.chatRows}>
        {rowTitles.map((title) => (
          <ChatRow
            onSelectChat={onSelectChatHandler}
            chats={chatsData}
            rowTitle={title}
            key={title}
          />
        ))}
      </div>
      <div className={classes['active-chats-container']}>
        {activeChatsBottom &&
          activeChatsBottom.map((chat) => (
            <Chat
              fullScreenChat={fullScreenChatHandler}
              clearShow={clearShowHandler}
              showMessages={showMessages}
              activeChatsLength={activeChatsBottom.length}
              {...chat}
              key={chat.chatName}
              onClose={onCloseHandler}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
