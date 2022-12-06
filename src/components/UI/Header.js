// eslint-disable-next-line
import classes from './Header.module.css';
import firebase from '../../Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Header = () => {
  let auth = firebase.auth();
  const [user] = useAuthState(firebase.auth());

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
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={signInWithGoogle}>Sign In</button>
      )}
    </header>
  );
};

export default Header;
