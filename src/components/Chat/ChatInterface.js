import React from 'react';
import classes from './ChatInterface.module.css';
import placeholder from '../../assets/img/placeholder.png';
import Message from '../Message/Message';
import { Close } from '../../assets/icons/Close';
import { FullScreen } from '../../assets/icons/FullScreen';
import { FullScreenExit } from '../../assets/icons/FullScreenExit';
import { Send } from '../../assets/icons/Send';
import { DownArrow } from '../../assets/icons/DownArrow';
import { CodeVector } from '../../assets/icons/CodeVector';
import { Hamburger } from '../../assets/icons/Hamburger';
import { UploadImage } from '../../assets/icons/UploadImage';
import Loader from '../UI/Loader';
import { Favorite } from '../../assets/icons/Favorite';

const ChatInterface = ({
  isFullScreen,
  chat,
  toggleChat,
  unreadMessages,
  toggleFullScreen,
  closeChatHandler,
  dispalyMessages,
  messages,
  loading,
  messageText,
  messagesContainerRef,
  chatInputRef,
  messageToReplay,
  setMessageToReplay,
  markAllAsRead,
  sendMessage,
  scrollToReplayedMessage,
  isAtBottom,
  scrollToBottom,
  isCode,
  setIsCode,
  onEnterPress,
  handleInputChange,
  handlePhotoUpload,
  photos,
  setPhotos,
  replayToDisplayName,
  imgUploadLoading,
  setShowSideChats,
  toggleFavoriteChat,
  isFavoriteChat,
}) => {
  return (
    <div
      className={`${classes.chat} ${
        isFullScreen && classes[`chat-fullscreen`]
      }`}
    >
      <div className={classes['chat-header']} onClick={toggleChat}>
        {isFullScreen && (
          <button
            className={classes['hamburger-btn']}
            onClick={() => setShowSideChats((show) => !show)}
          >
            <Hamburger />
          </button>
        )}

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
            className={`${classes['chat-header-icon-wrapper']} ${
              isFavoriteChat ? classes['isFavoriteChat'] : ''
            }`}
            title="Favorite Chat"
            onClick={(event) => toggleFavoriteChat(event, chat)}
          >
            <Favorite height="18px" />
          </div>
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
            onClick={() => closeChatHandler(chat.id)}
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
            <Loader />
          ) : messages?.length > 0 ? (
            messages.map((message, index) => (
              <Message
                key={message.id}
                message={message}
                chatName={chat.name}
                fistUnreadMessage={messages?.length - unreadMessages === index}
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
        <div className={classes['chat-footer']}>
          {(imgUploadLoading || photos.length > 0) && (
            <div className={classes['uploaded-images-wrapper']}>
              {photos?.map((photo, index) => (
                <div key={index} className={classes['uploaded-image']}>
                  <Close
                    onClick={() =>
                      setPhotos((photos) => {
                        return photos.filter((_, i) => i !== index);
                      })
                    }
                  />
                  <img src={photo} alt="Uploaded" />
                </div>
              ))}
              {imgUploadLoading && <div className={classes['loader']}></div>}
            </div>
          )}
          {messageToReplay && (
            <div className={classes['message-to-replay']}>
              <div className={classes['replay-message-content']}>
                <p>Replying to {replayToDisplayName}</p>
                <p className={classes['replay-message-text']}>
                  {messageToReplay.text || 'Image'}
                </p>
              </div>
              <Close onClick={() => setMessageToReplay(null)} />
            </div>
          )}
          <DownArrow
            className={`${classes['scroll-down-icon']} ${
              !isAtBottom && classes['display']
            }`}
            onClick={scrollToBottom}
          />
          <form onSubmit={sendMessage}>
            <div className={classes['buttons-wrapper']}>
              <button
                className={`${classes['is-code-btn']} ${
                  isCode && classes['active']
                }`}
                type="button"
                onClick={() => setIsCode((isCode) => !isCode)}
                title="Code Block"
              >
                <CodeVector />
              </button>
              <button type="button" className={classes['img-uploader']}>
                <UploadImage />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  placeholder="none"
                  name="photoUrl"
                  title="Send a picture"
                  multiple
                />
              </button>
            </div>
            <textarea
              value={messageText}
              onChange={handleInputChange}
              ref={chatInputRef}
              aria-label="Chat Message textarea"
              onKeyDown={onEnterPress}
              onClick={markAllAsRead}
            />
            <button type="submit" disabled={imgUploadLoading}>
              <Send />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
