import classes from './Header.module.css';
import firebase from '../../Firebase/Firebase';
import { AuthContext } from '../../Firebase/context';
import { useContext, useState } from 'react';
import logo from '../../assets/img/logo.png';
import Modal from './Modal';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  let auth = firebase.auth();

  const signInWithGoogle = () => {
    auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  const signOut = () => {
    auth.signOut();
    setShowModal(false);
  };

  return (
    <>
      <Modal onConfirm={signOut} onClose={() => setShowModal(false)} show={showModal} />
      <header>
        <div>
          <a href="/ChatFlix">
            <img src={logo} alt="logo" />
          </a>
        </div>
        {user ? (
          <div className={classes['sign-out-container']}>
            <button className={classes['sign-btn']} onClick={() => setShowModal(true)}>
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
    </>
  );
};

export default Header;
