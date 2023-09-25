import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Firebase/context';
import userPlaceholder from '../assets/img/user-placeholder.png';
import classes from './Message.module.css';
import { useModal } from '../context/ModalContext';
import UserProfile from './UserProfile';
import { Replay } from '../assets/icons/Replay';
import { getUserDataFromFirestore } from '../auth/AuthServices';

function Message(props) {
  const [sender, setSender] = useState(null);
  const { text, uid, replayTo, id } = props.message;
  const { user } = useContext(AuthContext);
  const { openModal } = useModal();
  const messageSenderClass = uid === user?.uid ? 'sent' : 'received';

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
    <div
      className={`${classes.message} ${classes[messageSenderClass]}`}
      id={id}
    >
      {messageSenderClass === 'received' && (
        <div
          className={classes['image-wrapper']}
          onClick={() => openModal(<UserProfile uid={uid} />)}
        >
          <img
            className={classes.profileImg}
            src={sender?.photoURL || userPlaceholder}
            referrerPolicy="no-referrer"
            alt={sender?.displayName}
          />
        </div>
      )}
      <div className={classes['user-name']}>{sender?.displayName}</div>
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
