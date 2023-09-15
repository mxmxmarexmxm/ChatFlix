import React, { useContext } from 'react';
import { AuthContext } from '../Firebase/context';
import classes from './UserProfile.module.css';
import userPlaceholder from '../assets/img/user-placeholder.png';

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  // console.log(user);
  return (
    <div className={classes['user-card']}>
      <div className={classes['profile-img-wrapper']}>
        <img src={user.photoURL || userPlaceholder} />
      </div>
      <span>{user.displayName}</span>
      <span>{user.email}</span>
    </div>
  );
};

export default UserProfile;
