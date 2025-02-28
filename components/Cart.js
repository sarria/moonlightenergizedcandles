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
		customizations, handleCustomizationChange
	} = useCart();
    const [validationError, setValidationError] = useState(false);

    const handleRemoveCustomCandle = (id) => {
        // const existingItem = cart.find((item) => item.id === id);
        // if (existingItem.quantity > 1) {
        //     updateQuantity(id, existingItem.quantity - 1);
        // } else {
        //     removeFromCart(id);
        // }

        // setCustomizations((prev) => {
        //     const updatedForms = { ...prev };
        //     const formKeys = Object.keys(updatedForms).filter((key) => key.startsWith(id));
        //     if (formKeys.length > 0) delete updatedForms[formKeys[0]];
        //     return updatedForms;
        // });
    };

    const isCheckoutValid = () => {
        for (const item of cart) {
            if (item.type.includes("candle") && item.type.includes("custom")) {
                for (let i = 0; i < item.quantity; i++) {
                    const formId = `${item.id}-${i}`;
                    const formData = customizations[formId] || {};
                    if (
                        !(formData.date || formData.words) || // Must have either a date or three words
                        !formData.name1 || !formData.zodiac1 || // First name & zodiac required
                        !formData.name2 || !formData.zodiac2   // Second name & zodiac required
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

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
                    <Image src={faXmark} layout="fill" />
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
                                            const formId = `${item.id}-${index}`;
                                            return (
                                                <CustomCandleForm
                                                    key={formId}
                                                    formId={formId}
                                                    customizationData={customizations[formId] || {}}
                                                    onCustomizationChange={handleCustomizationChange}
                                                    onRemove={() => handleRemoveCustomCandle(item.id)}
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
