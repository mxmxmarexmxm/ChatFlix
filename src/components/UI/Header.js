// eslint-disable-next-line
import classes from './Header.module.css';
import firebase from '../../Firebase/Firebase';
import { AuthContext } from '../../Firebase/context';
import { useContext } from 'react';

const Header = () => {
  const { user } = useContext(AuthContext);
  let auth = firebase.auth();

  const signInWithGoogle = () => {
    auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  const signOut = () => {
    auth.signOut();
  };

  return (
    <header>
      <h1>
        <a href="/ChatFlix">ChatFlix</a>
      </h1>
      {user ? (
        <div className={classes['divabtn']}>
          <button className={classes['sign-btn']} onClick={signOut}>
            Sign Out
          </button>
          <div className={classes['image-wrapper']}>
            <img alt="profile avatar" src={user.photoURL} />
          </div>
        </div>
      ) : (
        <button className={classes['sign-btn']} onClick={signInWithGoogle}>
          Sign In
        </button>
      )}
    </header>
  );
};

export default Header;
