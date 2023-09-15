import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Firebase/context';
import classes from './UserProfile.module.css';
import userPlaceholder from '../assets/img/user-placeholder.png';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [newPhoto, setNewPhoto] = useState(null);
  const storage = getStorage();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
    }
  };

  useEffect(() => {
    handleUploadPhoto();
  }, [newPhoto]);

  // Upload the image file to Firebase Storage
  const handleUploadPhoto = async () => {
    if (newPhoto) {
      // Create a reference to the Firebase Storage location where you want to store the image
      const storageRef = ref(
        storage,
        `profile-images/${user.uid}/${newPhoto.name}`
      );

      try {
        await uploadBytes(storageRef, newPhoto);
        const downloadURL = await getDownloadURL(storageRef);
        await updateProfile(user, { photoURL: downloadURL });
        console.log('Profile picture updated.');
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    }
  };

  return (
    <div className={classes['user-card']}>
      <div className={classes['profile-img-wrapper']}>
        <img src={user.photoURL || userPlaceholder} alt="Profile" />
      </div>
      <div className={classes['img-uploader']}>
        Change Profile Image
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <span>{user.displayName}</span>
      <span>{user.email}</span>
    </div>
  );
};

export default UserProfile;
