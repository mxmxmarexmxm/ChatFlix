import classes from './Header.module.css';
import { useModal } from '../../context/ModalContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../Firebase/context';
import logo from '../../assets/img/logo.png';
import { signOut } from '../../services/AuthServices';
import userPlaceholder from '../../assets/img/user-placeholder.png';
import AuthForm from '../../auth/AuthForm';
import UserProfile from '../UserProfile';

const Header = () => {
  const { openModal, closeModal } = useModal();
  const [openMenu, setOpenMenu] = useState(false);
  const { user } = useContext(AuthContext);
  const menuRef = useRef(null);

  const signOutHandler = () => {
    signOut();
    closeModal();
    setOpenMenu(false);
  };

  // Close menu when a click occurs outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div>
        <a href="/ChatFlix">
          <img src={logo} alt="logo" />
        </a>
      </div>
      {user ? (
        <div className={classes['drop-menu']} ref={menuRef}>
          <div
            className={classes['profile-image-wrapper']}
            onClick={() => setOpenMenu((c) => !c)}
          >
            <img
              alt="profile avatar"
              src={user.photoURL || userPlaceholder}
              referrerPolicy="no-referrer"
            />
          </div>
          {openMenu && (
            <ul>
              <li>
                <button
                  onClick={() =>
                    openModal(<UserProfile personalProfile={user} />)
                  }
                >
                  Your Profile
                </button>
              </li>
              <li>
                <button onClick={() => signOutHandler()}>Sign Out</button>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <button
          className={classes['sign-btn']}
          onClick={() => openModal(<AuthForm />)}
        >
          Sign In
        </button>
      )}
    </header>
  );
};

export default Header;
