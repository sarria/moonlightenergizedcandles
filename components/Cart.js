import { useCart } from '../context/CartContext';
import styles from './cart.module.scss';

const Cart = () => {
	const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalCost, toggleCart } = useCart();

	return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
				<div onClick={() => toggleCart(false)}>CLOSE</div>
				<h2>Shopping Cart</h2>
				{cart.length === 0 ? (
					<p>Your cart is empty.</p>
				) : (
					<>
						<ul>
							{cart.map((item) => (
								<li key={item.id} className={styles.cartItem}>
									<div className={styles.itemInfo}>
										<span>{item.title}</span>
										<span>{item.price} USD</span>
									</div>
									<div className={styles.actions}>
										<button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
										<span>{item.quantity}</span>
										<button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
										<button onClick={() => removeFromCart(item.id)}>Remove</button>
									</div>
								</li>
							))}
						</ul>
						<div className={styles.cartSummary}>
							<p>Total Items: <strong>{getTotalItems()}</strong></p>
							<p>Total Cost: <strong>${getTotalCost().toFixed(2)}</strong></p>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Cart;
