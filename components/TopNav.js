import cx from 'classnames'
import styles from './topNav.module.scss'
import parse from 'html-react-parser';
import Link from 'next/link'
import ShopIco from './ShopIco'
import { handleScrollToSection } from './utils/shared';
import { useRouter } from "next/router";
import Image from "next/image";
import faInstagram from '../public/icons/instagram-brands.svg'

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
					handleScrollToSection(item.id)
					toggleMenu()
				}}>
					{item.label}
				</a>
			</div>
			}			
		</>
	)
}

const Instagram = ({link}) => {
	return (
		<div className={cx(styles.item, styles.instagram)}>
			<div className={styles.ico}>
				<a href={link} target='_blank'>
					<Image src={faInstagram} alt="Star" layout='fill' />
				</a>
			</div>
		</div>
	)
}

function TopNav({global, isOpen, toggleMenu}) {
	const navigation = global.navigation
	const shoppingPage = global.shoppingPage
	const instagram = global.instagram

	return (
		<div className={cx(styles.root, {[styles.isOpen]:isOpen})}>
			<div className={styles.wrapper}>
				{navigation.map((item, index) => <Item key={index} item={item} toggleMenu={toggleMenu} />)}
				<ShopIco shoppingPage={shoppingPage} />
				<Instagram link={instagram} />
			</div>
		</div>
	)
}

export default TopNav