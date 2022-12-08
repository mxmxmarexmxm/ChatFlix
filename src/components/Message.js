import { useContext } from 'react';
import { AuthContext } from '../Firebase/context';
import classes from './Message.module.css';

function Message(props) {
  const { user } = useContext(AuthContext);
  const { text, uid, photoURL } = props.message;

  const messageSenderClass = uid === user?.uid ? 'sent' : 'received';

  return (
    <div className={`${classes.message} ${classes[messageSenderClass]}`}>
      <div className={classes['image-wrapper']}>
        <img
          className={classes.profileImg}
          src={photoURL}
          referrerPolicy='no-referrer'
          alt='user profile'
        />
      </div>
      <div className={classes['user-name']}>{props.message.displayName}</div>
      <div className={classes['text-wrapper']}>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Message;