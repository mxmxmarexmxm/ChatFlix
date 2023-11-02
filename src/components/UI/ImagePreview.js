import React from 'react';
import classes from './ImagePreview.module.css';
// import { getDownloadURL, ref } from 'firebase/storage';
// import { getStorage } from 'firebase/storage';

const ImagePreview = ({ url }) => {
  // const downloadImage = (url) => {
  //   fetch(url)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'xxx';
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     })
  //     .catch((error) => console.error('Error downloading image:', error));
  // };

  return (
    <div className={classes['image-preview']}>
      <div className={classes['image-preview-wrapper']}>
        <img src={url} alt="img" />
        {/* <button onClick={downloadImage}>download</button> */}
      </div>
    </div>
  );
};

export default ImagePreview;
