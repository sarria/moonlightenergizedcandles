import cx from 'classnames'
import styles from './topNav.module.scss'
import parse from 'html-react-parser';
import Link from 'next/link'
import ShopButton from './ShopButton'
import { useRouter } from "next/router";
import Image from "next/image";
import faInstagramBlack from '../images/icons/instagram-black.svg'

const Item = ({item, toggleMenu}) => {
	const router = useRouter();
	const label = item.label ? item.label : (item.page ? parse(item.page.title.replace('/', '/<br/>')) : 'NO LABEL')

	return (
		<>
			{item.page && 
			<div key={item.page.slug} className={cx(styles.item, {[styles.active]: router.asPath === "/" + item.page.slug})}>
				<Link href={"/" + (item.page.slug === 'home-page' ? '' : item.page.slug)} >
					<a onClick={() => toggleMenu()}>{label}</a>
				</Link>
			</div>}
			{(!item.page && item.label && item.id) &&
			<div key={item.id} className={cx(styles.item)}>
				<a onClick={() => {
					// handleScrollToSection(item.id)
					toggleMenu()
				}}>
					{item.label}
				</a>
			</div>
			}			
		</>
	)
}

const ShopPageItem = ({item, toggleMenu}) => {
	const router = useRouter();

	return (
		<>
			<div key={item.slug} className={cx(styles.item, styles.isShopPage, {[styles.active]: router.asPath === "/" + item.slug})}>
				<Link href={"/" + item.slug} >
					<a onClick={() => toggleMenu()}>{item.title}</a>
				</Link>
			</div>
		</>
	)
}

const Instagram = ({link}) => {
	return (
		<div className={cx(styles.item, styles.instagram)}>
			<div className={styles.ico}>
				<a href={link} target='_blank'>
					<Image src={faInstagramBlack} layout='fill' className={styles.desktop} />
				</a>
			</div>
		</div>
	)
}

function TopNav({global, isOpen, toggleMenu}) {
	const navigation = global.navigation
	const shoppingPage = global.shoppingPage
	const productsNavigation = global.productsNavigation
	const instagram = global.instagram

	return (
		<div className={cx(styles.root, {[styles.isOpen]:isOpen})}>
			<div className={styles.wrapper}>
				{navigation.map((item, index) => <Item key={index} item={item} toggleMenu={toggleMenu} />)}
				<div onClick={() => {toggleMenu()}} className={styles.mobile}>
					<ShopButton shoppingPage={shoppingPage} />
				</div>
				<div className={styles.desktop}>
					<ShopButton shoppingPage={shoppingPage} />
				</div>
				<div className={styles.desktop}>
					<Instagram link={instagram} />
				</div>
			</div>
			<div className={cx(styles.wrapper, styles.mobile)}>
				<div className={styles.shopPage}>
					{productsNavigation.map((item, index) => <ShopPageItem key={index} item={item} toggleMenu={toggleMenu} />)}
				</div>
			</div>
		</div>
	)
}

export default TopNav