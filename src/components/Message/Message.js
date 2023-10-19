import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Firebase/context';
import userPlaceholder from '../../assets/img/user-placeholder.png';
import classes from './Message.module.css';
import { useModal } from '../../context/ModalContext';
import UserProfile from '../UserProfile';
import { Replay } from '../../assets/icons/Replay';
import CodeSnippet from '../UI/CodeSnippet';
import ImagePreview from '../UI/ImagePreview';
import useUserData from '../../hooks/useUserData';
import { Like } from '../../assets/icons/Like';
import { Dislike } from '../../assets/icons/Dislike';
import { Reaction } from '../../assets/icons/Reaction';
import { Laugh } from '../../assets/icons/Laugh';
import {
  handleMessageReaction,
  formatMessage,
  isSameSender,
} from './MessageUtils';

const reactionsIconsArray = {
  like: <Like height="14px" />,
  dislike: <Dislike height="12px" />,
  laugh: <Laugh height="16px" />,
};

const Message = ({
  message,
  onSetMessageToReplay,
  scrollToReplayedMessage,
  fistUnreadMessage,
  chatName,
}) => {
  const [openReactionsMenu, setOpenReactionsMenu] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const actionsReactionsMenuRef = useRef();
  const { user } = useContext(AuthContext);
  const { openModal } = useModal();
  const { text, uid, replayTo, isCode, id, photoUrl, reactions } = message;
  const messageSenderClass = uid === user?.uid ? 'sent' : 'received';
  const senderUserData = useUserData(uid);
  const replayToUserDisplayName = useUserData(replayTo?.uid)?.displayName;
  const sameSender = isSameSender(id, uid);

  const haveReactions =
    reactions &&
    Object.entries(reactions).some(([, users]) => users?.length > 0);

  // Close the reactions menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionsReactionsMenuRef?.current &&
        !actionsReactionsMenuRef?.current.contains(event.target)
      ) {
        setOpenReactionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionsReactionsMenuRef]);

  // Determine the user's reaction based on the message's reactions and the user's ID
  useEffect(() => {
    const userReaction =
      reactions && haveReactions
        ? Object.keys(reactions).find((reaction) =>
            reactions[reaction]?.includes(user.uid)
          )
        : null;

    setUserReaction(userReaction);
  }, [reactions, user.uid, haveReactions]);

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
        } ${haveReactions && classes['have-reactions']}`}
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

          {reactions && haveReactions && (
            <div className={`${classes['reactions-wrapper']}`}>
              {Object.entries(reactions)
                .filter(([, users]) => users.length > 0)
                .map(([reaction, users]) => (
                  <div key={reaction}>
                    {users.length} {reactionsIconsArray[reaction]}
                  </div>
                ))}
            </div>
          )}
        </div>
        <div
          ref={actionsReactionsMenuRef}
          className={classes['actions-and-reactions-wrapper']}
        >
          {openReactionsMenu && (
            <div className={classes['reactions-menu']}>
              <Like
                height="20px"
                width="20px"
                className={
                  userReaction === 'like' ? classes['selected-icon'] : ''
                }
                onClick={() =>
                  handleMessageReaction(
                    'like',
                    chatName,
                    id,
                    setOpenReactionsMenu,
                    user
                  )
                }
              />
              <Dislike
                height="20px"
                width="20px"
                onClick={() =>
                  handleMessageReaction(
                    'dislike',
                    chatName,
                    id,
                    setOpenReactionsMenu,
                    user
                  )
                }
                className={
                  userReaction === 'dislike' ? classes['selected-icon'] : ''
                }
              />
              <Laugh
                height="20px"
                onClick={() =>
                  handleMessageReaction(
                    'laugh',
                    chatName,
                    id,
                    setOpenReactionsMenu,
                    user
                  )
                }
                className={
                  userReaction === 'laugh' ? classes['selected-icon'] : ''
                }
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
