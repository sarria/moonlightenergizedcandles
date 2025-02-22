import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import faCartShopping from '../public/icons/cart-shopping-solid.svg';
import styles from './shopButton.module.scss';
import cx from 'classnames';

const ShopButton = ({ shoppingPage, isButton }) => {
	const { getTotalItems, toggleCart } = useCart();
	const totalItems = getTotalItems();

	return (
		<div className={cx(styles.root, { [styles.isButton]: isButton })}>
			<Link href={`/${shoppingPage.slug}`}>SHOP</Link>
			<div className={styles.ico} onClick={toggleCart}>
				<Image src={faCartShopping} layout="fill" />
				{totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
			</div>
		</div>
	);
};

export default ShopButton;
