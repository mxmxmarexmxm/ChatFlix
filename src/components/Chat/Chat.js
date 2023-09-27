import React, { useContext, useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import classes from './Chat.module.css';
import placeholder from '../../assets/img/placeholder.png';
import ChatHead from './ChatHead';
import SideChatFullscreen from './SideChatFullscreen';
import Message from '../Message';
import useSound from 'use-sound';
import notificationSound from '../../assets/Sound/notification-sound.mp3';
import firebase from '../../Firebase/Firebase';
import { AuthContext } from '../../Firebase/context';
import 'firebase/compat/firestore';
import { useModal } from '../../context/ModalContext';
import AuthForm from '../../auth/AuthForm';
import { Close } from '../../assets/icons/Close';
import { FullScreen } from '../../assets/icons/FullScreen';
import { FullScreenExit } from '../../assets/icons/FullScreenExit';
import { Send } from '../../assets/icons/Send';
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
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [messageToReplay, setMessageToReplay] = useState(null);
  const [notify] = useSound(notificationSound);
  const { user } = useContext(AuthContext);
  const messagesContainerRef = useRef();
  const chatInput = useRef();
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
          id: new Date().toISOString() + uid,
          readBy: [uid],
          replayTo: messageToReplay,
        });
      }
      scrollToBottom();
      setMessageText('');
    } else {
      openModal(<AuthForm />);
    }
    setMessageToReplay(null);
  };

  const toggleChat = () => {
    if (!isFullScreen) {
      setDisplayMessages((curr) => !curr);
    }
  };

  // Expand chat if selected from home screen and chat is already in active chats container
  useEffect(() => {
    if (chat.name === showMessages) {
      setDisplayMessages(true);
    }
  }, [chat.name, showMessages]);

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

  // Focus chat input
  useEffect(() => {
    const focusInput = () => {
      chatInput?.current?.focus();
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
    <div
      className={`${classes.chat} ${
        isFullScreen && classes[`chat-fullscreen`]
      }`}
    >
      <div
        className={`${classes['chat-header']} ${
          isFullScreen && classes['chat-header-fullscreen']
        }`}
        onClick={toggleChat}
      >
        <div className={classes['logo-title-wrapper']}>
          <div className={classes['chat-header-image-wrapper']}>
            <img
              src={chat.logo}
              alt={chat.name}
              onError={(e) => {
                e.target.src = placeholder;
              }}
            />
          </div>
          <h2>{chat.name}</h2>
        </div>
        <div className={classes[`chat-header-buttons-wrapper`]}>
          {unreadMessages > 0 && !isFullScreen && (
            <div className={classes[`unread-messages-badge`]}>
              {unreadMessages}
            </div>
          )}
          <div
            className={classes['chat-header-icon-wrapper']}
            onClick={toggleFullScreen}
          >
            {isFullScreen ? (
              <FullScreenExit height="20px" />
            ) : (
              <FullScreen height="18px" />
            )}
          </div>
          <div
            className={classes['chat-header-icon-wrapper']}
            onClick={() => onClose(chat.id)}
          >
            <Close height="18px" />
          </div>
        </div>
      </div>
      {dispalyMessages && (
        <div
          className={`${classes['chat-body']} ${
            isFullScreen && classes['chat-body-fullscreen']
          }`}
        >
          <div
            className={classes['messages-container']}
            ref={messagesContainerRef}
          >
            {loading ? (
              <p className={classes['empty-chat-message']}>Loading...</p>
            ) : messages?.length > 0 ? (
              messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  onSetMessageToReplay={() => setMessageToReplay(message)}
                  scrollToReplayedMessage={() =>
                    scrollToReplayedMessage(message.replayTo.id)
                  }
                />
              ))
            ) : (
              <p className={classes['empty-chat-message']}>
                There are no messages yet. <br />
                Start a conversation!
              </p>
            )}
          </div>
          {messageToReplay && (
            <div className={classes['message-to-replay']}>
              <div className={classes['replay-message-content']}>
                <p>Replying to {messageToReplay.displayName}</p>
                <p className={classes['replay-message-text']}>
                  {messageToReplay.text}
                </p>
              </div>
              <Close height="15px" onClick={() => setMessageToReplay(null)} />
            </div>
          )}
          <form onSubmit={sendMessage}>
            <input
              value={messageText}
              onClick={markAllAsRead}
              onChange={(e) => setMessageText(e.target.value)}
              ref={chatInput}
              aria-label="Chat Message Input"
            />
            <button type="submit">
              <Send />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
