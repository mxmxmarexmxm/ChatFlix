import React from 'react';
import classes from './ChatInterface.module.css';
import placeholder from '../../assets/img/placeholder.png';
import Message from '../Message';
import { Close } from '../../assets/icons/Close';
import { FullScreen } from '../../assets/icons/FullScreen';
import { FullScreenExit } from '../../assets/icons/FullScreenExit';
import { Send } from '../../assets/icons/Send';

const ChatInterface = ({
  isFullScreen,
  chat,
  toggleChat,
  unreadMessages,
  toggleFullScreen,
  onClose,
  dispalyMessages,
  messages,
  loading,
  messageText,
  setMessageText,
  messagesContainerRef,
  chatInput,
  messageToReplay,
  setMessageToReplay,
  markAllAsRead,
  sendMessage,
  scrollToReplayedMessage,
}) => {
  return (
    <div
      className={`${classes.chat} ${
        isFullScreen && classes[`chat-fullscreen`]
      }`}
    >
      <div className={classes['chat-header']} onClick={toggleChat}>
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
      <div
        className={`${classes['chat-body']}  ${
          !dispalyMessages && classes['chat-body-hidden']
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
    </div>
  );
};

export default ChatInterface;
