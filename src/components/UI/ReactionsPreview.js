import React, { useState, useEffect } from 'react';
import { reactionsIconsArray } from '../Message/MessageUtils';
import classes from './ReactionsPreview.module.css';
import { getUserDataFromFirestore } from '../../services/UserServices';

const ReactionsPreview = ({ reactions }) => {
  const [userReactions, setUserReactions] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Fetch user data and populate userReactions array
    const fetchUserReactions = async () => {
      let userReactionsData = [];
      for (const reaction in reactions) {
        for (const user of reactions[reaction]) {
          const userData = await getUserDataFromFirestore(user); // Fetch user data
          if (userData) {
            userReactionsData.push({
              user: userData, // Replace with the appropriate user data
              reaction,
            });
          }
        }
      }
      setUserReactions(userReactionsData);
      setTotalUsers(userReactionsData.length);
    };

    fetchUserReactions();
  }, [reactions]);

  return (
    <div className={classes['reactions-preview']}>
      <div className={classes['total-users']}>Total Users: {totalUsers}</div>
      <div className={classes['reactions-wrapper']}>
        {userReactions.map(({ user, reaction }, index) => (
          <div key={index} className={classes['reaction-wrapper']}>
            <span>{user.displayName}</span> {reactionsIconsArray[reaction]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionsPreview;
