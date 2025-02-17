import React from 'react';
import styles from './underConstruction.module.scss'; 

const UnderConstruction = () => {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Under Construction</h1>
      <p className={styles.message}>We'll be back soon!</p>
      <div className={styles.loader}></div>
    </div>
  );
};

export default UnderConstruction;
