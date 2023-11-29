import React, { useState } from 'react';
import classes from './Toggle.module.css';

const Toggle = ({ label, onToggle, initialChecked, icon }) => {
  const [checked, setChecked] = useState(initialChecked || false);

  const handleToggle = () => {
    setChecked(!checked);
    onToggle && onToggle(!checked);
  };

  return (
    <div className={classes['toggle-container']}>
      {icon && <div className={classes['toggle-icon']}>{icon}</div>}
      <label>{label}</label>
      <div className={classes['toggle-wrapper']} onClick={handleToggle}>
        <div
          className={`${classes['toggle-slider']} ${
            checked && classes.checked
          }`}
        />
      </div>
    </div>
  );
};

export default Toggle;
