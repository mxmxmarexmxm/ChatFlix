import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getUserDataFromFirestore,
  updateUserDataInFirestore,
} from '../services/UserServices';
import { AuthContext } from '../Firebase/context';

const SettingsContext = createContext();

export const useSettingsContext = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const { user } = useContext(AuthContext);

  // Save settings to Firestore.
  useEffect(() => {
    user && updateUserDataInFirestore(user.uid, settings);
  }, [settings, user]);

  // Load settings when the component mounts and when the user changes.
  useEffect(() => {
    user &&
      getUserDataFromFirestore(user.uid).then(({ notificationsSound }) => {
        setSettings({ notificationsSound: notificationsSound });
      });
  }, [user]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
