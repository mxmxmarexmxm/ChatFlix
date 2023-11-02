import React, { useContext, useEffect, useRef, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useSound from 'use-sound';
import notificationSound from '../../assets/Sound/notification-sound.mp3';
import firebase from '../../Firebase/Firebase';
import { AuthContext } from '../../Firebase/context';
import 'firebase/compat/firestore';
import { useModal } from '../../context/ModalContext';
import AuthForm from '../../auth/AuthForm';
import ChatInterface from './ChatInterface';
import useUserData from '../../hooks/useUserData';
import useUnreadMessages from '../../hooks/useUnreadMessages';
import { useChatContext } from '../../context/ChatContext';

const Chat = ({ chat, isFullScreen, setShowSideChats }) => {
  const [dispalyMessages, setDisplayMessages] = useState(true);
  const [imgUploadLoading, setImgUploadLoading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isCode, setIsCode] = useState(false);
  const [messageToReplay, setMessageToReplay] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [notify] = useSound(notificationSound);
  const { user } = useContext(AuthContext);
  const messagesContainerRef = useRef();
  const chatInputRef = useRef();
  const { openModal } = useModal();
  const replayToUserData = useUserData(messageToReplay?.uid);
  const replayToDisplayName =
    user?.uid === messageToReplay?.uid
      ? 'yourself'
      : replayToUserData?.displayName;

  const {
    messages,
    loading,
    unreadMessages,
    messageCollection,
    markAllAsRead,
  } = useUnreadMessages(chat.name);

  const { showMessages, toggleFullScreenHandler, closeChatHandler } =
    useChatContext();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [loading, dispalyMessages]);

  const scrollToReplayedMessage = (id) => {
    const message = document.getElementById(id);
    message.scrollIntoView({ behavior: 'smooth' });
  };

  // Get notification when message arrives
  useEffect(() => {
    if (unreadMessages > 0) {
      notify();
    }
  }, [unreadMessages, notify]);

  const handleInputChange = (e) => {
    const chatInputRefCurr = chatInputRef.current;
    chatInputRefCurr.style.height = 'auto';

    // Get the computed font size
    const computedStyle = getComputedStyle(chatInputRefCurr);
    const fontSize = parseFloat(computedStyle.fontSize); // Extract the font size in pixels

    chatInputRefCurr.style.height = `${
      Math.min(
        4,
        Math.max(
          1,
          Math.floor(chatInputRefCurr.scrollHeight / (fontSize * 1.5))
        )
      ) *
      (fontSize * 1.5)
    }px`;
    setMessageText(e.target.value);
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    const storage = getStorage();
    const storageRefs = Array.from(files).map((file) =>
      ref(
        storage,
        `chat-photos/${chat.name}/${new Date().getTime()}_${file.name}`
      )
    );

    try {
      setImgUploadLoading(true);
      for (let i = 0; i < files.length; i++) {
        await uploadBytes(storageRefs[i], files[i]);
        const downloadURL = await getDownloadURL(storageRefs[i]);
        setPhotos((photos) => [...photos, downloadURL]);
      }

      // Clear the input field after successful upload
      e.target.value = null;
      setImgUploadLoading(false);
    } catch (err) {
      console.log(err);
      setImgUploadLoading(false);
    }
  };

  // Send message if the user is logged in, otherwise alert to sign in.
  const sendMessage = async (e) => {
    e.preventDefault();
    if (user) {
      const { uid } = user;
      const id = new Date().toISOString() + '*' + uid;
      if (messageText.trim() !== '') {
        await messageCollection.doc(id).set({
          text: messageText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          id: id,
          readBy: [uid],
          replayTo: messageToReplay,
          isCode: isCode,
        });
      }
      if (photos) {
        let photoId = 'photos-' + id;
        await messageCollection.doc(photoId).set({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          id: photoId,
          readBy: [uid],
          replayTo: messageToReplay,
          isCode: false,
          photos: photos,
        });
      }
      setMessageText('');
      scrollToBottom();
      setIsCode(false);
      setPhotos([]);
      chatInputRef.current.style.height = '3rem';
    } else {
      openModal(<AuthForm />);
    }
    setMessageToReplay(null);
  };

  // Send message on enter press
  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault(); // Prevent Enter from creating a new line
      sendMessage(e);
    }
  };

  const toggleChat = () => {
    if (!isFullScreen) {
      setDisplayMessages((curr) => !curr);
    }
  };

  // Expand chat if selected from home screen and chat is already in active chats container
  useEffect(() => {
    if (chat?.name === showMessages?.name) {
      setDisplayMessages(true);
    }
  }, [showMessages, chat.name]);

  // Minimize all chats in the active bottom container at the Esc button
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        if (isFullScreen) {
          toggleFullScreenHandler(chat.id);
        } else {
          setDisplayMessages(false);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    const messagesContainer = messagesContainerRef?.current;

    const handleScroll = () => {
      // Calculate the scroll position, including a small buffer.
      const scrollTop = messagesContainer.scrollTop;
      const scrollHeight = messagesContainer.scrollHeight;
      const clientHeight = messagesContainer.clientHeight;
      const buffer = 50;
      setIsAtBottom(scrollTop + clientHeight + buffer >= scrollHeight);
    };

    messagesContainer?.addEventListener('scroll', handleScroll);

    return () => {
      messagesContainer?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Focus chat input
  useEffect(() => {
    const focusInput = () => {
      chatInputRef?.current?.focus();
    };

    focusInput();
  }, [messageToReplay, dispalyMessages]);

  const toggleFullScreen = (event) => {
    event.stopPropagation();
    toggleFullScreenHandler(chat.id);
  };

  return (
    <ChatInterface
      isFullScreen={isFullScreen}
      chat={chat}
      toggleChat={toggleChat}
      unreadMessages={unreadMessages}
      toggleFullScreen={toggleFullScreen}
      closeChatHandler={closeChatHandler}
      dispalyMessages={dispalyMessages}
      messages={messages}
      loading={loading}
      messageText={messageText}
      setMessageText={setMessageText}
      messagesContainerRef={messagesContainerRef}
      chatInputRef={chatInputRef}
      messageToReplay={messageToReplay}
      setMessageToReplay={setMessageToReplay}
      markAllAsRead={markAllAsRead}
      sendMessage={sendMessage}
      scrollToReplayedMessage={scrollToReplayedMessage}
      isAtBottom={isAtBottom}
      scrollToBottom={scrollToBottom}
      isCode={isCode}
      setIsCode={setIsCode}
      onEnterPress={onEnterPress}
      handleInputChange={handleInputChange}
      photos={photos}
      handlePhotoUpload={handlePhotoUpload}
      setPhotos={setPhotos}
      replayToDisplayName={replayToDisplayName}
      imgUploadLoading={imgUploadLoading}
      setShowSideChats={setShowSideChats}
    />
  );
};

export default Chat;
