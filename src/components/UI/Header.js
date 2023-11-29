import classes from './Header.module.css';
import { useModal } from '../../context/ModalContext';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../Firebase/context';
import logo from '../../assets/img/logo.png';
import { logOut } from '../../services/AuthServices';
import userPlaceholder from '../../assets/img/user-placeholder.png';
import AuthForm from '../../auth/AuthForm';
import UserProfile from '../UserProfile';
import useClickOutside from '../../hooks/useClickOutside';
import { Close } from '../../assets/icons/Close';
import { Profile } from '../../assets/icons/Profile';
import { LogOutIcon } from '../../assets/icons/LogOutIcon';
import { Sound } from '../../assets/icons/Sound';
import Toggle from './Toggle';
import { useSettingsContext } from '../../context/SettingsContext';

const Header = ({ setSearchTerm, searchTerm }) => {
  const { openModal, closeModal } = useModal();
  const [openMenu, setOpenMenu] = useState(false);
  const { user } = useContext(AuthContext);
  const { settings, setSettings } = useSettingsContext();
  const menuRef = useRef(null);

  const logOutHandler = () => {
    logOut();
    closeModal();
    setOpenMenu(false);
  };

  // Close the menu when a click occurs outside it
  useClickOutside(menuRef, () => {
    setOpenMenu(false);
  });

  const onSoundToggle = () => {
    setSettings((currSettings) => {
      return {
        ...currSettings,
        notificationsSound: !currSettings.notificationsSound,
      };
    });
  };

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
                  aria-label="Your Profile"
                >
                  <Profile />
                  Your Profile
                </button>
              </li>
              <li>
                <div>
                  <Toggle
                    initialChecked={settings?.notificationsSound}
                    label="Sound"
                    icon={<Sound />}
                    onToggle={onSoundToggle}
                  />
                </div>
              </li>
              <li>
                <button onClick={logOutHandler} aria-label="Log Out">
                  <LogOutIcon />
                  Log Out
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
