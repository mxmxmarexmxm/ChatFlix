import React from 'react';
import classes from './Layout.module.css';
import { useChatContext } from '../../context/ChatContext';
import FullScreen from '../../screens/FullScreen';
import HomeScreen from '../../screens/HomeScreen';
import { useSettingsContext } from '../../context/SettingsContext';

const Layout = () => {
  const { settings } = useSettingsContext();
  const { fullScreenChat } = useChatContext();
  const content = fullScreenChat ? <FullScreen /> : <HomeScreen />;
  return (
    <div
      className={`${classes.layout} ${
        !settings.darkMode ? classes['light-mode'] : ''
      }`}
    >
      {content}
    </div>
  );
};

export default Layout;
