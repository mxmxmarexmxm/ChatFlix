import { useContext, useEffect, useRef, useState } from 'react';
import classes from './Message.module.css';
import { AuthContext } from '../../Firebase/context';
import { useModal } from '../../context/ModalContext';
import UserProfile from '../UserProfile';
import CodeSnippet from '../UI/CodeSnippet';
import ImagePreview from '../UI/ImagePreview';
import useUserData from '../../hooks/useUserData';
import {
  handleMessageReaction,
  formatMessage,
  isSameSender,
} from './MessageUtils';
import userPlaceholder from '../../assets/img/user-placeholder.png';
import { Replay } from '../../assets/icons/Replay';
import { Reaction } from '../../assets/icons/Reaction';
import { reactionsIconsArray } from './MessageUtils';
import ReactionsPreview from '../UI/ReactionsPreview';
import useClickOutside from '../../hooks/useClickOutside';
import AuthForm from '../../auth/AuthForm';

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

  const filteredReactions =
    reactions &&
    Object.entries(reactions).filter(([, users]) => users.length > 0);

  const haveReactions = filteredReactions?.length > 0;

  // Close the reactions menu when a click occurs outside of it
  useClickOutside(actionsReactionsMenuRef, () => {
    setOpenReactionsMenu(false);
  });

  // Determine the user's reaction based on the message's reactions and the user's ID
  useEffect(() => {
    const userReaction =
      user && reactions
        ? Object.keys(reactions).find((reaction) =>
            reactions[reaction]?.includes(user.uid)
          )
        : null;

    setUserReaction(userReaction);
  }, [reactions, user]);

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

          {haveReactions && (
            <div className={`${classes['reactions-wrapper']}`}>
              {Object.entries(reactions)
                .filter(([, users]) => users.length > 0)
                .map(([reaction, users]) => (
                  <div
                    key={reaction}
                    onClick={() =>
                      openModal(
                        <ReactionsPreview reactions={filteredReactions} />
                      )
                    }
                  >
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
              {Object.keys(reactionsIconsArray).map((reaction) => (
                <div
                  key={reaction}
                  className={
                    userReaction === reaction ? classes['selected-icon'] : ''
                  }
                  onClick={() => {
                    if (!user) {
                      openModal(<AuthForm />);
                      return;
                    }
                    handleMessageReaction(
                      reaction,
                      chatName,
                      id,
                      setOpenReactionsMenu,
                      user
                    );
                  }}
                >
                  {reactionsIconsArray[reaction]}
                </div>
              ))}
            </div>
          )}
          <div className={classes['actions-menu']}>
            <Replay
              height="15px"
              className={classes.icon}
              onClick={onSetMessageToReplay}
            />
            <Reaction
              height="20px"
              className={`${classes.icon}`}
              onClick={() => setOpenReactionsMenu((isOpened) => !isOpened)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
