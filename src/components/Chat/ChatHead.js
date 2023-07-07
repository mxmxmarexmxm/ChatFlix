import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import classes from './ChatHead.module.css';
import placehoder from '../../assets/img/placeholder.png';

const ChatHead = (props) => {
  const { logo, unreadMessages, onSelectChat, onClose } = props;

  return (
    <div className={classes['chat-head-mini']} onClick={onSelectChat}>
      <div className={classes['badges-container']}>
        {!!unreadMessages && (
          <div className={classes['unread-messages']}>
            <span>{unreadMessages < 99 ? unreadMessages : '99+'}</span>
          </div>
        )}
        <div
          className={classes['icon-wrapper']}
          onClick={(e) => e.stopPropagation()}
        >
          <AiOutlineClose
            onClick={onClose}
            className={classes['close-icon-mini']}
          />
        </div>
      </div>
      <div className={classes['image-wrappper']}>
        <img
          src={logo}
          alt="chat head"
          onError={(e) => {
            e.target.src = placehoder;
          }}
        />
      </div>
    </div>
  );
};

export default ChatHead;
