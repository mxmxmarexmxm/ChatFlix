import { useState, useEffect } from 'react';
import { getUserDataFromFirestore } from '../services/UserServices';

const useUserData = (uid) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (uid) {
        const user = await getUserDataFromFirestore(uid);
        setUserData(user);
      }
    };

    fetchUserData();
  }, [uid]);

  return userData;
};

export default useUserData;
