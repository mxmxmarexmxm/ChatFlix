import React from 'react';
import classes from './Layout.module.css';
import { useChatContext } from '../../context/ChatContext';
import FullScreen from '../../screens/FullScreen';
import HomeScreen from '../../screens/HomeScreen';

const Layout = () => {
  const { fullScreenChat } = useChatContext();
  const content = fullScreenChat ? <FullScreen /> : <HomeScreen />;

  return <div className={classes.layout}>{content}</div>;
};

export default Layout;
