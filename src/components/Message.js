import { useContext } from 'react';
import { AuthContext } from '../Firebase/context';
import userPlaceholder from '../assets/img/user-placeholder.png';
import classes from './Message.module.css';
import { useModal } from '../context/ModalContext';
import UserProfile from './UserProfile';
import { Replay } from '../assets/icons/Replay';

function Message(props) {
  const { user } = useContext(AuthContext);
  const { openModal } = useModal();
  const { text, uid, photoURL, replayTo, displayName, email } = props.message;
  const messageSenderClass = uid === user?.uid ? 'sent' : 'received';

  return (
    <div
      className={`${classes.message} ${classes[messageSenderClass]}`}
      id={props.message.id}
    >
      {messageSenderClass === 'received' && (
        <div
          className={classes['image-wrapper']}
          onClick={() =>
            openModal(<UserProfile user={{ displayName, photoURL, email }} />)
          }
        >
          <img
            className={classes.profileImg}
            src={photoURL || userPlaceholder}
            referrerPolicy="no-referrer"
            alt={displayName}
          />
        </div>
      )}
      <div className={classes['user-name']}>{displayName}</div>
      <div className={classes['mess-div']}>
        {replayTo && (
          <div
            className={classes['replay-wrapper']}
            onClick={props.scrollToReplayedMessage}
          >
            {<p>Replayed to: {replayTo.displayName}</p>}
            {<p>{replayTo.text}</p>}
          </div>
        )}
        <div className={classes['text-wrapper']}>
          <p>{text}</p>
        </div>
      </div>
      <Replay
        height="15px"
        fill="gray"
        className={classes.icon}
        onClick={props.onReplay}
      />
    </div>
  );
}

export default Message;
