import Link from 'next/link'
import Image from "next/image";
import faCartWhite from '../public/icons/cart-plus-white.svg'
import faMoonWhite from '../public/icons/moon-white.svg'
import faPaletteWhite from '../public/icons/palette-white.svg'
import styles from './addToCartButton.module.scss'
import cx from 'classnames'

const AddToCartButton = ({data}) => {
	const icon = {
		'zodiac': faMoonWhite,
		'cart' : faCartWhite,
		'custom' : faPaletteWhite,
	}
	return (
		<div className={styles.root}>
			<div className={styles.label}>
				{data.label}
			</div>
			<div className={styles.ico}>
				<Image src={icon[data.icon]} layout='fill' />
			</div>
		</div>
	)
}

export default AddToCartButton;