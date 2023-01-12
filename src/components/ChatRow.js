import React, { useEffect, useRef } from 'react';
import classes from './ChatRow.module.css';
import { FaGreaterThan, FaLessThan } from 'react-icons/fa';

const ChatRow = (props) => {
  const chatRowRef = useRef();

  let haveScrool = chatRowRef.current?.scrollLeftMax > 0;

  const chats = props.chats.filter((chat) => chat.tags.includes(props.rowTitle));

  const scrollRowHandler = (scrollOffset) => {
    chatRowRef.current.scrollLeft += scrollOffset;
  };

  useEffect(() => {
    scrollRowHandler(-1000);
  }, []);

  return (
    <div className={classes.chatRow}>
      <h2>{props.rowTitle}</h2>
      <div className={classes.row}>
        {haveScrool && (
          <button onClick={() => scrollRowHandler(-200)}>
            <FaLessThan />
          </button>
        )}
        <div ref={chatRowRef} className={classes.chats}>
          {chats.map((chat) => (
            <img
              className={classes.logo}
              onClick={props.onSelectChat.bind(this, chat)}
              src={chat.logo}
              alt={chat.chatName}
              key={chat.id}
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
