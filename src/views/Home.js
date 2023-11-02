import classes from './Home.module.css';
import { rowTitles } from '../data/data.js';
import { useState } from 'react';
import Chat from '../components/Chat/Chat';
import ChatRow from '../components/ChatRow';
import FullScreen from './FullScreen';
import ToggleChatHeadsBtn from '../components/UI/ToggleChatHeadsBtn';
import Header from '../components/UI/Header';
import ChatHead from '../components/Chat/ChatHead';
import { useChatContext } from '../context/ChatContext.js';

const Home = () => {
  const [showChatHeads, setShowChatHeads] = useState(false);
  const {
    activeChatsBottom,
    activeChatsRight,
    selectChatHandler,
    closeChatHandler,
    toggleFullScreenHandler,
    fullScreenChat,
    setFullScreenChat,
    showMessages,
  } = useChatContext();


  if (fullScreenChat) {
    return (
      <>
        <FullScreen
          onSelectChat={toggleFullScreenHandler}
          onFullScreenToggle={() => setFullScreenChat(null)}
          closeChat={closeChatHandler}
          fullScreenChat={fullScreenChat}
          activeChats={[...activeChatsBottom, ...activeChatsRight]}
        />
      </>
    );
  }

  return (
    <div className={classes['home-screen']}>
      <Header />
      <div className={classes['chat-rows-container']}>
        {rowTitles.map((title) => (
          <ChatRow
            onSelectChat={selectChatHandler}
            rowTitle={title}
            key={title}
          />
        ))}
      </div>

      <div className={classes['active-chats-container']}>
        <div className={classes['active-chats-bottom']}>
          {activeChatsBottom?.map((chat) => (
            <Chat
              onFullScreenToggle={() => toggleFullScreenHandler(chat.id)}
              showMessages={showMessages}
              chat={chat}
              key={chat.id}
              closeChat={closeChatHandler}
            />
          ))}
        </div>
        <div className={classes['active-chat-right']}>
          {showChatHeads && (
            <div className={classes['chat-heads-container']}>
              {activeChatsRight.map((chat) => (
                <ChatHead
                  key={chat.id}
                  chat={chat}
                  closeChat={() => closeChatHandler(chat.id)}
                  onSelectChat={() => selectChatHandler(chat)}
                />
              ))}
            </div>
          )}
          {activeChatsRight?.length !== 0 && (
            <ToggleChatHeadsBtn
              showChatHeads={showChatHeads}
              onClick={() => setShowChatHeads((c) => !c)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
