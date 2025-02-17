import styles from './burger.module.scss';
import { useState } from 'react';

const Burger = ({isOpen, toggleMenu}) => {
  const toggleButton = () => {
	toggleMenu();
  };

  return (
    <div className={styles.root} >
      <div className={styles.wrapper}>
        <div
          className={`${styles.menuToggle} ${isOpen ? styles.open : ''}`}
          onClick={toggleButton} 
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Burger;
