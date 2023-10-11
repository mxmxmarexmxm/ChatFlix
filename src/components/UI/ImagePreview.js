import React from 'react';
import classes from './ImagePreview.module.css';

const ImagePreview = ({ url }) => {
  return (
    <div className={classes['image-preview']}>
      <div className={classes['image-preview-wrapper']}>
        <img src={url} alt="img" />
      </div>
    </div>
  );
};

export default ImagePreview;
