import cx from 'classnames'
import { useRouter } from "next/router";
import Link from 'next/link'
import styles from './shopNav.module.scss'

const Item = ({item}) => {
	const router = useRouter();

	return (
		<>
			<div key={item.slug} className={cx(styles.item, {[styles.active]: router.asPath === "/" + item.slug})}>
				<Link href={"/" + item.slug} >
					<a>{item.title}</a>
				</Link>
			</div>
		</>
	)
}

function ShopNav({global, isTopNav}) {
    return (
		<div className={cx(styles.root, {[styles.isTopNav] : isTopNav})}>
			<div className={styles.wrapper}>
				{global.productsNavigation.map((item, index) => <Item key={index} item={item} />)}
			</div>
		</div>
	)
}

export default ShopNav    