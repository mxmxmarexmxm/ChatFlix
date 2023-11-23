import { useEffect, useState } from 'react';
import { chatsData } from '../data/data';
import { useChatContext } from '../context/ChatContext';

const useChatsSearch = (isHomeScreen) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChatsData, setFilteredChatsData] = useState([]);
  const { favoriteChats } = useChatContext();

  useEffect(() => {
    const filteredChatsData = [
      ...chatsData,
      ...(isHomeScreen ? favoriteChats : []),
    ].filter((chat) =>
      chat.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
    );
    setFilteredChatsData(filteredChatsData);
  }, [searchTerm, isHomeScreen, favoriteChats]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return {
    searchTerm,
    handleSearch,
    filteredChatsData,
  };
};

export default useChatsSearch;
