import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import faCartShoppingBlack from '../public/icons/cart-shopping-black.svg';
import faCartShoppingWhite from '../public/icons/cart-shopping-white.svg';
import styles from './shopButton.module.scss';
import cx from 'classnames';

const ShopButton = ({ shoppingPage, isButton, isMobilePageTop }) => {
	const { getTotalItems, toggleCart } = useCart();
	const totalItems = getTotalItems();

	return (
		<div className={cx(styles.root, { [styles.isButton]: isButton })}>
			{shoppingPage && <Link href={`/${shoppingPage.slug}`}>SHOP</Link>}
			<div className={styles.ico} onClick={() => toggleCart(true)}>
				<div className={styles.desktop}><Image src={faCartShoppingBlack} layout="fill" /></div>
				<div className={styles.mobile}>
					{isMobilePageTop && <Image src={faCartShoppingBlack} layout="fill" />}
					{!isMobilePageTop && <Image src={faCartShoppingWhite} layout="fill" />}
				</div>
				{totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
			</div>
			{shoppingPage && !isButton && <div className={styles.label} onClick={() => toggleCart(true)}>Cart</div>}
		</div>
	);
};

export default ShopButton;
