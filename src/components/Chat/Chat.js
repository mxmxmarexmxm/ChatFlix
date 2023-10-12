import React, { useContext, useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ChatHead from './ChatHead';
import SideChatFullscreen from './SideChatFullscreen';
import useSound from 'use-sound';
import notificationSound from '../../assets/Sound/notification-sound.mp3';
import firebase from '../../Firebase/Firebase';
import { AuthContext } from '../../Firebase/context';
import 'firebase/compat/firestore';
import { useModal } from '../../context/ModalContext';
import AuthForm from '../../auth/AuthForm';
import ChatInterface from './ChatInterface';
import { getUserDataFromFirestore } from '../../services/UserServices';
const firestore = firebase.firestore();

const Chat = ({
  chat,
  isChatHead,
  isFullScreen,
  showMessages,
  onClose,
  isFullScreenSideChat,
  onFullScreenToggle,
  onSelectChat,
}) => {
  const [dispalyMessages, setDisplayMessages] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isCode, setIsCode] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [messageToReplay, setMessageToReplay] = useState(null);
  const [replayToDisplayName, setReplayToDisplayName] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [notify] = useSound(notificationSound);
  const { user } = useContext(AuthContext);
  const messagesContainerRef = useRef();
  const chatInputRef = useRef();
  const { openModal } = useModal();

  let messageCollection = firestore.collection(`/chats/${chat.name}/messages/`);

  let query = messageCollection.orderBy('createdAt', 'asc');
  const [messages, loading] = useCollectionData(query, { idField: 'id' });

  // Get unread messages
  useEffect(() => {
    const getUnreadMessages = () => {
      const unreadMessages = messages?.filter(
        (message) => !message.readBy.includes(user.uid)
      ).length;

      setUnreadMessages(unreadMessages);
    };
    user && getUnreadMessages();
  }, [messages, user]);

  // Fetch users data from Firestore
  useEffect(() => {
    const fetchUsersData = async () => {
      if (messageToReplay) {
        const replayToUserData = await getUserDataFromFirestore(
          messageToReplay?.uid
        );
        setReplayToDisplayName(replayToUserData?.displayName);
      }
    };

    fetchUsersData();
  }, [messageToReplay]);

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

  // Mark all previous messages as read when user clicks on input
  const markAllAsRead = async () => {
    if (user) {
      await messageCollection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            readBy: firebase.firestore.FieldValue.arrayUnion(user.uid),
          });
        });
      });
    }
  };

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
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `chat-photos/${chat.name}/${new Date().getTime()}_${file.name}`
    );

    // TODO: HANDLE LOADING AND ERROR STATE !!!!!!!! //

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setPhoto(downloadURL);
    } catch (err) {
      console.log(err);
    }
  };

  // Send message if the user is logged in, otherwise alert to sign in.
  const sendMessage = async (e) => {
    e.preventDefault();
    if (user) {
      const { uid } = user;
      if (messageText.trim() !== '') {
        await messageCollection.add({
          text: messageText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          id: new Date().toISOString() + '/' + uid,
          readBy: [uid],
          replayTo: messageToReplay,
          isCode: isCode,
        });
      }
      if (photo) {
        await messageCollection.add({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          id: new Date().toISOString() + '/' + uid,
          readBy: [uid],
          replayTo: messageToReplay,
          isCode: false,
          photoUrl: photo ?? photo,
        });
      }
      setMessageText('');
      scrollToBottom();
      setIsCode(false);
      setPhoto(null);
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
        setDisplayMessages(false);
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
    onFullScreenToggle(chat.id);
  };

  // Side chat on full screen
  if (isFullScreenSideChat) {
    return (
      <SideChatFullscreen
        unreadMessages={unreadMessages}
        onSelectChat={onSelectChat}
        onClose={onClose}
        logo={chat.logo}
        name={chat.name}
      />
    );
  }

  // Chat head if chat is in the right chat container
  if (isChatHead) {
    return (
      <ChatHead
        unreadMessages={unreadMessages}
        onSelectChat={onSelectChat}
        logo={chat.logo}
        onClose={onClose}
      />
    );
  }

  return (
    <ChatInterface
      isFullScreen={isFullScreen}
      chat={chat}
      toggleChat={toggleChat}
      unreadMessages={unreadMessages}
      toggleFullScreen={toggleFullScreen}
      onClose={onClose}
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
      photo={photo}
      handlePhotoUpload={handlePhotoUpload}
      setPhoto={setPhoto}
      replayToDisplayName={replayToDisplayName}
    />
  );
};

export default Chat;
