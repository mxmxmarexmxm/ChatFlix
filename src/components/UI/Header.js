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
        <a href='/ChatFlix'>ChatFlix</a>
      </h1>
      {user ? (
        <button className={classes['sign-btn']} onClick={signOut}>
          Sign Out
        </button>
      ) : (
        <button className={classes['sign-btn']} onClick={signInWithGoogle}>
          Sign In
        </button>
      )}
    </header>
  );
};

export default Header;