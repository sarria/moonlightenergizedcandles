import { useState } from 'react';
import ShippingForm from './ShippingForm';
import { useCart } from '../context/CartContext';
import styles from './checkout.module.scss';

const Checkout = () => {
    const { 
        cart, verifyProducts, getTotalItems, getTotalCost, toggleCart,
        customizations, handleCustomizationChange, handleRemoveCustomCandle, isCheckoutValid
    } = useCart();
    
    const [paymentLink, setPaymentLink] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New state for spinner
    const totalItems = getTotalItems();

    const onAddressValid = async (addressParts) => {
        console.log("onAddressValid :: ", addressParts);
        if (addressParts.selectedAddress && addressParts.addressLine1 && addressParts.city && addressParts.state && addressParts.zipCode) {
            setIsLoading(true); // Show spinner
            const verifiedCart = verifyProducts();
            if (verifiedCart) {            
                await requestPaymentLink(addressParts);
            } else {
                // Show some error for failing cart verification
            }
        } else {
            setPaymentLink(''); // Hide payment link if address is incomplete
        }
    };

    const requestPaymentLink = async (addressParts) => {
        console.log('Requesting payment link...');
        try {
            const response = await fetch('/api/requestPaymentLink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart, addressParts })
            });

            const data = await response.json();
            if (response.ok) {
                setPaymentLink(data.paymentLink);
            } else {
                console.error("Error generating payment link:", data.error);
                setPaymentLink('');
            }
        } catch (error) {
            console.error("Request failed:", error);
            setPaymentLink('');
        } finally {
            setIsLoading(false); // Hide spinner after request completes
        }
    };

    const openPaymentWindow = () => {
        window.open(paymentLink, 'SquarePaymentWindow');
    };

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.subtotal}>
                    <div className={styles.label}>
                        Subtotal ({totalItems} item{totalItems === 1 ? '' : 's'})
                    </div>
                    <div className={styles.money}>
                        ${getTotalCost()}
                    </div>
                </div>

                <ShippingForm 
                    onAddressValid={onAddressValid}
                    setPaymentLink={setPaymentLink}
                />

                <div className={styles.paymentStatus}>
                    {isLoading ? (
                        <div className={styles.loaderWrapper}><div className={styles.loader}></div></div>
                    ) : paymentLink ? (
                        <div>
                            <p>Your payment link is ready:</p>
                            <button onClick={openPaymentWindow}>
                                Complete Payment
                            </button>
                        </div>
                    ) : null}
                </div>

            </div>
        </div>
    );
};

export default Checkout;
