import classes from './Home.module.css';
import { rowTitles } from '../data/data.js';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat/Chat';
import ChatRow from '../components/ChatRow';
import FullScreen from './FullScreen';
import ToggleChatHeadsBtn from '../components/UI/ToggleChatHeadsBtn';
import Modal from '../components/UI/Modal';
import Header from '../components/UI/Header';
import { signInWithGoogle } from '../auth/AuthServices';
import useWindowDimensions from '../utils/useWindowWidth';

const Home = (props) => {
  const [activeChatsBottom, setActiveChatsBottom] = useState([]);
  const [activeChatsRight, setActiveChatsRight] = useState([]);
  const { width } = useWindowDimensions();
  const [showMessages, setShowMessages] = useState(null);
  const [fullScreenChat, setFullScreenChat] = useState(null);
  const [showChatHeads, setShowChatHeads] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Get previously opened chats from local storage.
  useEffect(() => {
    console.log(showChatHeads);
    const chatsRight = localStorage.getItem('chatsRight');
    const chatsBottom = localStorage.getItem('chatsBottom');

    if (chatsBottom) {
      let chatsBottomParsed = JSON.parse(chatsBottom);
      setActiveChatsBottom(chatsBottomParsed);
    }
    if (chatsRight) {
      let chatsRightParsed = JSON.parse(chatsRight);
      setActiveChatsRight(chatsRightParsed);
    }
  }, []);

  // Save chat list to local storage.
  useEffect(() => {
    const setLocalStorage = () => {
      localStorage.setItem('chatsBottom', JSON.stringify(activeChatsBottom));
      localStorage.setItem('chatsRight', JSON.stringify(activeChatsRight));
    };
    setLocalStorage();
  }, [activeChatsBottom, activeChatsRight]);

  console.log(width);
  // Select chat handler, for each scenario.
  const onSelectChatHandler = (chatData) => {
    const indexOfChatBottom = activeChatsBottom.findIndex((chat) => chat?.id === chatData.id);
    const indexOfChatRight = activeChatsRight.findIndex((chat) => chat?.id === chatData.id);

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
      setActiveChatsRight(activeChatsRight.filter((c) => c.chatName !== chatData.chatName));
      setActiveChatsBottom((c) => [chatData, ...c]);
    }

    if (indexOfChatRight >= 0 && indexOfChatBottom < 0 && activeChatsBottom.length >= bottomLimit) {
      const elementToMove = activeBottom[bottomLimit - 1];
      setActiveChatsRight((chat) => [
        ...chat.filter((chat) => chat?.chatName !== chatData.chatName),
        elementToMove,
      ]);
      setActiveChatsBottom([
        chatData,
        ...activeBottom.filter((chat) => chat.chatName !== elementToMove.chatName),
      ]);
    }
    setShowMessages(chatData.chatName);
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

  const clearShowHandler = () => {
    setShowMessages(null);
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
  if (activeChatsBottom?.length === 0 && activeChatsRight.length === 0 && fullScreenChat) {
    setFullScreenChat(null);
  }

  const onConfirmToLogin = () => {
    signInWithGoogle();
    setShowLoginModal(false);
  };

  if (fullScreenChat) {
    return (
      <>
        <Modal
          title="You need to be logged in to send message !"
          confirmTitle="Sign in with Google"
          onConfirm={onConfirmToLogin}
          visible={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
        <FullScreen
          onUnauthorizedTry={() => setShowLoginModal(true)}
          onClick={toggleFullScreenHandler}
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
      <Modal
        title="You need to be logged in to send message !"
        confirmTitle="Sign in with Google"
        onConfirm={onConfirmToLogin}
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <Header />
      <div className={classes.container}>
        {rowTitles.map((title) => (
          <ChatRow onSelectChat={onSelectChatHandler} rowTitle={title} key={title} />
        ))}
        <div className={classes['active-chats-container']}>
          <div className={classes['active-chats-bottom']}>
            {activeChatsBottom &&
              activeChatsBottom.map((chat) => (
                <Chat
                  onFullScreenToggle={toggleFullScreenHandler}
                  clearShow={clearShowHandler}
                  showMessages={showMessages}
                  chat={chat}
                  key={chat.id}
                  onUnauthorizedTry={() => setShowLoginModal(true)}
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
                    onClose={closeChatHandler.bind(this, chat.id)}
                    onClick={onSelectChatHandler.bind(this, chat)}
                  />
                ))}
              </div>
            )}
            {activeChatsRight.length !== 0 && (
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
