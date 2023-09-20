import React, { useEffect, useState } from 'react';
import classes from './UserProfile.module.css';
import userPlaceholder from '../assets/img/user-placeholder.png';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MdFileUpload } from 'react-icons/md';

const UserProfile = (props) => {
  const { user } = props;
  const [newPhoto, setNewPhoto] = useState(null);
  const [status, setStatus] = useState('');
  const storage = getStorage();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
    }
  };

  // Upload the image file to Firebase Storage
  useEffect(() => {
    const handleUploadPhoto = async () => {
      if (newPhoto) {
        // Create a reference to the Firebase Storage location where you want to store the image
        const storageRef = ref(
          storage,
          `profile-images/${user.uid}/${newPhoto.name}`
        );
        setStatus('Please wait...');

        try {
          await uploadBytes(storageRef, newPhoto);
          const downloadURL = await getDownloadURL(storageRef);
          await updateProfile(user, { photoURL: downloadURL });
          setStatus('Profile picture updated!');
        } catch (error) {
          console.log(error);
          setStatus('Error updating profile picture');
        }
      }
    };

    handleUploadPhoto();
  }, [newPhoto]);

  return (
    <div className={classes['user-card']}>
      <div className={classes['img-and-input-wrapper']}>
        <div className={classes['profile-img-wrapper']}>
          <img src={user.photoURL || userPlaceholder} alt="Profile" />
        </div>
        {user.uid && (
          <div className={classes['img-uploader']}>
            <MdFileUpload className={classes['upload-icon']} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              placeholder="none"
            />
          </div>
        )}
      </div>
      <p className={classes.status}>{status}</p>
      <span>{user.displayName}</span>
      <span>{user.email}</span>
    </div>
  );
};

export default UserProfile;
