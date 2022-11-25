import classes from './Message.module.css';

function Message(props) {
  const { text, uid, photoURL } = props.message;
  const messageSenderClass =
    uid === props.auth.currentUser?.uid ? 'sent' : 'received';

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
      <div className={classes['text-wrapper']}>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Message;
