import firebase from '../../Firebase/Firebase';
import { Love } from '../../assets/icons/Love';
import { Like } from '../../assets/icons/Like';
import { Dislike } from '../../assets/icons/Dislike';
import { Laugh } from '../../assets/icons/Laugh';
import { Angry } from '../../assets/icons/Angry';
const firestore = firebase.firestore();
const urlRegex = /(https?:\/\/[^\s]+?(?=\s|$))/g;

export const reactionsIconsArray = {
  like: <Like />,
  dislike: <Dislike />,
  laugh: <Laugh />,
  angry: <Angry />,
  love: <Love />,
};

export const handleMessageReaction = async (
  emoji,
  chatName,
  id,
  setOpenReactionsMenu,
  user
) => {
  const messageRef = firestore
    .collection(`/chats/${chatName}/messages`)
    .doc(id);

  try {
    const messageDoc = await messageRef.get();

    if (messageDoc.exists) {
      const messageData = messageDoc.data();

      // Initialize the reactions object if it doesn't exist
      if (!messageData.reactions) {
        messageData.reactions = {
          like: [],
          dislike: [],
          love: [],
          laugh: [],
          sad: [],
          angry: [],
          wow: [],
        };
      }

      // Check if the user has already reacted
      const userReactions = Object.keys(messageData.reactions).filter(
        (reaction) => messageData.reactions[reaction].includes(user.uid)
      );

      if (messageData.reactions[emoji] && userReactions.includes(emoji)) {
        // User has already reacted with this emoji, remove the reaction
        const userIndex = messageData.reactions[emoji].indexOf(user.uid);
        messageData.reactions[emoji].splice(userIndex, 1);
      } else {
        // User hasn't reacted with this emoji, add the reaction and remove from other reactions
        messageData.reactions[emoji].push(user.uid);
        userReactions.forEach((reaction) => {
          if (reaction !== emoji) {
            const userIndex = messageData.reactions[reaction].indexOf(user.uid);
            messageData.reactions[reaction].splice(userIndex, 1);
          }
        });
      }

      // Update the document with the new reactions object
      await messageRef.update({ reactions: messageData.reactions });
    } else {
      console.error('Message document does not exist.');
    }
  } catch (error) {
    console.error('Error updating reactions:', error);
  }
  setOpenReactionsMenu(false);
};

// Split the message text into segments based on URLs
export const formatMessage = (text) => {
  const segments = text.split(urlRegex);

  // Initialize an array to store the formatted message components
  const formattedText = [];

  // Process each segment
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment?.match(urlRegex)) {
      // If the segment is a URL, create an anchor element
      const url = segment.trim();
      formattedText.push(
        <a href={url} target="_blank" rel="noopener noreferrer" key={i}>
          {url}
        </a>
      );
    } else {
      // If the segment is plain text, add it as a text node
      formattedText.push(<span key={i}>{segment}</span>);
    }
  }

  return formattedText;
};

export const isSameSender = (id, uid) => {
  const nextSibling = document.getElementById(id)?.nextSibling;
  const nextSiblingId = nextSibling?.id.split('*')[1];
  const sameSender = nextSiblingId === uid;

  return sameSender;
};
