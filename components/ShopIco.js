import Link from 'next/link'
import Image from "next/image";
import faCartShopping from '../public/icons/cart-shopping-solid.svg'
import styles from './shopico.module.scss'
import cx from 'classnames'

const ShopIco = ({shoppingPage, isButton}) => {
	return (
		<div className={cx(styles.root, {[styles.isButton] : isButton})}>
			<Link href={"/" + shoppingPage.slug} >
				SHOP
			</Link>
			<div className={styles.ico}>
				<Image src={faCartShopping} alt="Star" layout='fill' />
			</div>
		</div>
	)
}

export default ShopIco;