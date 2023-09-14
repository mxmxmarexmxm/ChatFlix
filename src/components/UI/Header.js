// Header.js
import classes from './Header.module.css';
import { useModal } from '../../context/ModalContext';
import { useContext } from 'react';
import { AuthContext } from '../../Firebase/context';
import logo from '../../assets/img/logo.png';
import { signOut } from '../../auth/AuthServices';
import userPlaceholder from '../../assets/img/user-placeholder.png';

const Header = () => {
  const { openModal, closeModal } = useModal();
  const { user } = useContext(AuthContext);

  const signOutHandler = () => {
    signOut();
    closeModal();
  };

  return (
    <>
      <header>
        <div>
          <a href="/ChatFlix">
            <img src={logo} alt="logo" />
          </a>
        </div>
        {user ? (
          <div className={classes['sign-out-container']}>
            <button
              className={classes['sign-btn']}
              onClick={() => signOutHandler()}
            >
              Sign Out
            </button>
            <div className={classes['image-wrapper']}>
              <img
                alt="profile avatar"
                src={user.photoURL || userPlaceholder}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ) : (
          <button className={classes['sign-btn']} onClick={openModal}>
            Sign In
          </button>
        )}
      </header>
    </>
  );
};

export default Header;
