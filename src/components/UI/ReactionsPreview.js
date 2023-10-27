import React from 'react';
import { reactionsIconsArray } from '../Message/MessageUtils';

// Improve UI, add users listing, fetch users data, sort by size ...
const ReactionsPreview = ({ reactions }) => {
  return (
    <div>
      {Object.entries(reactions)
        .filter(([, users]) => users.length > 0)
        .map(([reaction, users]) => (
          <div key={reaction}>
            {users.length} {reactionsIconsArray[reaction]}
          </div>
        ))}
    </div>
  );
};

export default ReactionsPreview;
