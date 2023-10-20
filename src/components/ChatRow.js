import React, { useEffect, useRef, useState } from 'react';
import classes from './ChatRow.module.css';
import { LeftArrow } from '../assets/icons/LeftArrow';
import { RightArrow } from '../assets/icons/RightArrow';
import { chatsData } from '../data/data';
import placeholder from '../assets/img/placeholder.png';
import useWindowWidth from '../hooks/useWindowWidth';

const ChatRow = ({ rowTitle, onSelectChat }) => {
  const { width } = useWindowWidth();
  const chatRowRef = useRef();
  const [haveScrool, setHaveScrool] = useState(false);
  const isMobile = width < 500;

  const chats = chatsData.filter((chat) => chat.tags.includes(rowTitle));

  const scrollRowHandler = (scrollOffset) => {
    chatRowRef.current.scrollLeft += scrollOffset;
  };

  const checkHorizontalOverflow = () => {
    setHaveScrool(
      chatRowRef.current.scrollWidth > chatRowRef.current.clientWidth
    );
  };

  useEffect(() => {
    scrollRowHandler(-1000);
    checkHorizontalOverflow();

    window.addEventListener('resize', checkHorizontalOverflow);

    return () => {
      window.removeEventListener('resize', checkHorizontalOverflow);
    };
  }, []);

  return (
    <div className={classes['chat-row-container']}>
      <h2>{rowTitle}</h2>
      <div className={classes['row-body']}>
        <button
          onClick={() => scrollRowHandler(isMobile ? -200 : -900)}
          className={`${!haveScrool && classes['hide-button']}`}
          aria-label="Scroll Left"
        >
          {haveScrool && <LeftArrow />}
        </button>
        <div ref={chatRowRef} className={classes.chats}>
          {chats.map((chat) => (
            <div className={classes['logo-container']} key={chat.id}>
              <img
                onClick={() => onSelectChat(chat)}
                src={chat.logo}
                alt={chat.name}
                {...(![
                  'frontend',
                  'frontend frameworks',
                  'CSS frameworks',
                ].includes(rowTitle) && { loading: 'lazy' })}
                onError={(e) => {
                  e.target.src = placeholder;
                }}
                onLoad={checkHorizontalOverflow}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => scrollRowHandler(isMobile ? 200 : 900)}
          className={`${!haveScrool && classes['hide-button']}`}
          aria-label="Scroll Right"
        >
          {haveScrool && <RightArrow />}
        </button>
      </div>
    </div>
  );
};

export default ChatRow;
