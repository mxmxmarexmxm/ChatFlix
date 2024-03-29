import React, { useCallback, useEffect, useRef, useState } from 'react';
import classes from './ChatRow.module.css';
import { LeftArrow } from '../assets/icons/LeftArrow';
import { RightArrow } from '../assets/icons/RightArrow';
import placeholder from '../assets/img/placeholder.png';
import useWindowWidth from '../hooks/useWindowWidth';
import { useChatContext } from '../context/ChatContext';
import UnreadFavChatBadge from './UI/UnreadFavChatBadge';
import { useSettingsContext } from '../context/SettingsContext';

const ChatRow = ({ rowTitle, filteredChatsData }) => {
  const { selectChatHandler } = useChatContext();
  const { settings } = useSettingsContext();

  const { width } = useWindowWidth();
  const chatRowRef = useRef();
  const [haveScrool, setHaveScrool] = useState(false);
  const isMobile = width < 500;

  const chats = [...filteredChatsData].filter((chat) =>
    chat.tags.includes(rowTitle)
  );

  const isNotEmpty = chats?.length !== 0;

  const scrollRowHandler = (scrollOffset) => {
    chatRowRef.current.scrollLeft += scrollOffset;
  };

  const checkHorizontalOverflow = useCallback(() => {
    isNotEmpty &&
      setHaveScrool(
        chatRowRef.current.scrollWidth > chatRowRef.current.clientWidth
      );
  }, [isNotEmpty]);

  useEffect(() => {
    isNotEmpty && scrollRowHandler(-1000);
    checkHorizontalOverflow();

    window.addEventListener('resize', checkHorizontalOverflow);

    return () => {
      window.removeEventListener('resize', checkHorizontalOverflow);
    };
  }, [isNotEmpty, checkHorizontalOverflow, chats.length]);

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
            <div
              className={`${classes['chats-outer-wrapper']} ${
                settings.darkMode === false ? classes['light-mode'] : ''
              }`}
            >
              <div ref={chatRowRef} className={classes['chats-inner-wrapper']}>
                {chats.map((chat) => (
                  <div className={classes['logo-container']} key={chat.id}>
                    {rowTitle === 'favorites' && (
                      <UnreadFavChatBadge chat={chat} />
                    )}
                    <img
                      onClick={() => selectChatHandler(chat)}
                      src={chat.logo}
                      alt={chat.name}
                      {...(![
                        'favorites',
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
