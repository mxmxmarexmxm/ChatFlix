import React, { useState } from 'react';
import classes from './ImagePreview.module.css';
import { RightArrow } from '../../assets/icons/RightArrow';
import { LeftArrow } from '../../assets/icons/LeftArrow';

const ImagePreview = ({ url, gallery }) => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(null);

  return (
    <div className={classes['image-preview']}>
      <div className={classes['image-preview-wrapper']}>
        <img
          src={currentUrlIndex !== null ? gallery[currentUrlIndex] : url}
          alt="Previewed Image"
        />
      </div>
      <div className={classes.gallery}>
        {gallery?.map((photoUrl, index) => (
          <div
            onClick={() => setCurrentUrlIndex(index)}
            key={index}
            className={
              index === currentUrlIndex ? classes['previewed-image'] : ''
            }
          >
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
          <LeftArrow />
        </button>
        <button
          onClick={() => setCurrentUrlIndex((index) => index + 1)}
          disabled={currentUrlIndex === gallery?.length - 1}
        >
          <RightArrow />
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
