import React, { useEffect, useState } from 'react';
import classes from './UserProfile.module.css';
import userPlaceholder from '../assets/img/user-placeholder.png';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Edit } from '../assets/icons/Edit';
import { Upload } from '../assets/icons/Upload';
import {
  getUserDataFromFirestore,
  updateUserDataInFirestore,
} from '../auth/AuthServices';

const UserProfile = ({ uid, personalProfile }) => {
  const [user, setUser] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newValues, setNewValues] = useState({
    displayName: '',
    title: '',
    aboutMe: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');
  const storage = getStorage();

  useEffect(() => {
    // Fetch user data from when the component mounts
    const fetchUserData = async () => {
      if (personalProfile) {
        setUser(personalProfile);
        setNewValues({
          displayName: personalProfile.displayName,
          title: personalProfile.title || '',
          aboutMe: personalProfile.aboutMe || '',
        });
        return;
      }
      const userData = await getUserDataFromFirestore(uid);
      if (userData) {
        setUser(userData);
        setNewValues({
          displayName: userData.displayName,
          title: userData.title || '',
          aboutMe: userData.aboutMe || '',
        });
      }
    };
    fetchUserData();
  }, [uid, personalProfile]);

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
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(newValues);

    try {
      setStatus('Please wait...');
      await updateProfile(user, newValues);
      await updateUserDataInFirestore(user.uid, newValues);
      if (newPhoto) {
        const storageRef = ref(
          storage,
          `profile-images/${user.uid}/${newPhoto.name}`
        );

        try {
          await uploadBytes(storageRef, newPhoto);
          const downloadURL = await getDownloadURL(storageRef);
          await updateProfile(user, { photoURL: downloadURL });
          await updateUserDataInFirestore(user.uid, { photoURL: downloadURL });
        } catch (error) {
          setStatus('Error updating profile picture');
        }
      }

      setStatus('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      setStatus('Error updating profile...');
    }
    toggleEditMode();
    setTimeout(() => {
      setStatus('');
    }, 3000);
  };

  return (
    <form onSubmit={handleFormSubmit} className={classes['user-card']}>
      <div className={classes['img-and-input-wrapper']}>
        <div className={classes['profile-img-wrapper']}>
          <img
            src={imagePreview || user?.photoURL || userPlaceholder}
            alt="Profile"
          />
        </div>
        {isEditing && (
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
      <input
        type="text"
        value={newValues.displayName}
        onChange={(e) =>
          setNewValues({ ...newValues, displayName: e.target.value })
        }
        placeholder="Enter new username"
        disabled={!isEditing}
      />
      <input
        type="text"
        value={newValues.title}
        onChange={(e) => setNewValues({ ...newValues, title: e.target.value })}
        placeholder="About Me"
        disabled={!isEditing}
      />
      <input
        type="text"
        value={newValues.aboutMe}
        onChange={(e) =>
          setNewValues({ ...newValues, aboutMe: e.target.value })
        }
        placeholder="About Me"
        disabled={!isEditing}
      />
      <span>{user?.email}</span>
      <p className={classes.status}>{status}</p>
      {personalProfile && (
        <div className={classes['buttons-wrapper']}>
          <button onClick={toggleEditMode} type="button">
            {isEditing ? (
              'Cancel'
            ) : (
              <>
                Edit Profile <Edit height="15px" />
              </>
            )}
          </button>
          {isEditing && <button type="submit">Save</button>}
        </div>
      )}
    </form>
  );
};

export default UserProfile;
