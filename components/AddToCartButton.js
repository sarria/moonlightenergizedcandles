import { useCart } from '../context/CartContext';
import Link from 'next/link'
import Image from "next/image";
import faCartWhite from '../public/icons/cart-plus-white.svg'
import faMoonWhite from '../public/icons/moon-white.svg'
import faMoonBlack from '../public/icons/moon-black.svg'
import faPaletteWhite from '../public/icons/palette-white.svg'
import styles from './addToCartButton.module.scss'
import cx from 'classnames'

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

const InnerButton = ({buttonInfo, icon, isPage, onClick}) => {

	return (
		<div className={cx(styles.root, {[styles.isPage] : isPage})} onClick={onClick}>
			<div className={styles.label}>
				{buttonInfo.label}
			</div>
			<div className={styles.ico}>
				<Image src={icon[buttonInfo.icon]} layout='fill' />
			</div>
		</div>
	)
}

const AddToCartButton = ({item}) => {
	const { addToCart, toggleCart } = useCart();

	const buttonInfo = {
		'label' : setLabel(item.type),
		'icon' : setIcon(item.type)
	}

	const icon = {
		'zodiac': item.buttonLink === '' ? faMoonWhite : faMoonBlack,
		'cart' : faCartWhite,
		'custom' : faPaletteWhite,
	}

	const handleAddToCart = () => {
		// console.log('Adding item', item)
		toggleCart(true)
		addToCart(item);
	};

	return (
		<>
		{item.buttonLink !== '' ? 
			<Link href={item.buttonLink} passHref>
				<a>
					<InnerButton buttonInfo={buttonInfo} icon={icon} isPage={true} />
				</a>
			</Link> : <InnerButton buttonInfo={buttonInfo} icon={icon} onClick={handleAddToCart} />
		}

		</>
	)
}

export default AddToCartButton;