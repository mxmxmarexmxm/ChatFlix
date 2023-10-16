import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../Firebase/context';
import userPlaceholder from '../assets/img/user-placeholder.png';
import classes from './Message.module.css';
import { useModal } from '../context/ModalContext';
import UserProfile from './UserProfile';
import { Replay } from '../assets/icons/Replay';
import CodeSnippet from './UI/CodeSnippet';
import ImagePreview from './UI/ImagePreview';
import useUserData from '../hooks/useUserData';
import { Like } from '../assets/icons/Like';
import { Dislike } from '../assets/icons/Dislike';
import firebase from '../Firebase/Firebase';
import { Reaction } from '../assets/icons/Reaction';
const urlRegex = /(https?:\/\/[^\s]+?(?=\s|$))/g;
const firestore = firebase.firestore();

const Message = ({
  message,
  onSetMessageToReplay,
  scrollToReplayedMessage,
  fistUnreadMessage,
  chatName,
}) => {
  const [openReactionsMenu, setOpenReactionsMenu] = useState(false);
  const reactionMenuRef = useRef();
  const { user } = useContext(AuthContext);
  const { openModal } = useModal();
  const { text, uid, replayTo, isCode, id, photoUrl, reactions } = message;
  const messageSenderClass = uid === user?.uid ? 'sent' : 'received';
  const senderUserData = useUserData(uid);
  const replayToUserDisplayName = useUserData(replayTo?.uid)?.displayName;
  const nextSibling = document.getElementById(id)?.nextSibling;
  const nextSiblingId = nextSibling?.id.split('*')[1];
  const sameSender = nextSiblingId === uid;

  // Split the message text into segments based on URLs
  const formatMessage = (text) => {
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

  const handleMessageReaction = async (emoji) => {
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
              const userIndex = messageData.reactions[reaction].indexOf(
                user.uid
              );
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

  const reactionsIconsArray = {
    like: <Like height="14px" fill="white" />,
    dislike: <Dislike height="12px" fill="white" />,
  };

  // Close the reactions menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reactionMenuRef?.current &&
        !reactionMenuRef?.current.contains(event.target)
      ) {
        setOpenReactionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [reactionMenuRef]);

  return (
    <>
      {fistUnreadMessage && (
        <div className={classes['first-unread-message']}>
          <div></div>
          Unread Messages
          <div></div>
        </div>
      )}
      <div
        className={`${classes.message} ${classes[messageSenderClass]} ${
          sameSender && classes['same-sender']
        }`}
        id={id}
      >
        {messageSenderClass === 'received' && (
          <div
            className={classes['profile-image-wrapper']}
            onClick={() => openModal(<UserProfile uid={uid} />)}
          >
            <img
              src={senderUserData?.photoURL || userPlaceholder}
              referrerPolicy="no-referrer"
              alt={senderUserData?.displayName}
            />
          </div>
        )}
        <div className={classes['user-name']}>
          {senderUserData?.displayName}
        </div>
        <div className={classes['message-wrapper']}>
          {replayTo && (
            <div
              className={classes['replay-wrapper']}
              onClick={scrollToReplayedMessage}
            >
              <p>
                {messageSenderClass === 'sent'
                  ? 'You'
                  : senderUserData?.displayName}{' '}
                replied to{' '}
                {replayToUserDisplayName === senderUserData?.displayName &&
                messageSenderClass === 'sent'
                  ? 'yourself'
                  : replayToUserDisplayName}
              </p>
              <p>{replayTo.text}</p>
              {replayTo?.photoUrl && (
                <div className={classes['image-wrapper']}>
                  <img
                    src={replayTo?.photoUrl}
                    alt="img"
                    onClick={() =>
                      openModal(<ImagePreview url={replayTo?.photoUrl} />)
                    }
                  />
                </div>
              )}
            </div>
          )}
          {text && (
            <div
              className={`${classes['text-wrapper']} ${
                isCode && classes['code-wrapper']
              }`}
            >
              {isCode ? <CodeSnippet code={text} /> : formatMessage(text)}
            </div>
          )}
          {photoUrl && (
            <div className={classes['image-wrapper']}>
              <img
                src={photoUrl}
                alt="img"
                onClick={() => openModal(<ImagePreview url={photoUrl} />)}
              />
            </div>
          )}

          {reactions && (
            <div className={`${classes['reactions-wrapper']}`}>
              {Object.entries(reactions).map(([reaction, users]) => {
                if (users.length === 0) {
                  return;
                }
                return (
                  <div key={reaction}>
                    {users.length}
                    {reactionsIconsArray[reaction]}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className={classes['actions-and-reactions-wrapper']}>
          {openReactionsMenu && (
            <div ref={reactionMenuRef} className={classes['reactions-menu']}>
              <Like
                height="20px"
                onClick={() => handleMessageReaction('like')}
              />
              <Dislike
                height="17px"
                onClick={() => handleMessageReaction('dislike')}
              />
            </div>
          )}
          <div className={classes['actions-menu']}>
            <Replay
              height="15px"
              fill="gray"
              className={classes.icon}
              onClick={onSetMessageToReplay}
            />
            <Reaction
              height="20px"
              fill="gray"
              className={`${classes.icon}`}
              onClick={() => setOpenReactionsMenu((c) => !c)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
