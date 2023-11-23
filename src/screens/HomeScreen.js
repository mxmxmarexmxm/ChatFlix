import classes from './HomeScreen.module.css';
import { rowTitles } from '../data/data.js';
import { useState } from 'react';
import Chat from '../components/Chat/Chat.js';
import ChatRow from '../components/ChatRow.js';
import ToggleChatHeadsBtn from '../components/UI/ToggleChatHeadsBtn.js';
import Header from '../components/UI/Header.js';
import ChatHead from '../components/Chat/ChatHead.js';
import { useChatContext } from '../context/ChatContext.js';
import useChatsSearch from '../hooks/useChatsSearch.js';

const HomeScreen = () => {
  const [showChatHeads, setShowChatHeads] = useState(false);
  const { activeChatsBottom, activeChatsRight } = useChatContext();
  const { searchTerm, handleSearch, filteredChatsData } = useChatsSearch(true);

  return (
    <div className={classes['home-screen']}>
      <Header handleSearch={handleSearch} searchTerm={searchTerm} />
      <div className={classes['chat-rows-container']}>
        {rowTitles.map((title) => (
          <ChatRow
            rowTitle={title}
            key={title}
            filteredChatsData={filteredChatsData}
          />
        ))}
      </div>

      <div className={classes['active-chats-container']}>
        <div className={classes['active-chats-bottom']}>
          {activeChatsBottom?.map((chat) => (
            <Chat chat={chat} key={chat.id} />
          ))}
        </div>
        <div className={classes['active-chat-right']}>
          {showChatHeads && (
            <div className={classes['chat-heads-container']}>
              {activeChatsRight.map((chat) => (
                <ChatHead key={chat.id} chat={chat} />
              ))}
            </div>
          )}
          {activeChatsRight?.length > 0 && (
            <ToggleChatHeadsBtn
              showChatHeads={showChatHeads}
              onClick={() => setShowChatHeads((show) => !show)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
