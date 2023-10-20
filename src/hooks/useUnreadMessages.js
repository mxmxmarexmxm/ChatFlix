// useUnreadMessages.js
import { useEffect, useState } from 'react';

function useUnreadMessages(messages, user) {
  const [unreadMessages, setUnreadMessages] = useState(null);

  useEffect(() => {
    const getUnreadMessages = () => {
      const unreadMessages = messages?.filter(
        (message) => !message.readBy.includes(user.uid)
      ).length;
      setUnreadMessages(unreadMessages);
    };
    user && getUnreadMessages();
  }, [messages, user]);

  return unreadMessages;
}

export default useUnreadMessages;
