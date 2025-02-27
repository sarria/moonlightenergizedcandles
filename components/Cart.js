import { useCart } from '../context/CartContext';
import { formatCurrency } from './utils/shared'
import styles from './cart.module.scss';
import Image from 'next/image';
import ImageRatio from './elements/ImageRatio'
import faXmark from '../public/icons/xmark-black.svg';
import parse from 'html-react-parser';
import AddToCartButton from './AddToCartButton'


const Cart = () => {
	const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalCost, toggleCart } = useCart();

	return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				<div className={styles.closeIco} onClick={() => toggleCart(false)}>
					<Image src={faXmark} layout="fill" />
				</div>
				<div className={styles.subtotal}>
					<div className={styles.label}>
						Subtotal ({getTotalItems()} item{getTotalItems === 1 ? '' : 's'})
					</div>
					<div className={styles.money}>
						${getTotalCost()}
					</div>
				</div>
				{cart.length === 0 ? (
					<p>Your cart is empty.</p>
				) : (
					<>
						<ul>
							{cart.map((item) => (
								<li key={item.id} className={styles.cartItem}>
									<div className={styles.left}>
										<ImageRatio 
											image={{
												altText: item.title,
												sourceUrl: item.image
											}} 
											ratio='120%' 
										/>
									</div>
									<div className={styles.right}>
										<h1 className={styles.title}>{item.title}</h1>
										<div className={styles.headline}>
											{parse(item.headline)}
										</div>
										<div className={styles.price}>
											<span>{formatCurrency(item.price)}</span>
											<span><AddToCartButton item={item} small={true} /></span>
										</div>
									</div>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</div>
	);
};

export default Cart;
