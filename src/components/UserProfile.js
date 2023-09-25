import React, { useState } from 'react';
import classes from './UserProfile.module.css';
import userPlaceholder from '../assets/img/user-placeholder.png';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Edit } from '../assets/icons/Edit';
import { Upload } from '../assets/icons/Upload';

const UserProfile = (props) => {
  const { user } = props;
  const [newPhoto, setNewPhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Store the image preview
  const [newUsername, setNewUsername] = useState(user.displayName);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');
  const storage = getStorage();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      // Display image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setImagePreview(user.photoURL || userPlaceholder); // Clear image preview when exiting edit mode
    }
  };

  // Upload the image file to Firebase Storage
  const uploadImage = async () => {
    if (newPhoto) {
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

  const updateUserProfile = async () => {
    if (newUsername.length < 3) {
      setStatus('Username must have at least 3 characters');
      return;
    }
    try {
      await updateProfile(user, { displayName: newUsername });
      setStatus('Username updated!');
      toggleEditMode();
      if (isEditing) {
        uploadImage();
      }
    } catch (error) {
      console.error(error);
      setStatus('Error updating username');
    }
  };

  return (
    <div className={classes['user-card']}>
      <div className={classes['img-and-input-wrapper']}>
        <div className={classes['profile-img-wrapper']}>
          <img
            src={imagePreview || user.photoURL || userPlaceholder}
            alt="Profile"
          />
        </div>
        {user.uid && isEditing && (
          <div className={classes['img-uploader']}>
            <Upload className={classes['upload-icon']} />
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
              Edit Profile <Edit height="15px" />
            </>
          )}
        </button>
        {isEditing && <button onClick={updateUserProfile}>Save</button>}
      </div>
    </div>
  );
};

export default UserProfile;
