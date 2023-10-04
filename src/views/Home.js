import classes from './Home.module.css';
import { rowTitles } from '../data/data.js';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat/Chat';
import ChatRow from '../components/ChatRow';
import FullScreen from './FullScreen';
import ToggleChatHeadsBtn from '../components/UI/ToggleChatHeadsBtn';
import Header from '../components/UI/Header';
import useWindowDimensions from '../utils/useWindowWidth';

const Home = () => {
  const [activeChatsBottom, setActiveChatsBottom] = useState([]);
  const [activeChatsRight, setActiveChatsRight] = useState([]);
  const { width } = useWindowDimensions();
  const [showMessages, setShowMessages] = useState(null);
  const [fullScreenChat, setFullScreenChat] = useState(null);
  const [showChatHeads, setShowChatHeads] = useState(false);

  // Get previously opened chats from local storage.
  useEffect(() => {
    const chatsRight = localStorage.getItem('chatsRight');
    const chatsBottom = localStorage.getItem('chatsBottom');

    setActiveChatsBottom(JSON.parse(chatsBottom));
    setActiveChatsRight(JSON.parse(chatsRight));
  }, []);

  // Save chat list to local storage.
  useEffect(() => {
    const saveChatsToLocalStorage = () => {
      localStorage.setItem('chatsBottom', JSON.stringify(activeChatsBottom));
      localStorage.setItem('chatsRight', JSON.stringify(activeChatsRight));
    };
    saveChatsToLocalStorage();
  }, [activeChatsBottom, activeChatsRight]);

  // Select chat handler, for each scenario.
  const selectChatHandler = (chatData) => {
    const indexOfChatBottom = activeChatsBottom.findIndex(
      (chat) => chat?.id === chatData.id
    );
    const indexOfChatRight = activeChatsRight.findIndex(
      (chat) => chat?.id === chatData.id
    );

    let activeBottom = [...activeChatsBottom];

    const isActive = indexOfChatBottom >= 0 || indexOfChatRight >= 0;

    const bottomLimit = width < '800' ? 1 : width < '1150' ? 2 : 3;

    if (!isActive && activeBottom.length <= bottomLimit) {
      setActiveChatsBottom((cur) => [chatData, ...cur]);
    }

    if (!isActive && activeBottom.length >= bottomLimit) {
      const elementToMove = activeBottom[bottomLimit - 1];
      setActiveChatsRight((chat) => [...chat, elementToMove]);
      setActiveChatsBottom([
        chatData,
        ...activeBottom.filter((chat) => chat?.id !== elementToMove?.id),
      ]);
    }

    if (indexOfChatRight >= 0 && activeChatsBottom.length <= bottomLimit) {
      setActiveChatsRight(
        activeChatsRight.filter((c) => c.name !== chatData.name)
      );
      setActiveChatsBottom((c) => [chatData, ...c]);
    }

    if (
      indexOfChatRight >= 0 &&
      indexOfChatBottom < 0 &&
      activeChatsBottom.length >= bottomLimit
    ) {
      const elementToMove = activeBottom[bottomLimit - 1];
      setActiveChatsRight((chat) => [
        ...chat.filter((chat) => chat?.name !== chatData.name),
        elementToMove,
      ]);
      setActiveChatsBottom([
        chatData,
        ...activeBottom.filter((chat) => chat.name !== elementToMove.name),
      ]);
    }
    setShowMessages({ name: chatData.name });
  };

  // Close chat handler, for each scenario.
  const closeChatHandler = (id) => {
    let allChats = [...activeChatsBottom, ...activeChatsRight];
    const isFirst = allChats[0].id === id;
    const isFullScreen = id === fullScreenChat?.id;

    if (isFullScreen) {
      isFirst ? setFullScreenChat(allChats[1]) : setFullScreenChat(allChats[0]);
    }

    setActiveChatsBottom(activeChatsBottom.filter((chat) => chat?.id !== id));
    setActiveChatsRight(activeChatsRight.filter((chat) => chat?.id !== id));
  };

  const toggleFullScreenHandler = (id) => {
    if (fullScreenChat) {
      setFullScreenChat(null);
    }

    const fullChat =
      activeChatsBottom.find((chat) => chat.id === id) ||
      activeChatsRight.find((chat) => chat.id === id);

    setFullScreenChat(fullChat);
  };

  // Close full screen if there are no remaining chats.
  if (
    activeChatsBottom?.length === 0 &&
    activeChatsRight.length === 0 &&
    fullScreenChat
  ) {
    setFullScreenChat(null);
  }

  if (fullScreenChat) {
    return (
      <>
        <FullScreen
          onSelectChat={toggleFullScreenHandler}
          onFullScreenToggle={() => setFullScreenChat(null)}
          onClose={closeChatHandler}
          fullScreenChat={fullScreenChat}
          activeChats={[...activeChatsBottom, ...activeChatsRight]}
        />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        {rowTitles.map((title) => (
          <ChatRow
            onSelectChat={selectChatHandler}
            rowTitle={title}
            key={title}
          />
        ))}
        <div className={classes['active-chats-container']}>
          <div className={classes['active-chats-bottom']}>
            {activeChatsBottom?.map((chat) => (
              <Chat
                onFullScreenToggle={toggleFullScreenHandler}
                showMessages={showMessages}
                chat={chat}
                key={chat.id}
                onClose={closeChatHandler}
              />
            ))}
          </div>
          <div className={classes['active-chat-right']}>
            {showChatHeads && (
              <div className={classes['chat-heads-container']}>
                {activeChatsRight.map((chat) => (
                  <Chat
                    key={chat.id}
                    chat={chat}
                    isChatHead={true}
                    onClose={() => closeChatHandler(chat.id)}
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
    </>
  );
};

export default Home;
