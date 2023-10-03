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

  return (
    <form onSubmit={handleFormSubmit} className={classes['user-card']}>
      <input
        type="text"
        value={newValues.title}
        onChange={(e) => setNewValues({ ...newValues, title: e.target.value })}
        placeholder="Title"
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
        required
      />

      <textarea
        type="text"
        value={newValues.aboutMe}
        onChange={(e) =>
          setNewValues({ ...newValues, aboutMe: e.target.value })
        }
        placeholder="About Me"
        name="about-me"
        disabled={!isEditing}
      />
      <input
        type="email"
        value={newValues.email}
        onChange={(e) => setNewValues({ ...newValues, email: e.target.value })}
        placeholder="email"
        disabled={!isEditing}
        required
      />
      {isEditing ? (
        <>
          <input
            type="url"
            value={newValues.linkedin}
            onChange={(e) =>
              setNewValues({ ...newValues, linkedin: e.target.value })
            }
            placeholder="Linkedin"
          />
          <input
            type="url"
            value={newValues.github}
            onChange={(e) =>
              setNewValues({ ...newValues, github: e.target.value })
            }
            placeholder="Github"
          />
        </>
      ) : (
        <div className={classes['social-media-icon-wrapper']}>
          {newValues?.linkedin && (
            <a
              href={newValues?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className={classes['social-media-icon']} />
            </a>
          )}
          {newValues?.github && (
            <a
              href={newValues?.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className={classes['social-media-icon']} />
            </a>
          )}
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
