import { useRouter } from 'next/router'; 
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import faCartShoppingBlack from '../images/icons/cart-shopping-black.svg';
import faCartShoppingWhite from '../images/icons/cart-shopping-white.svg';
import styles from './shopButton.module.scss';
import cx from 'classnames';

const ShopButton = ({ shoppingPage, isButton, isMobilePageTop }) => {
	const { getTotalItems, toggleCart, slug } = useCart();
	const totalItems = getTotalItems();
	const router = useRouter(); 
	const cartIcon = isMobilePageTop ? faCartShoppingBlack : faCartShoppingWhite

	const handleOpenCart = () => {
		toggleCart(true);
		if (slug === 'checkout') {
			router.push(`/${shoppingPage.slug}`); 
		}
	};

	return (
		<div className={cx(styles.root, { [styles.isButton]: isButton })}>
			{shoppingPage && !isMobilePageTop && <Link href={`/${shoppingPage.slug}`}>SHOP</Link>}
			<div className={styles.ico} onClick={handleOpenCart}>
				<div className={styles.desktop}><Image src={faCartShoppingBlack} layout="fill" /></div>
				<div className={styles.mobile}><Image src={cartIcon} layout="fill" /></div>
				{totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
			</div>
			{getTotalItems() !== 0 && shoppingPage && !isMobilePageTop && !isButton && <div className={styles.label} onClick={handleOpenCart}>Cart</div>}
		</div>
	);
};

export default ShopButton;
