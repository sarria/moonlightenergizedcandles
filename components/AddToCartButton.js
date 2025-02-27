import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Image from "next/image";
import faCartWhite from '../public/icons/cart-plus-white.svg';
import faMoonWhite from '../public/icons/moon-white.svg';
import faMoonBlack from '../public/icons/moon-black.svg';
import faPaletteWhite from '../public/icons/palette-white.svg';
import faMinus from '../public/icons/minus-solid.svg';
import faPlus from '../public/icons/plus-solid.svg';
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

const InnerButton = ({ buttonInfo, icon, hasLinkToPage, isMobile, handleUpdate, onClick, isAdded, quantity, small }) => {
	const Button = (
		<div 
			className={cx(styles.root, 
				{ [styles.hasLinkToPage]: hasLinkToPage }, 
				{ [styles.isMobile]: isMobile && isMobile !== undefined }, 
				{ [styles.isDesktop]: !isMobile && isMobile !== undefined },
				{ [styles.small]: small && small !== undefined },
				{ [styles.added]: isAdded } // Apply animation class when added
			)} 
			onClick={() => onClick ? onClick(isMobile) : {}}
		>
			<div className={styles.label}>
				{buttonInfo.label} 
			</div>
			<div className={styles.ico}>
				<Image src={icon[buttonInfo.icon]} layout='fill' />
			</div>
		</div>
	)

	const QtyButton = (
		<div 
			className={cx(styles.root, styles.quantitySelector,
				{ [styles.isMobile]: isMobile && isMobile !== undefined }, 
				{ [styles.isDesktop]: !isMobile && isMobile !== undefined },
				{ [styles.small]: small && small !== undefined },				
			)} 
		>
			<button className={styles.quantityButton} onClick={() => handleUpdate(-1)}>
				{quantity > 1 ? <Image src={faMinus} alt="Decrease" layout='fill' /> : <Image src={faTrash} alt="Remove" layout='fill' />}
			</button>
			<span className={styles.quantity}>{quantity}</span>
			<button className={styles.quantityButton} onClick={() => handleUpdate(1)}>
				<Image src={faPlus} alt="Decrease" layout='fill' />
			</button>
		</div>
	)

	return quantity > 0 ? QtyButton : Button
}

const AddToCartButton = ({ item, small }) => {
	const { addToCart, getTotalQuantityById, removeFromCart, updateQuantity } = useCart();
	const [isAdded, setIsAdded] = useState(false);

	const quantity = getTotalQuantityById(item.id)

	const buttonInfo = {
		'label': setLabel(item.type),
		'icon': setIcon(item.type)
	};

	const icon = {
		'zodiac': item.buttonLink === '' ? faMoonWhite : faMoonBlack,
		'cart': faCartWhite,
		'custom': faPaletteWhite,
	};

	const handleAddToCart = (isMobile) => {
		addToCart(item);

		// Trigger pulse animation
		setIsAdded(true);
		setTimeout(() => setIsAdded(false), 400);
	};

	const handleUpdate = (unit) => {
		const updatedQuantity = quantity + unit

		if (updatedQuantity >= 0) {
			updateQuantity(item.id, updatedQuantity)
		}
		if (updatedQuantity == 0) {
			removeFromCart(item.id)
		}
	}
		
	return (
		<>
			{item.buttonLink !== '' && item.buttonLink !== undefined ? 
				<Link href={item.buttonLink} passHref>
					<a>
						<InnerButton buttonInfo={buttonInfo} icon={icon} hasLinkToPage={true} />
					</a>
				</Link> : 
				<>
					<InnerButton buttonInfo={buttonInfo} icon={icon} isMobile={true} onClick={handleAddToCart} handleUpdate={handleUpdate} isAdded={isAdded} quantity={quantity} small={small} />
					<InnerButton buttonInfo={buttonInfo} icon={icon} isMobile={false} onClick={handleAddToCart} handleUpdate={handleUpdate} isAdded={isAdded} quantity={quantity} small={small} />
				</>
			}
		</>
	);
};

export default AddToCartButton;
