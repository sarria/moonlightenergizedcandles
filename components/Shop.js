import Link from 'next/link'
import Image from "next/image";
import styles from './shop.module.scss'
import cx from 'classnames'
import AddToCartButton from './AddToCartButton'
import { formatCurrency } from './utils/shared'

const Items = ({ items }) => {
	return (
		<div className={cx(styles.items)}>
			{items && items.map((item, index) => (
				<div key={index} className={cx(styles.item)}>
					<div className={cx(styles.innerItem)}>
						<div className={cx(styles.image)}>
						<Link href={item.slug ? '/' + item.slug : 'javascript:void(0)'} passHref>
							<a>
								<Image
									alt={item.title}
									src={item.image}
									layout="fill"
								/>
							</a>
						</Link>

						</div>
						<div className={styles.info}>
							<div className={styles.line1}>
								<div className={styles.name}>{item.title}</div>
								<div className={styles.date}>{formatCurrency(item.price)}</div>
							</div>
							<div className={styles.line2}>
								<div className={styles.headline}>{item.headline}</div>
							</div>
						</div>
						<div className={styles.addToCart}>
							<AddToCartButton item={item} />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

const Shop = ({ data, global }) => {
	return (
		<div className={styles.root}>
			<div className={cx(styles.wrapper, styles.shop)}>
				<Items items={global[data.shopProducts]} />
			</div>
		</div>
	);
}

export default Shop;
