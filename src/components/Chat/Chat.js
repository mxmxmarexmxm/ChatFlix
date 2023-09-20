import React, { useContext, useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import classes from './Chat.module.css';
import placeholder from '../../assets/img/placeholder.png';
import {
  AiOutlineClose,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
} from 'react-icons/ai';
import ChatHead from './ChatHead';
import SideChatFullScreen from '../SideChatFullScreen';
import Message from '../Message';
import useSound from 'use-sound';
import notificationSound from '../../assets/Sound/notification-sound.mp3';
import firebase from '../../Firebase/Firebase';
import { AuthContext } from '../../Firebase/context';
import 'firebase/compat/firestore';
import { useModal } from '../../context/ModalContext';
import LoginForm from '../../auth/LoginForm';
const firestore = firebase.firestore();

const Chat = (props) => {
  const [showChatMessages, setShowChatMessages] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [messageToReplay, setMessageToReplay] = useState(null);
  const [notify] = useSound(notificationSound);
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const chatInput = useRef();
  const { openModal } = useModal();

  const {
    chat,
    isChatHead,
    isFullScreen,
    showMessages,
    onClose,
    isFullScreenSideChat,
    onFullScreenToggle,
    onSelectChat,
  } = props;

  let messageCollection = firestore.collection(
    `/chats/${chat.chatName}/messages/`
  );

  let query = messageCollection.orderBy('createdAt', 'asc');
  const [messages, loading] = useCollectionData(query, { idField: 'id' });

  // Get unread messages
  useEffect(() => {
    const getUnreadMessages = () => {
      if (user === null) {
        return;
      }
      const unreadMessages = messages?.filter(
        (message) => !message.readBy.includes(user.uid)
      ).length;

      setUnreadMessages(unreadMessages);
    };
    getUnreadMessages();
  }, [messages, user]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [loading, showChatMessages]);

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

  // Send message if the user is logged in, otherwise alert to sign in.
  const sendMessage = async (e) => {
    e.preventDefault();

    if (user) {
      const { uid, photoURL, displayName } = user;
      if (messageText.trim() !== '') {
        await messageCollection.add({
          text: messageText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          photoURL,
          id: new Date().toISOString() + uid,
          displayName,
          readBy: [uid],
          replayTo: messageToReplay,
        });
      }
      scrollToBottom();
      setMessageText('');
    } else {
      openModal(<LoginForm />);
    }
    setMessageToReplay(null);
  };

  const toggleChat = () => {
    if (!isFullScreen) {
      setShowChatMessages((curr) => !curr);
    }
  };

  // Expand chat if selected from home screen and chat is already in active chats container
  useEffect(() => {
    if (chat.chatName === showMessages) {
      setShowChatMessages(true);
    }
  }, [chat.chatName, showMessages]);

  // Minimize all chats in the active bottom container at the Esc button
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setShowChatMessages(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Focus chat input
  useEffect(() => {
    const focusInput = () => {
      chatInput?.current?.focus();
    };

    focusInput();
  }, [messageToReplay, showChatMessages]);

  const toggleFullScreen = (event) => {
    event.stopPropagation();
    onFullScreenToggle(chat.id);
  };

  // Chat classes depending on chat size
  let chatBodyClass = showChatMessages
    ? classes['chat-body']
    : classes['hide-body'];

  // Side chat on full screen
  if (isFullScreenSideChat) {
    return (
      <SideChatFullScreen
        unreadMessages={unreadMessages}
        onSelectChat={onSelectChat}
        onClose={onClose}
        logo={chat.logo}
        chatName={chat.chatName}
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
    <div
      className={`${classes.chat} ${
        isFullScreen ? classes[`chat-full-screen`] : ''
      }`}
    >
      <div
        className={`${classes['chat-head']} ${
          isFullScreen ? classes['chat-head-full'] : ''
        }`}
        onClick={toggleChat}
      >
        <div className={classes.logoAndTitle}>
          <div className={classes['chat-head-image-container']}>
            <img
              src={chat.logo}
              alt="avatar"
              onError={(e) => {
                e.target.src = placeholder;
              }}
            />
          </div>
          <h2>{chat.chatName}</h2>
        </div>
        <div className={classes[`button-wrapper`]}>
          {unreadMessages > 0 && (
            <div className={classes[`unread-messages-badge`]}>
              {unreadMessages}
            </div>
          )}
          <div
            className={classes['icon-btn-wrapper']}
            onClick={toggleFullScreen}
          >
            {isFullScreen ? (
              <AiOutlineFullscreenExit className={classes.icon} />
            ) : (
              <AiOutlineFullscreen className={classes.icon} />
            )}
          </div>
          <div
            className={classes['icon-btn-wrapper']}
            onClick={() => onClose(chat.id)}
          >
            <AiOutlineClose className={classes.icon} />
          </div>
        </div>
      </div>
      <div className={isFullScreen ? classes['chat-body-full'] : chatBodyClass}>
        <div
          className={`${classes['messages-container']} ${
            isFullScreen ? classes[`messages-container-full`] : ''
          }`}
          ref={scrollRef}
        >
          {loading ? (
            <p className={classes['empty-chat']}>Loading...</p>
          ) : messages?.length > 0 ? (
            messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                onReplay={() => setMessageToReplay(message)}
                scrollToReplayedMessage={() =>
                  scrollToReplayedMessage(message.replayTo.id)
                }
              />
            ))
          ) : (
            <p className={classes['empty-chat']}>
              There are no messages yet! <br />
              Start a conversation!
            </p>
          )}
        </div>
        {messageToReplay && (
          <div className={classes['message-to-replay']}>
            <div className={classes['replay-texts']}>
              <p>Replying to {messageToReplay.displayName}</p>
              <p className={classes['replay-text']}>{messageToReplay.text}</p>
            </div>
            <AiOutlineClose
              className={classes.icon}
              onClick={() => setMessageToReplay(null)}
            />
          </div>
        )}
        <form onSubmit={sendMessage}>
          <input
            value={messageText}
            onClick={markAllAsRead}
            onChange={(e) => setMessageText(e.target.value)}
            ref={chatInput}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
