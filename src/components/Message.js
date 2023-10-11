import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Firebase/context';
import userPlaceholder from '../assets/img/user-placeholder.png';
import classes from './Message.module.css';
import { useModal } from '../context/ModalContext';
import UserProfile from './UserProfile';
import { Replay } from '../assets/icons/Replay';
import { getUserDataFromFirestore } from '../services/UserServices';
import CodeSnippet from './UI/CodeSnippet';
import ImagePreview from './UI/ImagePreview';
const urlRegex = /(https?:\/\/[^\s]+?(?=\s|$))/g;

const Message = ({
  message,
  onSetMessageToReplay,
  scrollToReplayedMessage,
  fistUnreadMessage,
}) => {
  const [sender, setSender] = useState(null);
  const { user } = useContext(AuthContext);
  const { openModal } = useModal();
  const { text, uid, replayTo, isCode, id, photoUrl } = message;
  const messageSenderClass = uid === user?.uid ? 'sent' : 'received';

  const nextSibling = document.getElementById(id)?.nextSibling;
  const nextSiblingId = nextSibling?.id.split('/')[1];
  const sameSender = nextSiblingId === uid;

  const formatMessage = (text) => {
    // Split the message text into segments based on URLs
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

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserDataFromFirestore(uid);
      if (userData) {
        setSender(userData);
      }
    };

    fetchUserData();
  }, [uid]);

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
              src={sender?.photoURL || userPlaceholder}
              referrerPolicy="no-referrer"
              alt={sender?.displayName}
            />
          </div>
        )}
        <div className={classes['user-name']}>{sender?.displayName}</div>
        <div className={classes['message-wrapper']}>
          {replayTo && (
            <div
              className={classes['replay-wrapper']}
              onClick={scrollToReplayedMessage}
            >
              <p>
                {sender?.displayName} replied to: {replayTo?.displayName}
              </p>
              <p>{replayTo.text}</p>
            </div>
          )}
          <div
            className={`${classes['text-wrapper']} ${
              isCode && classes['code-wrapper']
            }`}
          >
            {isCode ? <CodeSnippet code={text} /> : formatMessage(text)}
          </div>
          {photoUrl && (
            <div className={classes['image-wrapper']}>
              <img
                src={photoUrl}
                alt="img"
                onClick={() => openModal(<ImagePreview url={photoUrl} />)}
              />
            </div>
          )}
        </div>
        <Replay
          height="15px"
          fill="gray"
          className={classes.icon}
          onClick={onSetMessageToReplay}
        />
      </div>
    </>
  );
};

export default Message;
