import Link from 'next/link'
import styles from './shop.module.scss'
import cx from 'classnames'
import AddToCartButton from './AddToCartButton'
import { formatCurrency } from './utils/shared'
import ImageRatio from './elements/ImageRatio'

const Items = ({ items }) => {

	return (
		<div className={cx(styles.items)}>
			{items && items.map((item, index) => {
				const image = {
					altText: item.title,
					sourceUrl: item.image
				}
				
				return (
					<div key={index} className={cx(styles.item)}>
						<div className={cx(styles.innerItem)}>
							<div className={cx(styles.image)}>
								<Link href={item.slug ? '/' + item.slug : 'javascript:void(0)'} passHref>
									<a>
										<ImageRatio image={image} ratio='100%' />
									</a>
								</Link>
							</div>
							<div className={styles.info}>
								<Link href={item.slug ? '/' + item.slug : 'javascript:void(0)'} passHref>
									<a>
										<div className={styles.line1}>
											<div className={styles.name}>{item.title}</div>
											{item.price && parseFloat(item.price) > 0 &&
											<div className={styles.date}>{formatCurrency(item.price)}</div>}
										</div>
										<div className={styles.line2}>
											<div className={styles.headline}>{item.headline}</div>
										</div>
									</a>
								</Link>
							</div>
							{item.price && parseFloat(item.price) > 0 ?
							<div className={styles.addToCart}>
								<AddToCartButton item={item} />
							</div> : <div><p>Comming soon!</p></div>}
						</div>
					</div>
				)
			})}
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
