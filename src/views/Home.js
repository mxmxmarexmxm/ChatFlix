import classes from './Home.module.css';
import { chatsData, rowTitles } from '../data/data.js';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat/Chat';
import ChatRow from '../components/ChatRow';
import FullScreen from './FullScreen';
import ToggleChatHeadsBtn from '../components/UI/ToggleChatHeadsBtn';

const Home = (props) => {
  const [activeChatsBottom, setActiveChatsBottom] = useState([]);
  const [activeChatsRight, setActiveChatsRight] = useState([]);
  const [showMessages, setShowMessages] = useState(null);
  const [fullScreenChat, setFullScreenChat] = useState(null);
  const [showChatHeads, setShowChatHeads] = useState(false);

  // Get previously opened chats from local storage.
  useEffect(() => {
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

  // Select chat handler, for each scenario.
  const onSelectChatHandler = (chatData) => {
    const indexOfChatBottom = activeChatsBottom.findIndex(
      (chat) => chat.chatName === chatData.chatName
    );

    const indexOfChatRight = activeChatsRight.findIndex(
      (chat) => chat.chatName === chatData.chatName
    );

    let activeBottom = [...activeChatsBottom];

    const isActive = indexOfChatBottom >= 0 || indexOfChatRight >= 0;

    if (!isActive && activeBottom.length <= 2) {
      setActiveChatsBottom((cur) => [chatData, ...cur]);
    }

    if (!isActive && activeBottom.length > 2) {
      const elementToMove = activeBottom[2];
      setActiveChatsRight((c) => [...c, elementToMove]);
      setActiveChatsBottom([
        chatData,
        ...activeBottom.filter((c) => c.chatName !== elementToMove.chatName),
      ]);
    }

    if (indexOfChatRight >= 0 && activeChatsBottom.length < 2) {
      setActiveChatsRight(activeChatsRight.filter((c) => c.chatName !== chatData.chatName));
      setActiveChatsBottom((c) => [chatData, ...c]);
    }

    if (indexOfChatRight >= 0 && indexOfChatBottom < 0 && activeChatsBottom.length > 2) {
      const elementToMove = activeBottom[2];
      setActiveChatsRight((chat) => [
        ...chat.filter((chat) => chat.chatName !== chatData.chatName),
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
  const onCloseHandler = (chatName) => {
    let allChats = [...activeChatsBottom, ...activeChatsRight];
    const isFirst = allChats[0].chatName === chatName;
    const isFullScreen = chatName === fullScreenChat?.chatName;

    if (isFullScreen) {
      isFirst ? setFullScreenChat(allChats[1]) : setFullScreenChat(allChats[0]);
    }

    setActiveChatsBottom(activeChatsBottom.filter((chat) => chat.chatName !== chatName));

    setActiveChatsRight(activeChatsRight.filter((chat) => chat.chatName !== chatName));
  };


  const clearShowHandler = () => {
    setShowMessages(null);
  };

  const maximizeChatHandler = (chatName) => {
    if (fullScreenChat) {
      setFullScreenChat(null);
    }

    const fullChat =
      activeChatsBottom.find((c) => c.chatName === chatName) ||
      activeChatsRight.find((c) => c.chatName === chatName);

    setFullScreenChat(fullChat);
  };

  // Close full screen if there are no remaining chats.
  if (activeChatsBottom?.length === 0 && activeChatsRight.length === 0 && fullScreenChat) {
    setFullScreenChat(null);
  }

  const maximizeChatHandler2 = () => {
    setFullScreenChat(null);
  };

  if (fullScreenChat) {
    return (
      <FullScreen
        onClick={maximizeChatHandler}
        maximizeChat={maximizeChatHandler2}
        onClose={onCloseHandler}
        fullScreenChat={fullScreenChat}
        activeChats={[...activeChatsBottom, ...activeChatsRight]}
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
        <div className={classes['active-chats-bottom']}>
          {activeChatsBottom &&
            activeChatsBottom.map((chat) => (
              <Chat
                maximizeChat={maximizeChatHandler}
                clearShow={clearShowHandler}
                showMessages={showMessages}
                chat={chat}
                key={chat.chatName}
                onClose={onCloseHandler}
              />
            ))}
        </div>
        <div className={classes['active-chat-right']}>
          {showChatHeads && (
            <div className={classes['chat-heads-container']}>
              {activeChatsRight.map((chat) => (
                <Chat
                  key={chat.chatName}
                  chat={chat}
                  isChatHead={true}
                  onClose={onCloseHandler}
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
  );
};

export default Home;
