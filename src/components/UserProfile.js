import React, { useEffect, useState } from 'react';
import classes from './UserProfile.module.css';
import userPlaceholder from '../assets/img/user-placeholder.png';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MdFileUpload } from 'react-icons/md';
import { AiTwotoneEdit } from 'react-icons/ai';

const UserProfile = (props) => {
  const { user } = props;
  const [newPhoto, setNewPhoto] = useState(null);
  const [newUsername, setNewUsername] = useState(user.displayName);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');
  const storage = getStorage();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing); // Toggle edit mode
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

  const updateUserProfile = async () => {
    try {
      await updateProfile(user, { displayName: newUsername });
      setStatus('Username updated!');
      toggleEditMode(); // Turn off edit mode after updating
    } catch (error) {
      console.error(error);
      setStatus('Error updating username');
    }
  };

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
      <input
        type="text"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        placeholder="Enter new username"
        disabled={!isEditing}
      />
      <span>{user.email}</span>
      <div className={classes['buttons-wrapper']}>
        <button onClick={toggleEditMode}>
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              Update profile <AiTwotoneEdit />
            </>
          )}
        </button>
        {isEditing && <button onClick={updateUserProfile}>Save</button>}
      </div>
    </div>
  );
};

export default UserProfile;
