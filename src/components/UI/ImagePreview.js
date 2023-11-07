import React, { useEffect, useState } from 'react';
import classes from './ImagePreview.module.css';
import { RightArrow } from '../../assets/icons/RightArrow';
import { LeftArrow } from '../../assets/icons/LeftArrow';

const ImagePreview = ({ index, gallery }) => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(index || 0);

  // Check if the currently displayed image is the first or last in the gallery
  const isFirstImage = currentUrlIndex === 0 || gallery?.length === 1;
  const isLastImage =
    currentUrlIndex === gallery?.length - 1 || gallery?.length === 1;

  // Handle keyboard commands for navigating images
  useEffect(() => {
    const handleArrowCommands = (event) => {
      if (event.keyCode === 37 && !isFirstImage) {
        setCurrentUrlIndex((index) => index - 1);
      } else if (event.keyCode === 39 && !isLastImage) {
        setCurrentUrlIndex((index) => index + 1);
      }
    };
    window.addEventListener('keydown', handleArrowCommands);

    return () => {
      window.removeEventListener('keydown', handleArrowCommands);
    };
  }, [isFirstImage, isLastImage]);

  return (
    <div className={classes['image-preview']}>
      <div className={classes['image-preview-wrapper']}>
        <img src={gallery[currentUrlIndex]} alt="Previewed" />
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
          disabled={isFirstImage}
        >
          <LeftArrow />
        </button>
        <button
          onClick={() => setCurrentUrlIndex((index) => index + 1)}
          disabled={isLastImage}
        >
          <RightArrow />
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
