import Link from 'next/link'
import Image from "next/image";
import styles from './shop.module.scss'
import cx from 'classnames'
import Headline from './Headline'
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

	const setLabel = (type) => {
		switch (true) {
			case type.includes('zodiac'):
			  return 'SELECT SIGN';
			case type.includes('custom'):
			  return 'CUSTOMIZE';
			default:
			  return 'ADD TO CART';
	  	}
	};

	const setIcon = (type) => {
		switch (true) {
			case type.includes('zodiac'):
				return 'zodiac';
			case type.includes('custom'):
				return 'custom';
			default:
				return 'cart';
	  	}
	};	

	return (
		<div className={cx(styles.items)}>
			{items && items.map((item, index) =>{
				const addToCartInfo = {
					'label' : setLabel(item.type),
					'icon' : setIcon(item.type)
				}
				return (
					<div key={index} className={cx(styles.item)}>
						<div className={cx(styles.innerItem)}>
							<div className={cx(styles.image)}>
								<Image
									alt="Hero Image"
									src={item.image}
									// width={199} // Provide explicit width
									// height={83} // Provide explicit height
									layout="fill" // Optional: Adjust layout as needed
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
								<AddToCartButton data={addToCartInfo} />
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

const Shop = ({ data, global }) => {
	console.log("shop candels", global.candles)
	
	return (
		<div className={styles.root}>
			<div className={cx(styles.wrapper, styles.shop)}>

				<Headline data={{
					'line1': 'OUR STORE',
					'line2': 'CANDLES'
				}} />

				<Items items={global.candles} />

				<Headline data={{
					'line1': '',
					'line2': 'accessories'
				}} />

				<Items items={global.accessories} />

			</div>
		</div>
	)
}

export default Shop;