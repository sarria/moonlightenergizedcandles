import styles from './burger.module.scss';
import { useCart } from '../context/CartContext';

const Burger = ({isOpen, toggleMenu}) => {
  const { toggleCart } = useCart();

  const toggleButton = (status) => {
    toggleCart(false);
	  toggleMenu(status);
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
