import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';
import { formatCurrency } from './utils/shared';
import styles from './cart.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import ImageRatio from './elements/ImageRatio';
import faXmark from '../images/icons/xmark-black.svg';
import parse from 'html-react-parser';
import AddToCartButton from './AddToCartButton';
import CustomCandleForm from './CustomCandleForm';

const Cart = () => {
    const { 
		cart, verifyProducts, getTotalItems, getSubtotal, toggleCart, calculateFreeCandles,
		customizations, handleCustomizationChange, handleRemoveCustomCandle, isCheckoutValid
	} = useCart();
    const [validationError, setValidationError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const totalItems = getTotalItems()
    const freeCandles = calculateFreeCandles();
    const router = useRouter();

    const handleCheckout = async () => {
        if (!isCheckoutValid()) {
            setValidationError(true);
        } else {
            setValidationError(false);
            setIsLoading(true); // Show loader

            const verifiedCart = verifyProducts();
            if (verifiedCart) {
                // Replace with actual checkout logic
                console.log("Redirecting to checkout page")
                router.push(`/checkout`); // ✅ Redirect to checkout URL
            }

            setTimeout(() => {
                setIsLoading(false); // Hide loader after checkout simulation
            }, 2000);
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
                        Subtotal ({totalItems} item{totalItems === 1 ? '' : 's'})
                    </div>
                    <div className={styles.money}>
                        ${getSubtotal()}
                    </div>
                    {validationError && (
                        <div className={styles.errorMessage}>
                            ❌ Please complete all customization forms before proceeding.
                        </div>
                    )}
                    <button 
                        className={styles.checkoutBtn}
                        onClick={handleCheckout}
                        disabled={isLoading}
                    >
                        {isLoading ? <div className={styles.loader}></div> : 'Proceed to Checkout'}
                    </button>
                </div>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (

                <div className={styles.cart}>
                    {freeCandles > 0 && (
                        <div className={styles.promotion}>
                            🎁 You've earned <strong>{freeCandles} FREE 3.5 oz Protection Candle(s)</strong> with your order!
                        </div>
                    )}                        
                    {cart.map((item) => {
                        const image = { altText: item.title, sourceUrl: item.image };
                        const isCustomCandle = item.type.includes("candle") && item.type.includes("custom");

                        return (
                            <div key={item.id} className={styles.cartItem}>
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
                                        {item.price && parseFloat(item.price) > 0 &&
                                        <div className={styles.price}>
                                            <span>{formatCurrency(item.price)}</span>
                                            <span><AddToCartButton item={item} small={true} /></span>
                                        </div>}
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
                            </div>
                        );
                    })}
                </div>)}
            </div>
        </div>
    );
};

export default Cart;
