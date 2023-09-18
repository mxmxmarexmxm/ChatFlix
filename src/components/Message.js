import { useContext } from 'react';
import { AuthContext } from '../Firebase/context';
import { BsArrowReturnLeft } from 'react-icons/bs';
import userPlaceholder from '../assets/img/user-placeholder.png';
import classes from './Message.module.css';

function Message(props) {
  const { user } = useContext(AuthContext);
  const { text, uid, photoURL, replayTo } = props.message;
  const messageSenderClass = uid === user?.uid ? 'sent' : 'received';

  return (
    <div className={`${classes.message} ${classes[messageSenderClass]}`}>
      <div className={classes['image-wrapper']}>
        <img
          className={classes.profileImg}
          src={photoURL || userPlaceholder}
          referrerPolicy="no-referrer"
          alt="user profile"
        />
      </div>
      <div className={classes['user-name']}>{props.message.displayName}</div>
      <div className={classes['mess-div']}>
        {replayTo && (
          <div className={classes['replay-wrapper']}>
            {<p>Replayed to: {replayTo.displayName}</p>}
            {<p>{replayTo.text}</p>}
          </div>
        )}
        <div className={classes['text-wrapper']}>
          <p>{text}</p>
        </div>
      </div>
      <BsArrowReturnLeft
        className={classes.icon}
        onClick={() => props.onReplay(props.message)}
      />
    </div>
  );
}

export default Message;
