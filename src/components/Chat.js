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
const auth = firebase.auth();
const firestore = firebase.firestore();

const Chat = (props) => {
  const [showChatMessages, setShowChatMessages] = useState(true);
  const [formValue, setFormValue] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const dummy = useRef();
  const { chatName, showMessages, logo } = props;

  const messageCollection = firestore.collection(
    `/chats/${props.chatName}/messages/`
  );
  const query = messageCollection.orderBy('createdAt', 'asc');

  const [messages, loading] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    setUnreadMessages((c) => c + 1);
  }, [messages?.length]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;
    if (formValue !== '') {
      await messageCollection.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
        id: Math.random() * 10,
        displayName,
      });
    }
    dummy.current.scrollIntoView({ behavior: 'smooth' });

    setFormValue('');
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

  return (
    <div className={chatClass}>
      <div className={classes['chat-head']} onClick={showChatHandler}>
        <div className={classes.logoAndTitle}>
          <div className={classes['chat-head-image-container']}>
            <img src={logo} alt='avatar' />
          </div>
          <h2>{chatName}</h2>
        </div>
        {!showChatMessages && unreadMessages !== 0 && unreadMessages}
        <div className={classes[`button-wrapper`]}>
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
              There are no messages yet! Start conversation!
            </p>
          )}
          <span ref={dummy}></span>
        </div>
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
