import React, { useEffect, useRef, useState } from 'react';
import classes from './ChatRow.module.css';
import { LeftArrow } from '../assets/icons/LeftArrow';
import { RightArrow } from '../assets/icons/RightArrow';
import { chatsData } from '../data/data';
import placeholder from '../assets/img/placeholder.png';
import useWindowWidth from '../hooks/useWindowWidth';
import { useChatContext } from '../context/ChatContext';

const ChatRow = ({ rowTitle, onSelectChat }) => {
  const { favoriteChats } = useChatContext();
  const { width } = useWindowWidth();
  const chatRowRef = useRef();
  const [haveScrool, setHaveScrool] = useState(false);
  const isMobile = width < 500;

  const chats = [...chatsData, ...favoriteChats].filter((chat) =>
    chat.tags.includes(rowTitle)
  );
  
  const isNotEmpty = chats?.length !== 0;

  const scrollRowHandler = (scrollOffset) => {
    chatRowRef.current.scrollLeft += scrollOffset;
  };

  const checkHorizontalOverflow = () => {
    isNotEmpty &&
      setHaveScrool(
        chatRowRef.current.scrollWidth > chatRowRef.current.clientWidth
      );
  };

  useEffect(() => {
    isNotEmpty && scrollRowHandler(-1000);
    checkHorizontalOverflow();

    window.addEventListener('resize', checkHorizontalOverflow);

    return () => {
      window.removeEventListener('resize', checkHorizontalOverflow);
    };
  }, []);

  return (
    <>
      {isNotEmpty && (
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
            <div className={classes['chats-outer-wrapper']}>
              <div ref={chatRowRef} className={classes['chats-inner-wrapper']}>
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
      )}
    </>
  );
};

export default ChatRow;
