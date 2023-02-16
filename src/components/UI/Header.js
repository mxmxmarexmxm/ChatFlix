import classes from './Header.module.css';
import { AuthContext } from '../../Firebase/context';
import { useContext, useState } from 'react';
import logo from '../../assets/img/logo.png';
import Modal from './Modal';
import { signInWithGoogle, signOut } from '../../auth/AuthServices';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  const signOutHandler = () => {
    signOut();
    setShowModal(false);
  };

  return (
    <>
      <Modal
        title="Are you really want to log out?"
        onConfirm={signOutHandler}
        onClose={() => setShowModal(false)}
        visible={showModal}
      />
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
              <img alt="profile avatar" src={user.photoURL} referrerPolicy="no-referrer" />
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
