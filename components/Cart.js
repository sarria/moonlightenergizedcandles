import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from './utils/shared';
import styles from './cart.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import ImageRatio from './elements/ImageRatio';
import faXmark from '../public/icons/xmark-black.svg';
import parse from 'html-react-parser';
import AddToCartButton from './AddToCartButton';
import CustomCandleForm from './CustomCandleForm';

const Cart = () => {
    const { 
		cart, removeFromCart, updateQuantity, getTotalItems, getTotalCost, toggleCart,
		customizations, handleCustomizationChange, handleRemoveCustomCandle, isCheckoutValid
	} = useCart();
    const [validationError, setValidationError] = useState(false);

    const handleCheckout = () => {
        if (!isCheckoutValid()) {
            setValidationError(true);
        } else {
            setValidationError(false);
            // Replace with actual checkout logic
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.closeIco} onClick={() => toggleCart(false)}>
                    <Image src={faXmark} layout="fill" title="Close cart" />
                </div>
                <div className={styles.subtotal}>
                    <div className={styles.label}>
                        Subtotal ({getTotalItems()} item{getTotalItems() === 1 ? '' : 's'})
                    </div>
                    <div className={styles.money}>
                        ${getTotalCost()}
                    </div>
                    {validationError && (
                        <div className={styles.errorMessage}>
                            ❌ Please complete all customization forms before proceeding.
                        </div>
                    )}
                    <button 
                        className={styles.checkoutBtn}
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </button>
                </div>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul>
                        {cart.map((item) => {
                            const image = { altText: item.title, sourceUrl: item.image };
                            const isCustomCandle = item.type.includes("candle") && item.type.includes("custom");

                            return (
                                <li key={item.id} className={styles.cartItem}>
                                    <div className={styles.info}>
                                        <div className={styles.left}>
                                            <Link href={item.slug ? '/' + item.slug : 'javascript:void(0)'} passHref>
                                                <a>
                                                    <ImageRatio image={image} ratio='120%' />
                                                </a>
                                            </Link>
                                        </div>
                                        <div className={styles.right}>
                                            <Link href={item.slug ? '/' + item.slug : 'javascript:void(0)'} passHref>
                                                <a>
                                                    <h1 className={styles.title}>{item.title}</h1>
                                                    <div className={styles.headline}>{parse(item.headline)}</div>
                                                </a>
                                            </Link>
                                            <div className={styles.price}>
                                                <span>{formatCurrency(item.price)}</span>
                                                <span><AddToCartButton item={item} small={true} /></span>
                                            </div>
                                        </div>
                                    </div>

                                    {isCustomCandle &&
                                        Array.from({ length: item.quantity }).map((_, index) => {
                                            return (
                                                <CustomCandleForm
                                                    key={`${item.id}-${index}`}
                                                    id={item.id}
													candleNum={index}
                                                    customizationData={customizations[item.id] ? customizations[item.id][index] || {} : {}}
                                                    onCustomizationChange={handleCustomizationChange}
                                                    onRemove={() => handleRemoveCustomCandle(item.id, index)}
                                                />
                                            );
                                        })}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Cart;
