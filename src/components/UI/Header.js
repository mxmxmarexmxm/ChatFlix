// eslint-disable-next-line
import classes from './Header.module.css';
import firebase from '../../Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Header = () => {
  const auth = firebase.auth();
  const [user] = useAuthState(firebase.auth());

  const singInWithGoogle = () => {
    console.log('dadaad');
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  const singOut = () => {
    auth.signOut();
  };

  return (
    <header>
      <h1><a href='/'>ChatFlix</a></h1>
      {user ? (
        <button onClick={singOut}>Sing Out</button>
      ) : (
        <button onClick={singInWithGoogle}>Sing In</button>
      )}
    </header>
  );
};

export default Header;
