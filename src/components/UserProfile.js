import React, { useEffect, useState } from 'react';
import classes from './UserProfile.module.css';
import userPlaceholder from '../assets/img/user-placeholder.png';
import { updateEmail, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Edit } from '../assets/icons/Edit';
import { Close } from '../assets/icons/Close';
import { Upload } from '../assets/icons/Upload';
import { Linkedin } from '../assets/icons/Linkedin';
import {
  getUserDataFromFirestore,
  updateUserDataInFirestore,
} from '../services/UserServices';
import GithubIcon from '../assets/icons/Github';
import Loader from './UI/Loader';
import useChatsSearch from '../hooks/useChatsSearch.js';

const UserProfile = ({ uid, personalProfile }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formValues, setFormValues] = useState({
    displayName: '',
    title: '',
    aboutMe: '',
    email: '',
    linkedin: '',
    github: '',
    technologies: [],
  });
  const [status, setStatus] = useState('');
  const { searchTerm, setSearchTerm, filteredChatsData } = useChatsSearch();
  const storage = getStorage();

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      const userData = await getUserDataFromFirestore(
        personalProfile?.uid || uid
      );
      setFormValues({
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
      await updateProfile(user, formValues);
      await updateUserDataInFirestore(user.uid, formValues);
      if (formValues.email !== user.email) {
        await updateEmail(user, formValues.email);
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
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleAddTech = (tech) => {
    if (!formValues.technologies.some((item) => item.id === tech.id)) {
      setFormValues((values) => ({
        ...values,
        technologies: [...values.technologies, tech],
      }));
    }
    setSearchTerm('');
  };

  const handleRemoveTech = (tech) => {
    setFormValues((values) => ({
      ...values,
      technologies: values.technologies.filter(
        (technology) => technology.id !== tech.id
      ),
    }));
  };

  return (
    <form onSubmit={handleFormSubmit} className={classes['user-card']}>
      <input
        type="text"
        value={formValues.title}
        onChange={handleInputChange}
        placeholder="Title"
        name="title"
        disabled={!isEditing}
      />
      {formValues?.technologies.length > 0 && (
        <div className={classes['technologies-container']}>
          {formValues.technologies.map((tech) => (
            <div key={tech.id}>
              {isEditing && (
                <button type="button">
                  <Close
                    title="Remove"
                    onClick={() => handleRemoveTech(tech)}
                  />
                </button>
              )}
              <img src={tech.logo} alt={tech.name} />
            </div>
          ))}
        </div>
      )}
      {isEditing && (
        <div className={classes['technologies-search']}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for technologies..."
          />
          {searchTerm && (
            <div className={classes['search-results']}>
              {filteredChatsData?.length > 0 ? (
                filteredChatsData.map((tech) => (
                  <div
                    className={classes['search-result']}
                    onClick={() => handleAddTech(tech)}
                    key={tech.id}
                  >
                    <div className={classes['search-result-img-wrapper']}>
                      <img src={tech.logo} alt={tech.name} />
                    </div>
                    <span>{tech.name}</span>
                  </div>
                ))
              ) : (
                <div className={classes['search-result']}>
                  <span>No results found...</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
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
        value={formValues.displayName}
        onChange={handleInputChange}
        placeholder="Enter new username"
        disabled={!isEditing}
        name="displayName"
        maxLength={25}
        required
      />

      <textarea
        type="text"
        value={formValues.aboutMe}
        onChange={handleInputChange}
        placeholder="About Me"
        name="aboutMe"
        disabled={!isEditing}
      />
      <input
        type="email"
        value={formValues.email}
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
            value={formValues.linkedin}
            onChange={handleInputChange}
            name="linkedin"
            placeholder="Linkedin"
          />
          <input
            type="url"
            value={formValues.github}
            onChange={handleInputChange}
            placeholder="Github"
            name="github"
          />
        </>
      ) : (
        <div className={classes['social-media-icon-wrapper']}>
          <a
            href={formValues?.linkedin || undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin
              className={`${classes['social-media-icon']} ${
                !formValues?.linkedin && classes['social-media-icon-disabled']
              }`}
            />
          </a>
          <a
            href={formValues?.github || undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon
              className={`${classes['social-media-icon']} ${
                !formValues?.github && classes['social-media-icon-disabled']
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
