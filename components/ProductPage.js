
import parse from 'html-react-parser';
import ImageRatio from './elements/ImageRatio'
import styles from './productPage.module.scss'
import AddToCartButton from './AddToCartButton'
import { formatCurrency } from './utils/shared'

const ProductPage = ({ product, global }) => {
    // console.log("product", product)

    const image = {
        altText: product.title,
        sourceUrl: product.image
    }

	return  (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				<div className={styles.left}>
					<ImageRatio image={image} ratio='140%' />
				</div>
				<div className={styles.right}>
                    <h1 className={styles.title}>{product.title}</h1>
                    <div className={styles.headline}>
                        {parse(product.headline)}
                    </div>
                    {product.price && parseFloat(product.price) > 0 &&
                    <div className={styles.price}>
                        <span>{formatCurrency(product.price)}</span>
                        <span><AddToCartButton item={product} small={true} /></span>
                    </div>}
                    <div className={styles.description}>
                        {parse(product.description)}
                    </div>
				</div>
			</div>
		</div>
	)    
}

export default ProductPage;