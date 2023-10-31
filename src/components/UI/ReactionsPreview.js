import React, { useState, useEffect } from 'react';
import { reactionsIconsArray } from '../Message/MessageUtils';
import classes from './ReactionsPreview.module.css';
import { useModal } from '../../context/ModalContext';
import { getUserDataFromFirestore } from '../../services/UserServices';
import UserProfile from '../UserProfile';
import Loader from './Loader';
import userPlaceholder from '../../assets/img/user-placeholder.png';

const ReactionsPreview = ({ reactions }) => {
  const [userReactions, setUserReactions] = useState([]);
  const [reactionFilter, setReactionFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    const fetchUserReactions = async () => {
      setLoading(true);
      let userReactionsData = [];
      for (const reaction in reactions) {
        for (const user of reactions[reaction]) {
          const userData = await getUserDataFromFirestore(user);
          if (userData) {
            userReactionsData.push({
              displayName: userData.displayName,
              reaction,
              uid: user,
              photoURL: userData.photoURL,
            });
          }
        }
      }
      setUserReactions(userReactionsData);
      setLoading(false);
    };

    fetchUserReactions();
  }, [reactions]);

  const nonEmptyReactions = Object.entries(reactions).filter(
    ([, users]) => users.length > 0
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={classes['reactions-preview']}>
      <div className={classes['reactions-filter-menu']}>
        <div
          className={classes['reactions-filter']}
          onClick={() => setReactionFilter(null)}
        >
          All: {userReactions?.length}
        </div>
        {nonEmptyReactions.map(([reaction, users]) => (
          <div
            className={classes['reactions-filter']}
            onClick={() => setReactionFilter(reaction)}
          >
            {users.length}
            {reactionsIconsArray[reaction]}
          </div>
        ))}
      </div>
      <div className={classes['reactions-wrapper']}>
        {userReactions
          .filter((reaction) =>
            reactionFilter ? reaction.reaction === reactionFilter : reaction
          )
          .map(({ displayName, reaction, photoURL, uid }, index) => (
            <div key={index} className={classes['reaction-wrapper']}>
              <div
                className={classes['name-photo-wrapper']}
                onClick={() => openModal(<UserProfile uid={uid} />)}
              >
                <div className={classes['profile-image-wrapper']}>
                  <img src={photoURL || userPlaceholder} />
                </div>
                <span>{displayName}</span>
              </div>
              {reactionsIconsArray[reaction]}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReactionsPreview;
