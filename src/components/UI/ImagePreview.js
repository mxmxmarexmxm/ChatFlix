import React, { useState } from 'react';
import classes from './ImagePreview.module.css';

const ImagePreview = ({ url, gallery }) => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(null);

  return (
    <div className={classes['image-preview']}>
      <div className={classes['image-preview-wrapper']}>
        <img
          src={currentUrlIndex ? gallery[currentUrlIndex] : url}
          alt="Previewed Image"
        />
      </div>
      <div className={classes.gallery}>
        {gallery?.map((photoUrl, index) => (
          <div onClick={() => setCurrentUrlIndex(index)} key={index}>
            <img
              src={photoUrl}
              alt={`Thumbnail ${index}`}
              onClick={() => setCurrentUrlIndex(index)}
            />
          </div>
        ))}
      </div>
      <div className={classes.controls}>
        <button
          onClick={() => setCurrentUrlIndex((index) => index - 1)}
          disabled={currentUrlIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentUrlIndex((index) => index + 1)}
          disabled={currentUrlIndex === gallery?.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
