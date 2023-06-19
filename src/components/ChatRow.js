import React, { useEffect, useRef } from 'react';
import classes from './ChatRow.module.css';
import { FaGreaterThan, FaLessThan } from 'react-icons/fa';
import { chatsData } from '../data/data';
import placeholder from '../assets/img/placeholder.png';

const ChatRow = (props) => {
  const chatRowRef = useRef();

  let haveScrool = chatRowRef.current?.scrollLeftMax > 0;

  const chats = chatsData.filter((chat) => chat.tags.includes(props.rowTitle));

  const scrollRowHandler = (scrollOffset) => {
    chatRowRef.current.scrollLeft += scrollOffset;
  };

  useEffect(() => {
    scrollRowHandler(-1000);
  }, []);

  return (
    <div className={classes['chat-row-container']}>
      <h2 className={classes['row-title']}>{props.rowTitle}</h2>
      <div className={classes['row-body']}>
        <button onClick={() => scrollRowHandler(-200)}>
          {haveScrool && <FaLessThan />}
        </button>
        <div ref={chatRowRef} className={classes.chats}>
        {chats.map((chat) => (
            <img
              className={classes.logo}
              onClick={() => props.onSelectChat(chat)}
              src={chat.logo}
              alt={chat.chatName}
              key={chat.id}
              onError={(e) => {
                e.target.src = placeholder;
              }}
            />
          ))}
        </div>
        {haveScrool && (
          <button onClick={() => scrollRowHandler(200)}>
            <FaGreaterThan />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatRow;
