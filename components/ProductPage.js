
import parse from 'html-react-parser';
import Image from "next/image";
import styles from './productPage.module.scss'
import AddToCartButton from './AddToCartButton'
import { formatCurrency } from './utils/shared'

const ProductPage = ({ product, global }) => {
	return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <div className={styles.image}>
                            <Image
                                alt={product.title}
                                src={product.image}
                                layout="fill"
                                objectFit='contain'
                                objectPosition="top"
                            />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.info}>
                            <h1 className={styles.title}>{product.title}</h1>
                            <div className={styles.headline}>
                                {parse(product.headline)}
                            </div>
                            <div className={styles.price}>
                                <span>{formatCurrency(product.price)}</span>
                                <span><AddToCartButton item={product} small={true} /></span>
                            </div>
                            <div className={styles.description}>
                                {parse(product.description)}
                            </div>
                        </div>
                    </div>
                </div>
			</div>
		</div>
	);
}

export default ProductPage;