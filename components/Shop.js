import Link from 'next/link'
import Image from "next/image";
import styles from './shop.module.scss'
import cx from 'classnames'
import Headline from './Headline'
import AddToCartButton from './AddToCartButton'

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
										${item.price}
									</div>
								</div>
								<div className={styles.line2}>
									<div className={styles.headline}>
										{item.headline}
									</div>
								</div>
							</div>
							<div className={styles.addToCart}>
								<AddToCartButton />
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

const Products = ({ data, global }) => {
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

export default Products;