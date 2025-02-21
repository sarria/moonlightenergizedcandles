import Link from 'next/link'
import Image from "next/image";
import styles from './shop.module.scss'
import cx from 'classnames'
// import Headline from './Headline'
import AddToCartButton from './AddToCartButton'

function formatCurrency(price, currency = 'USD', locale = 'en-US') {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 0, // No decimals
		maximumFractionDigits: 0  // No decimals
	}).format(price);
}

const Items = ({items}) => {

	return (
		<div className={cx(styles.items)}>
			{items && items.map((item, index) =>{

				return (
					<div key={index} className={cx(styles.item)}>
						<div className={cx(styles.innerItem)}>
							<div className={cx(styles.image)}>
								<Image
									alt="Hero Image"
									src={item.image}
									layout="fill"
								/>
							</div>
							<div className={styles.info}>
								<div className={styles.line1}>
									<div className={styles.name}>
										{item.title}
									</div>
									<div className={styles.date}>
										{formatCurrency(item.price)}
									</div>
								</div>
								<div className={styles.line2}>
									<div className={styles.headline}>
										{item.headline}
									</div>
								</div>
							</div>
							<div className={styles.addToCart}>
								<AddToCartButton item={item} />
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

const Shop = ({ data, global }) => {
	// console.log("shop candels", global.candles)
	console.log("shopProducts", data.shopProducts)
	
	return (
		<div className={styles.root}>
			<div className={cx(styles.wrapper, styles.shop)}>
				<Items items={global[data.shopProducts]} />
			</div>
		</div>
	)
}

export default Shop;