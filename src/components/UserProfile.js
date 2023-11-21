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
} from '../services/UserServices';
import GithubIcon from '../assets/icons/Github';
import Loader from './UI/Loader';
import { chatsData } from '../data/data.js';

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
    technologies: [],
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
        technologies: userData.technologies,
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
    setImagePreview(null);
    setIsEditing((isEditing) => !isEditing);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setStatus('loading');
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

  /* TODO: IMPROVE  SEARCH !!! */
  const [filteredChatsData, setFilteredChatsData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm) {
      const filteredChatsData = chatsData.filter((chat) =>
        chat.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
      );
      setFilteredChatsData(filteredChatsData);
    } else {
      setFilteredChatsData(null);
    }
  }, [searchTerm]);

  const handleSelectChat = (chat) => {
    // TODO: IMPROVE !!!
    if (!newValues.technologies.includes(chat)) {
      setNewValues((values) => ({
        ...values,
        technologies: [...values.technologies, chat],
      }));
    }
    setSearchTerm('');
  };

  return (
    <form onSubmit={handleFormSubmit} className={classes['user-card']}>
      {/* TODO: REMOVE INLINE STYLING, IMPROVE   */}
      {isEditing && (
        <div>
          <div className={classes['input-wrapper']}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for technologies..."
            />
          </div>
          <div>
            {filteredChatsData &&
              filteredChatsData?.map((chat) => (
                <div onClick={() => handleSelectChat(chat)} key={chat.id}>
                  <img
                    src={chat.logo}
                    style={{ height: 30, width: 30 }}
                    alt={chat.name}
                  />
                  <span style={{ color: 'white' }}>{chat.name}</span>
                </div>
              ))}
          </div>
        </div>
      )}
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
          <button type="button" className={classes['img-uploader']}>
            <Upload />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              placeholder="none"
              name="photoURL"
            />
          </button>
        )}
      </div>
      <input
        type="text"
        value={newValues.displayName}
        onChange={handleInputChange}
        placeholder="Enter new username"
        disabled={!isEditing}
        name="displayName"
        maxLength={25}
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
      {/* TODO: REMOVE INLINE STYLING, ADD REMOVE FEAT  */}
      <div>
        {newValues?.technologies?.map((tech) => (
          <div
            key={tech.id}
            style={{ height: 20, display: 'flex', objectFit: 'contain' }}
          >
            <img style={{ height: 30 }} src={tech.logo} alt={tech.name} />
          </div>
        ))}
      </div>
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
      {status === 'loading' ? (
        <Loader />
      ) : (
        <p className={classes.status}>{status}</p>
      )}
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
