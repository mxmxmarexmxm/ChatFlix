import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getUserChatsFromFirestore,
  updateUserChatsInFirestore,
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
  const [favoriteChats, setFavoriteChats] = useState([]);
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
    let activeChats = [...activeChatsBottom, ...activeChatsRight];
    const isFirst = activeChats[0].id === id;
    const isFullScreen = id === fullScreenChat?.id;

    if (isFullScreen) {
      isFirst
        ? setFullScreenChat(activeChats[1])
        : setFullScreenChat(activeChats[0]);
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

  // Toggles the favorite status of a chat
  const toggleFavoriteChat = (event, chat) => {
    event.stopPropagation();
    if (favoriteChats.some((favChat) => favChat.id === chat.id)) {
      // If chat is already in favorites, remove it
      const updatedFavoriteChats = favoriteChats.filter(
        (favChat) => favChat.id !== chat.id
      );
      setFavoriteChats(updatedFavoriteChats);
    } else {
      // If chat is not in favorites, add it
      const updatedFavoriteChats = [
        ...favoriteChats,
        // Set tag to 'favorites'
        { ...chat, tags: ['favorites'] },
      ];
      setFavoriteChats(updatedFavoriteChats);
    }
  };

  // Save chat list to Firebase when activeChats change.
  useEffect(() => {
    updateUserChatsInFirestore(
      activeChatsBottom,
      activeChatsRight,
      favoriteChats
    );
  }, [activeChatsBottom, activeChatsRight, favoriteChats]);

  // Close full screen if there are no remaining chats.
  useEffect(() => {
    if (activeChatsBottom?.length === 0 && activeChatsRight.length === 0) {
      setFullScreenChat(null);
    }
  }, [activeChatsBottom, activeChatsRight]);

  // Load active chats when the component mounts and when the user changes.
  useEffect(() => {
    user &&
      getUserChatsFromFirestore().then(
        ({ activeChatsBottom, activeChatsRight, favoriteChats }) => {
          setActiveChatsBottom(activeChatsBottom);
          setActiveChatsRight(activeChatsRight);
          setFavoriteChats(favoriteChats);
        }
      );
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        activeChatsBottom,
        activeChatsRight,
        favoriteChats,
        fullScreenChat,
        showMessages,
        toggleFavoriteChat,
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
