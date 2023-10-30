import React, { useState, useEffect } from 'react';
import { reactionsIconsArray } from '../Message/MessageUtils';
import classes from './ReactionsPreview.module.css';
import { useModal } from '../../context/ModalContext';
import { getUserDataFromFirestore } from '../../services/UserServices';
import UserProfile from '../UserProfile';
import Loader from './Loader';

const ReactionsPreview = ({ reactions }) => {
  const [userReactions, setUserReactions] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    const fetchUserReactions = async () => {
      setLoading(true);
      let userReactionsData = [];
      for (const reaction in reactions) {
        for (const user of reactions[reaction]) {
          const userData = await getUserDataFromFirestore(user);
          if (userData) {
            console.log(userData);
            userReactionsData.push({
              displayName: userData.displayName,
              reaction,
              uid: user,
              photoURL: userData.photoURL,
            });
          }
        }
      }
      setUserReactions(userReactionsData);
      setTotalUsers(userReactionsData.length);
      setLoading(false);
    };

    fetchUserReactions();
  }, [reactions]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={classes['reactions-preview']}>
      <div className={classes['total-users']}>Total Users: {totalUsers}</div>
      <div className={classes['reactions-wrapper']}>
        {userReactions.map(
          ({ displayName, reaction, photoURL, uid }, index) => (
            <div key={index} className={classes['reaction-wrapper']}>
              <div
                className={classes['name-photo-wrapper']}
                onClick={() => openModal(<UserProfile uid={uid} />)}
              >
                <div className={classes['profile-image-wrapper']}>
                  <img src={photoURL} />
                </div>
                <span>{displayName}</span>
              </div>
              {reactionsIconsArray[reaction]}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ReactionsPreview;
