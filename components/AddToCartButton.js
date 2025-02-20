import Link from 'next/link'
import Image from "next/image";
import faCartWhite from '../public/icons/cart-plus-white.svg'
import styles from './addToCartButton.module.scss'
import cx from 'classnames'

const AddToCartButton = () => {
	return (
		<div className={styles.root}>
			<div className={styles.label}>
				ADD TO CART
			</div>
			<div className={styles.ico}>
				<Image src={faCartWhite} layout='fill' />
			</div>
		</div>
	)
}

export default AddToCartButton;