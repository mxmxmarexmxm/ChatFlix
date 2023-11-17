import { useState } from 'react';

const useSearch = (initialValue = '') => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return {
    searchTerm,
    handleSearch,
  };
};

export default useSearch;
