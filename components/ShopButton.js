import Link from 'next/link'
import Image from "next/image";
import faCartShopping from '../public/icons/cart-shopping-solid.svg'
import styles from './shopButton.module.scss'
import cx from 'classnames'

const ShopButton = ({shoppingPage, isButton}) => {
	return (
		<div className={cx(styles.root, {[styles.isButton] : isButton})}>
			<Link href={"/" + shoppingPage.slug} >
				SHOP
			</Link>
			<div className={styles.ico}>
				<Image src={faCartShopping} layout='fill' />
			</div>
		</div>
	)
}

export default ShopButton;