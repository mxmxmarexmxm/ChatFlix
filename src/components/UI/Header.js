import classes from './Header.module.css';
import { useModal } from '../../context/ModalContext';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../Firebase/context';
import logo from '../../assets/img/logo.png';
import { signOut } from '../../services/AuthServices';
import userPlaceholder from '../../assets/img/user-placeholder.png';
import AuthForm from '../../auth/AuthForm';
import UserProfile from '../UserProfile';
import useClickOutside from '../../hooks/useClickOutside';
import { Close } from '../../assets/icons/Close';
import { Profile } from '../../assets/icons/Profile';
import { LogOut } from '../../assets/icons/LogOut';

const Header = ({ setSearchTerm, searchTerm }) => {
  const { openModal, closeModal } = useModal();
  const [openMenu, setOpenMenu] = useState(false);
  const { user } = useContext(AuthContext);
  const menuRef = useRef(null);

  const signOutHandler = () => {
    signOut();
    closeModal();
    setOpenMenu(false);
  };

  // Close the menu when a click occurs outside it
  useClickOutside(menuRef, () => {
    setOpenMenu(false);
  });

  return (
    <header>
      <div className={classes['header-logo-wrapper']}>
        <img src={logo} alt="chatflix-logo" />
      </div>
      <div className={classes['input-wrapper']}>
        <Close onClick={() => setSearchTerm('')} title="Remove" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
      </div>
      {user ? (
        <div className={classes['drop-menu']} ref={menuRef}>
          <div
            className={classes['profile-image-wrapper']}
            onClick={() => setOpenMenu((isOpen) => !isOpen)}
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
                  <Profile />
                  Your Profile
                </button>
              </li>
              <li>
                <button onClick={signOutHandler}>
                  <LogOut />
                  Sign Out
                </button>
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
