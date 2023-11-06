import React, { useState } from 'react';
import classes from './ImagePreview.module.css';

const ImagePreview = ({ url, gallery }) => {
  const [currentUrl, setCurrentUrl] = useState(url);

  return (
    <div className={classes['image-preview']}>
      <div className={classes['image-preview-wrapper']}>
        <img src={currentUrl} alt="photo-preview" />
      </div>
      <div className={classes.gallery}>
        {gallery?.map((photo, index) => (
          <div onClick={() => setCurrentUrl(photo)} key={index}>
            <img src={photo} alt="photo" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;
