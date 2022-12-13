import { useContext } from 'react';
import { AuthContext } from '../Firebase/context';
import { BsArrowReturnLeft } from 'react-icons/bs';
import classes from './Message.module.css';

function Message(props) {
  const { user } = useContext(AuthContext);
  const { text, uid, photoURL, replayTo } = props.message;
  const messageSenderClass = uid === user?.uid ? 'sent' : 'received';

  return (
    <div className={`${classes.message} ${classes[messageSenderClass]}`}>
      <div className={classes['image-wrapper']}>
        <img
          onClick={props.openPrivate.bind(this, props.message)}
          className={classes.profileImg}
          src={photoURL}
          referrerPolicy='no-referrer'
          alt='user profile'
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
        onClick={props.onReplay.bind(this, props.message)}
      />
    </div>
  );
}

export default Message;
