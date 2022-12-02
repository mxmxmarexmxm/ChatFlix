import React, { useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Message from './Message';
import classes from './Chat.module.css';
import firebase from 'firebase/compat/app';
import {
  AiOutlineClose,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
} from 'react-icons/ai';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import ChatHead from './ChatHead';
const auth = firebase.auth();
const firestore = firebase.firestore();

const Chat = (props) => {
  const [showChatMessages, setShowChatMessages] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [messageText, setMessageText] = useState('');
  const dummy = useRef();
  const { chatName, showMessages, logo } = props;

  const messageCollection = firestore.collection(
    `/chats/${props.chatName}/messages/`
  );
  const query = messageCollection.orderBy('createdAt', 'asc');

  const [messages, loading] = useCollectionData(query, { idField: 'id' });
  // const ml = messages?.length;

  useEffect(() => {
    if (!showChatMessages && messages.length !== 0) {
      setUnreadMessages((c) => c + 1);
    }
  }, [messages, showChatMessages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (auth.currentUser) {
      const { uid, photoURL, displayName } = auth.currentUser;
      if (messageText.trim() !== '') {
        await messageCollection.add({
          text: messageText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          photoURL,
          id: Math.random() * 10,
          displayName,
        });
      }
      dummy.current.scrollIntoView({ behavior: 'smooth' });
      setMessageText('');
    } else {
      alert('You must be singed in to send message!');
    }
  };

  const showChatHandler = () => {
    if (props.isFullScreen) {
      return;
    }
    setShowChatMessages((curr) => !curr);
    setUnreadMessages(0);
    props.clearShow();
  };

  useEffect(() => {
    if (chatName === showMessages) {
      setShowChatMessages(true);
    }
  }, [chatName, showMessages]);

  const maximizeHandler = (event) => {
    event.stopPropagation();
    props.maximizeChat(chatName);
  };

  let chatBodyClass = showChatMessages
    ? classes['chat-body']
    : classes['hide-body'];

  let chatClass = classes.chat;
  let messagesContainerClass = classes['messages-container'];

  if (props.isFullScreen) {
    chatClass = `${classes.chat} ${classes[`chat-full-screen`]}`;
    messagesContainerClass = `${classes['messages-container']} ${
      classes[`messages-container-full`]
    }`;
  }

  if (props.isChatHead) {
    return (
      <ChatHead
        unreadMessages={unreadMessages}
        readMessages={() => setUnreadMessages(0)}
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
            <img src={logo} alt='avatar' />
          </div>
          <h2>{chatName}</h2>
        </div>
        <div className={classes[`button-wrapper`]}>
          {!showChatMessages && unreadMessages !== 0 && (
            <div className={classes[`unread-messages-badge`]}>
              {unreadMessages}
            </div>
          )}
          <div
            className={classes['icon-btn-wrapper']}
            onClick={maximizeHandler}
          >
            {props.isFullScreen ? (
              <AiOutlineFullscreenExit className={classes.icon} />
            ) : (
              <AiOutlineFullscreen className={classes.icon} />
            )}
          </div>
          <div
            className={classes['icon-btn-wrapper']}
            onClick={props.onClose.bind(this, chatName)}
          >
            <AiOutlineClose className={classes.icon} />
          </div>
        </div>
      </div>
      <div className={chatBodyClass}>
        <div className={messagesContainerClass}>
          {loading ? (
            <p className={classes['empty-chat']}>Loading...</p>
          ) : messages.length !== 0 ? (
            messages.map((msg) => (
              <Message key={msg.id} message={msg} auth={auth} />
            ))
          ) : (
            <p className={classes['empty-chat']}>
              There are no messages yet! <br />
              Start conversation!
            </p>
          )}
          <span ref={dummy}></span>
        </div>
        <form onSubmit={sendMessage}>
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
