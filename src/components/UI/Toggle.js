import React, { useState } from 'react';
import styles from './Toggle.module.css';

const Toggle = ({ label, onToggle, initialChecked, icon }) => {
  const [checked, setChecked] = useState(initialChecked || false);

  const handleToggle = () => {
    setChecked(!checked);
    onToggle && onToggle(!checked);
  };

  return (
    <div className={styles['toggle-container']}>
      {icon && <div className={styles['toggle-icon']}>{icon}</div>}
      <label className={styles['toggle-label']}>{label}</label>
      <div className={styles['toggle-wrapper']} onClick={handleToggle}>
        <div className={`${styles['toggle-slider']} ${checked && styles.checked}`} />
      </div>
    </div>
  );
};

export default Toggle;
