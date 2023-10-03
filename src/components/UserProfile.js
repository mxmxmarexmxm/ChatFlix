import React, { useEffect, useState } from 'react';
import classes from './UserProfile.module.css';
import userPlaceholder from '../assets/img/user-placeholder.png';
import { updateEmail, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Edit } from '../assets/icons/Edit';
import { Upload } from '../assets/icons/Upload';
import { Linkedin } from '../assets/icons/Linkedin';
import {
  getUserDataFromFirestore,
  updateUserDataInFirestore,
} from '../auth/AuthServices';
import GithubIcon from '../assets/icons/Github';

const UserProfile = ({ uid, personalProfile }) => {
  const [user, setUser] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newValues, setNewValues] = useState({
    displayName: '',
    title: '',
    aboutMe: '',
    email: '',
    linkedin: '',
    github: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');
  const storage = getStorage();

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      const userData = await getUserDataFromFirestore(
        personalProfile?.uid || uid
      );
      setNewValues({
        displayName: userData.displayName,
        title: userData.title,
        aboutMe: userData.aboutMe,
        email: userData.email,
        linkedin: userData.linkedin,
        github: userData.github,
      });
      setUser(personalProfile || userData);
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

    try {
      setStatus('Please wait...');
      await updateProfile(user, newValues);
      await updateUserDataInFirestore(user.uid, newValues);
      if (newValues.email !== user.email) {
        await updateEmail(user, newValues.email);
      }
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

  const handleInputChange = (e) => {
    setNewValues({ ...newValues, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleFormSubmit} className={classes['user-card']}>
      <input
        type="text"
        value={newValues.title}
        onChange={handleInputChange}
        placeholder="Title"
        name="title"
        disabled={!isEditing}
      />
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
              name="photoURL"
            />
          </div>
        )}
      </div>
      <input
        type="text"
        value={newValues.displayName}
        onChange={handleInputChange}
        placeholder="Enter new username"
        disabled={!isEditing}
        name="displayName"
        required
      />

      <textarea
        type="text"
        value={newValues.aboutMe}
        onChange={handleInputChange}
        placeholder="About Me"
        name="aboutMe"
        disabled={!isEditing}
      />
      <input
        type="email"
        value={newValues.email}
        onChange={handleInputChange}
        placeholder="email"
        disabled={!isEditing}
        name="email"
        required
      />
      {isEditing ? (
        <>
          <input
            type="url"
            value={newValues.linkedin}
            onChange={handleInputChange}
            name="linkedin"
            placeholder="Linkedin"
          />
          <input
            type="url"
            value={newValues.github}
            onChange={handleInputChange}
            placeholder="Github"
            name="github"
          />
        </>
      ) : (
        <div className={classes['social-media-icon-wrapper']}>
          <a
            href={newValues?.linkedin || undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin
              className={`${classes['social-media-icon']} ${
                !newValues?.linkedin && classes['social-media-icon-disabled']
              }`}
            />
          </a>
          <a
            href={newValues?.github || undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon
              className={`${classes['social-media-icon']} ${
                !newValues?.github && classes['social-media-icon-disabled']
              }`}
            />
          </a>
        </div>
      )}
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
