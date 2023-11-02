import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getActiveChatsFromFirestore,
  saveActiveChatsToFirestore,
} from '../services/UserServices';
import { AuthContext } from '../Firebase/context';
import useWindowWidth from '../hooks/useWindowWidth';

const ChatContext = createContext();

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [activeChatsBottom, setActiveChatsBottom] = useState([]);
  const [activeChatsRight, setActiveChatsRight] = useState([]);
  const [fullScreenChat, setFullScreenChat] = useState(null);
  const [showMessages, setShowMessages] = useState(null);
  const { user } = useContext(AuthContext);
  const { width } = useWindowWidth();

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

  // Toggles a chat between fullscreen and regular mode
  const toggleFullScreenHandler = (id) => {
    // If there is already a chat in full-screen, close it.
    if (fullScreenChat) {
      setFullScreenChat(null);
      return;
    }

    const fullChat =
      activeChatsBottom.find((chat) => chat.id === id) ||
      activeChatsRight.find((chat) => chat.id === id);

    setFullScreenChat(fullChat);
  };

  // Save chat list to Firebase when activeChats change.
  useEffect(() => {
    saveActiveChatsToFirestore(activeChatsBottom, activeChatsRight);
  }, [activeChatsBottom, activeChatsRight]);

  // Close full screen if there are no remaining chats.
  useEffect(() => {
    if (activeChatsBottom?.length === 0 && activeChatsRight.length === 0) {
      setFullScreenChat(null);
    }
  }, [activeChatsBottom, activeChatsRight]);

  // Load active chats when the component mounts and when the user changes.
  useEffect(() => {
    user &&
      getActiveChatsFromFirestore().then(
        ({ activeChatsBottom, activeChatsRight }) => {
          setActiveChatsBottom(activeChatsBottom);
          setActiveChatsRight(activeChatsRight);
        }
      );
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        activeChatsBottom,
        activeChatsRight,
        fullScreenChat,
        showMessages,
        selectChatHandler,
        closeChatHandler,
        toggleFullScreenHandler,
        setFullScreenChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
