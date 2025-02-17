import parse from 'html-react-parser';
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import { handleScrollToSection } from './utils/shared';
import styles from './navigation.module.scss'
import { useRouter } from "next/router";
	
const handleClick = () => {
	document.getElementById('toggle').checked = false;
}

const PrintNavigation = (items) => {

	const router = useRouter();
	// console.log("router.asPath ::", router.asPath)
	return (
		<>
			{items.map((item) => {
				// console.log("nav item: ", item, (!item.page && item.label && item.id) ? 'si' : 'no');
				return (
					<>
						{item.page &&
							<div key={item.page.slug} className={cx(styles.item, {[styles.active]: router.asPath === "/" + item.page.slug})}>
								<Link href={"/" + (item.page.slug === 'home-page' ? '' : item.page.slug)} >
									<a onClick={handleClick}>{parse(item.page.title.replace('/', '/<br/>'))}</a>
								</Link>
							</div>
						}
						{(!item.page && item.label && item.id) &&
							<div key={item.id} className={cx(styles.item)}>
								<a onClick={() => handleScrollToSection(item.id)}>
									{item.label}
								</a>
							</div>							
						}
					</>
				)
				
			})}
		</>
	)
}

const Navigation = ({isFooter, navigationPicture, navigation, navigationLeft, navigationRightTop, navigationRightBottom}) => {
	return (
		<>
			{!isFooter && <input id="toggle" type="checkbox"></input>}
			<div className={cx('navigation', styles.root, {[styles.isFooter]: isFooter})}>
				<div className={styles.wrapper}>
					<div className={styles.content}>
						<div className={styles.navigation}>
							<div className={cx(styles.items, styles.left)}>
								{PrintNavigation(navigation)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Navigation;