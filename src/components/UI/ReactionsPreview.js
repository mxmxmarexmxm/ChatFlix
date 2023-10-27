import React from 'react';
import { reactionsIconsArray } from '../Message/MessageUtils';
import classes from './ReactionsPreview.module.css';

// Improve UI, add users listing, fetch users data, sort by size ...
const ReactionsPreview = ({ reactions }) => {
  return (
    <div className={classes['reactions-container']}>
      {Object.entries(reactions)
        .filter(([, users]) => users.length > 0)
        .map(([reaction, users]) => (
          <div key={reaction} className={classes['reaction-counter']}>
            <span>{users.length}</span> {reactionsIconsArray[reaction]}
          </div>
        ))}
    </div>
  );
};

export default ReactionsPreview;
