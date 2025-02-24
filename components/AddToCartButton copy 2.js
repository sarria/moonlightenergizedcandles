import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Image from "next/image";
import faCartWhite from '../public/icons/cart-plus-white.svg';
import faMoonWhite from '../public/icons/moon-white.svg';
import faMoonBlack from '../public/icons/moon-black.svg';
import faPaletteWhite from '../public/icons/palette-white.svg';
import faTrash from '../public/icons/trash.svg';
import styles from './addToCartButton.module.scss';
import cx from 'classnames';

const setLabel = (type) => {
	switch (true) {
		case type.includes('zodiac'):
		  return 'SELECT SIGN';
		case type.includes('custom'):
		  return 'CUSTOMIZE';
		default:
		  return 'ADD TO CART';
	}
};

const setIcon = (type) => {
	switch (true) {
		case type.includes('zodiac'):
			return 'zodiac';
		case type.includes('custom'):
			return 'custom';
		default:
			return 'cart';
	}
};	

const InnerButton = ({ buttonInfo, icon, hasLinkToPage, isMobile, onClick, isAdded }) => {
	return (
		<div 
			className={cx(styles.root, 
				{ [styles.hasLinkToPage]: hasLinkToPage }, 
				{ [styles.isMobile]: isMobile && isMobile !== undefined }, 
				{ [styles.isDesktop]: !isMobile && isMobile !== undefined },
				{ [styles.added]: isAdded } // Apply animation class when added
			)} 
			onClick={(e) => onClick(isMobile)}
		>
			<div className={styles.label}>
				{buttonInfo.label}
			</div>
			<div className={styles.ico}>
				<Image src={icon[buttonInfo.icon]} layout='fill' />
			</div>
		</div>
	);
};

const AddToCartButton = ({ item }) => {
	const { addToCart, removeFromCart, updateQuantity, cart } = useCart();
	const [isAdded, setIsAdded] = useState(false);
	const cartItem = cart.find((cartItem) => cartItem.id === item.id);
	const quantity = cartItem ? cartItem.quantity : 0;

	const buttonInfo = {
		'label': setLabel(item.type),
		'icon': setIcon(item.type)
	};

	const icon = {
		'zodiac': item.buttonLink === '' ? faMoonWhite : faMoonBlack,
		'cart': faCartWhite,
		'custom': faPaletteWhite,
	};

	const handleAddToCart = () => {
		addToCart(item);
		setIsAdded(true);
	};

	const handleIncrement = () => {
		updateQuantity(item.id, quantity + 1);
	};

	const handleDecrement = () => {
		if (quantity > 1) {
			updateQuantity(item.id, quantity - 1);
		} else {
			removeFromCart(item.id);
			setIsAdded(false); // Flip back to "Add to Cart"
		}
	};

	return (
		<div className={cx(styles.flipContainer, { [styles.flipped]: isAdded })}>
			{isAdded ? (
				<div className={styles.quantitySelector}>
					<button className={styles.quantityButton} onClick={handleDecrement}>
						{quantity > 1 ? "-" : <Image src={faTrash} alt="Remove" width={15} height={15} />}
					</button>
					<span className={styles.quantity}>{quantity}</span>
					<button className={styles.quantityButton} onClick={handleIncrement}>+</button>
				</div>
			) : (
				<button className={styles.root} onClick={handleAddToCart}>
					ADD TO CART
					<Image src={faCartWhite} alt="Cart Icon" width={15} height={15} />
				</button>
			)}
		</div>
	);
};

export default AddToCartButton;
