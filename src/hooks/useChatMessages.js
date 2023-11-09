import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Firebase/context';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from '../Firebase/Firebase';
import 'firebase/compat/firestore';
const firestore = firebase.firestore();

function useChatMessages(chatName) {
  const [unreadMessages, setUnreadMessages] = useState(null);
  const { user } = useContext(AuthContext);
  const messageCollection = firestore.collection(
    `/chats/${chatName}/messages/`
  );
  const query = messageCollection.orderBy('createdAt', 'asc');
  const [messages, loading] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    const getUnreadMessages = () => {
      let unreadMessagesCount = 0;

      // Start from the end of messages
      for (let i = messages?.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.readBy.includes(user.uid) || unreadMessagesCount >= 99) {
          break;
        }
        unreadMessagesCount++;
      }
      setUnreadMessages(unreadMessagesCount);
    };

    user && getUnreadMessages();
  }, [messages, user]);

  // Mark all previous messages as read when user clicks on input
  const markAllAsRead = async () => {
    if (user && unreadMessages) {
      try {
        const querySnapshot = await messageCollection
          .orderBy('createdAt', 'desc')
          .limit(unreadMessages)
          .get();

        querySnapshot.forEach(async (doc) => {
          await doc.ref.update({
            readBy: firebase.firestore.FieldValue.arrayUnion(user.uid),
          });
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  return {
    messages,
    loading,
    unreadMessages,
    messageCollection,
    markAllAsRead,
  };
}

export default useChatMessages;
