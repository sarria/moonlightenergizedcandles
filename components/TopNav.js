import cx from 'classnames'
import styles from './topNav.module.scss'
import parse from 'html-react-parser';
import Link from 'next/link'
import { handleScrollToSection } from './utils/shared';
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
	
const handleClick = () => {
	document.getElementById('toggle').checked = false;
}

const Item = ({item, toggleMenu}) => {
	const router = useRouter();
	// console.log("router.asPath ::", router.asPath)
	// console.log("nav item: ", item, (!item.page && item.label && item.id) ? 'si' : 'no');
	const label = item.label ? item.label : (item.page ? parse(item.page.title.replace('/', '/<br/>')) : 'NO LABEL')

	return (
		<>
			{item.page && 
			<div key={item.page.slug} className={cx(styles.item, {[styles.active]: router.asPath === "/" + item.page.slug})}>
				<Link href={"/" + (item.page.slug === 'home-page' ? '' : item.page.slug)} >
					<a onClick={item.page ? ()=>{} : handleClick}>{label}</a>
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

const Shop = () => {
	return (
		<div className={styles.item}>
			SHOP
			<div className={styles.ico}>
				<FontAwesomeIcon icon={faCartShopping} />
			</div>
		</div>
	)
}

const Instagram = ({link}) => {
	return (
		<div className={styles.item}>
			<div className={styles.ico}>
				<a href={link} target='_blank'>
					<FontAwesomeIcon icon={faInstagram} size="2x" />
				</a>
			</div>
		</div>
	)
}

function TopNav({global, isOpen, toggleMenu}) {
	const navigation = global.navigation

	return (
		<div className={cx(styles.root, {[styles.isOpen]:isOpen})}>
			<div className={styles.wrapper}>
				{navigation.map((item, index) => <Item key={index} item={item} toggleMenu={toggleMenu} />)}
				<Shop />
				<Instagram link={global.instagram} />
			</div>
		</div>
	)
}

export default TopNav