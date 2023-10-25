import classes from './Home.module.css';
import { rowTitles } from '../data/data.js';
import { useContext, useEffect, useState } from 'react';
import Chat from '../components/Chat/Chat';
import ChatRow from '../components/ChatRow';
import FullScreen from './FullScreen';
import ToggleChatHeadsBtn from '../components/UI/ToggleChatHeadsBtn';
import Header from '../components/UI/Header';
import useWindowDimensions from '../hooks/useWindowWidth';
import {
  getActiveChatsFromFirestore,
  saveActiveChatsToFirestore,
} from '../services/UserServices';
import { AuthContext } from '../Firebase/context';
import ChatHead from '../components/Chat/ChatHead';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [activeChatsBottom, setActiveChatsBottom] = useState([]);
  const [activeChatsRight, setActiveChatsRight] = useState([]);
  const { width } = useWindowDimensions();
  const [showMessages, setShowMessages] = useState(null);
  const [fullScreenChat, setFullScreenChat] = useState(null);
  const [showChatHeads, setShowChatHeads] = useState(false);

  // Load active chats when the component mounts
  useEffect(() => {
    user &&
      getActiveChatsFromFirestore().then(
        ({ activeChatsBottom, activeChatsRight }) => {
          setActiveChatsBottom(activeChatsBottom);
          setActiveChatsRight(activeChatsRight);
        }
      );
  }, [user]);

  // Save chat list to firebase.
  useEffect(() => {
    saveActiveChatsToFirestore(activeChatsBottom, activeChatsRight);
  }, [activeChatsBottom, activeChatsRight]);

  // Close full screen if there are no remaining chats.
  useEffect(() => {
    if (activeChatsBottom?.length === 0 && activeChatsRight.length === 0) {
      setFullScreenChat(null);
    }
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
      setActiveChatsBottom((chats) => [chatData, ...chats]);
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
        activeChatsRight.filter((chats) => chats.id !== chatData.id)
      );
      setActiveChatsBottom((chats) => [chatData, ...chats]);
    }

    if (
      indexOfChatRight >= 0 &&
      indexOfChatBottom < 0 &&
      activeChatsBottom.length >= bottomLimit
    ) {
      const elementToMove = activeBottom[bottomLimit - 1];
      setActiveChatsRight((chat) => [
        ...chat.filter((chat) => chat?.id !== chatData.id),
        elementToMove,
      ]);
      setActiveChatsBottom([
        chatData,
        ...activeBottom.filter((chat) => chat.id !== elementToMove.id),
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
              onFullScreenToggle={toggleFullScreenHandler}
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
