import React, { useEffect, useRef } from 'react';
import classes from './ChatRow.module.css';

const ChatRow = (props) => {
  const div = useRef();

  const scroll = (scrollOffset) => {
    div.current.scrollLeft += scrollOffset;
  };

  useEffect(()=>{
    scroll(-1000)
  },[])

  return (
    <div className={classes.container}>
      <h2>{props.rowTitle}</h2>
      <div className={classes.row}>
        <button onClick={() => scroll(-200)}>{`<`}</button>
        <div ref={div} className={classes.scroll}>
          {props.chats
            .filter((chat) => chat.tags.includes(props.rowTitle))
            .map((chat) => (
              <img
                className={classes['logo']}
                onClick={props.onSelectChat.bind(this, chat)}
                src={chat.logo}
                alt={chat.chatName}
                key={chat.chatName}
              />
            ))}
        </div>
        <button onClick={() => scroll(200)}>{`>`}</button>
      </div>
    </div>
  );
};

export default ChatRow;
