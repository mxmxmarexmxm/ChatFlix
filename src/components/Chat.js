import React, { useContext, useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import classes from './Chat.module.css';

// Icons
import { AiOutlineClose, AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';

// Components
import ChatHead from './ChatHead';
import SideChatFullScreen from './SideChatFullScreen';
import Message from './Message';
import useSound from 'use-sound';

import notificationSound from '../assets/Sound/notification-sound.mp3';

// Firebase
import firebase from '../Firebase/Firebase';
import { AuthContext } from '../Firebase/context';
import 'firebase/compat/firestore';
const firestore = firebase.firestore();

const Chat = (props) => {
  const [showChatMessages, setShowChatMessages] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [messageToReplay, setMessageToReplay] = useState(null);
  const [notify] = useSound(notificationSound);
  const { user } = useContext(AuthContext);
  const dummy = useRef();

  const { chatName, showMessages, logo } = props.chat;

  let messageCollection = firestore.collection(`/chats/${chatName}/messages/`);

  let query = messageCollection.orderBy('createdAt', 'asc');

  const [messages, loading] = useCollectionData(query, { idField: 'id' });

  // Get unread messages
  useEffect(() => {
    const getUnredMessages = () => {
      if (user === null) {
        return;
      }
      const unreadMessages = messages?.filter(
        (message) => !message.readBy.includes(user.uid)
      ).length;

      setUnreadMessages(unreadMessages);
    };
    getUnredMessages();
  }, [messages, user]);

  useEffect(() => {
    if (unreadMessages > 0) {
      notify();
    }
  }, [unreadMessages, notify]);

  // Mark all previous messages as read when user click on input
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
      dummy.current.scrollIntoView({ behavior: 'smooth' });
      setMessageText('');
    } else {
      alert('You must be signed in to send message!');
    }
    setMessageToReplay(null);
  };

  const showChatHandler = () => {
    if (props.isFullScreen) {
      return;
    }
    setShowChatMessages((curr) => !curr);
    props.clearShow();
  };

  // Expand chat if selected from home screen and chat is already in active chats container
  useEffect(() => {
    if (chatName === showMessages) {
      setShowChatMessages(true);
    }
  }, [chatName, showMessages]);

  const maximizeHandler = (event) => {
    event.stopPropagation();
    props.maximizeChat(chatName);
  };

  let chatBodyClass = showChatMessages ? classes['chat-body'] : classes['hide-body'];

  let chatClass = classes.chat;
  let messagesContainerClass = classes['messages-container'];

  const onReplayHandler = (message) => {
    setMessageToReplay(message);
  };

  if (props.isFullScreen) {
    chatClass = `${classes.chat} ${classes[`chat-full-screen`]}`;
    messagesContainerClass = `${classes['messages-container']} ${
      classes[`messages-container-full`]
    }`;
    chatBodyClass = `${classes['chat-body-full']}`;
  }

  if (props.fullScreenSideChat) {
    return (
      <SideChatFullScreen
        unreadMessages={unreadMessages}
        onClick={props.onClick}
        onClose={props.onClose}
        logo={logo}
        chatName={chatName}
      />
    );
  }

  if (props.isChatHead) {
    return (
      <ChatHead
        unreadMessages={unreadMessages}
        onClick={props.onClick}
        logo={logo}
        onClose={props.onClose.bind(this, chatName)}
      />
    );
  }

  return (
    <div className={chatClass}>
      <div className={classes['chat-head']} onClick={showChatHandler}>
        <div className={classes.logoAndTitle}>
          <div className={classes['chat-head-image-container']}>
            <img src={logo} alt="avatar" />
          </div>
          <h2>{chatName}</h2>
        </div>
        <div className={classes[`button-wrapper`]}>
          {!showChatMessages && unreadMessages > 0 && (
            <div className={classes[`unread-messages-badge`]}>{unreadMessages}</div>
          )}
          <div className={classes['icon-btn-wrapper']} onClick={maximizeHandler}>
            {props.isFullScreen ? (
              <AiOutlineFullscreenExit className={classes.icon} />
            ) : (
              <AiOutlineFullscreen className={classes.icon} />
            )}
          </div>
          <div className={classes['icon-btn-wrapper']} onClick={props.onClose.bind(this, chatName)}>
            <AiOutlineClose className={classes.icon} />
          </div>
        </div>
      </div>
      <div className={chatBodyClass}>
        <div className={messagesContainerClass}>
          {loading ? (
            <p className={classes['empty-chat']}>Loading...</p>
          ) : messages?.length > 0 ? (
            messages.map((message) => (
              <Message key={message.id} message={message} onReplay={onReplayHandler} />
            ))
          ) : (
            <p className={classes['empty-chat']}>
              There are no messages yet! <br />
              Start conversation!
            </p>
          )}
          <span ref={dummy}></span>
        </div>
        {messageToReplay && (
          <div className={classes['message-to-replay']}>
            <div className={classes['replay-texts']}>
              <p>Replying to {messageToReplay.displayName}</p>
              <p className={classes['replay-text']}>{messageToReplay.text}</p>
            </div>
            <AiOutlineClose className={classes.icon} onClick={() => setMessageToReplay(null)} />
          </div>
        )}
        <form onSubmit={sendMessage}>
          <input
            value={messageText}
            onClick={markAllAsRead}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
