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
  const [messageText, setMessageText] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(null);
  const dummy = useRef();

  const { chatName, showMessages, logo } = props;

  const messageCollection = firestore.collection(
    `/chats/${props.chatName}/messages/`
  );
  const query = messageCollection.orderBy('createdAt', 'asc');
  const [messages, loading] = useCollectionData(query, { idField: 'id' });

  // Get unread messages
  useEffect(() => {
    const getUnredMessages = () => {
      if (auth.currentUser === null) {
        return;
      }
      const unreadMessages = messages?.filter(
        (message) => !message.readBy.includes(auth.currentUser.uid)
      ).length;

      setUnreadMessages(unreadMessages);
    };
    getUnredMessages();
  }, [messages]);

  // Mark all previous messages as read when user click on input
  const markAllAsRead = async () => {
    if (auth.currentUser) {
      await messageCollection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            readBy: firebase.firestore.FieldValue.arrayUnion(
              auth.currentUser.uid
            ),
          });
        });
      });
    }
  };

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
          id: new Date().toISOString() + uid,
          displayName,
          readBy: [uid],
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

  if (props.fullScreenSideChat) {
    return (
      <div className={classes['active-chat-side']} onClick={props.onClick}>
        <div className={classes['chat-and-logo-side']}>
          <div className={classes['logo-container-side']}>
            <img src={logo} alt='img' />
          </div>
          <h2>{chatName}</h2>
        </div>
        <div
          className={classes['badges-container-side']}
          onClick={(e) => e.stopPropagation()}
        >
          {unreadMessages !== 0 && (
            <div className={classes[`unread-messages-badge`]}>
              {unreadMessages}
            </div>
          )}
          <div
            className={classes['icon-btn-wrapper-side']}
            onClick={props.onClose}
          >
            <AiOutlineClose className={classes['icon-side']} />
          </div>
        </div>
      </div>
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
            onClick={markAllAsRead}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
