import { useEffect, useState } from 'react';
import cx from 'classnames';
import ShippingForm from './ShippingForm';
import { useCart } from '../context/CartContext';
import styles from './checkout.module.scss';

const Checkout = () => {
    const { 
        cart, verifyProducts, getTotalItems, getTotalCost
    } = useCart();
    
    const [isLoading, setIsLoading] = useState(false);
    const [showCardEntry, setShowCardEntry] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [paymentInstance, setPaymentInstance] = useState(null);
    const [shippingAddress, setShippingAddress] = useState(null);
    const totalItems = getTotalItems();

    useEffect(() => {
        async function initializePayment() {
            if (!window.Square) {
                console.error("Square SDK failed to load.");
                return;
            }
    
            try {
                // 🔹 Fetch Square credentials from the server
                const response = await fetch("/api/getSquareConfig");
                const { applicationId, environment } = await response.json();

                console.log("applicationId, environment", applicationId, environment)
    
                const payments = window.Square.payments(applicationId, environment);
    
                const cardContainer = document.getElementById("card-container");
                // Remove any previously attached card instance
                if (cardContainer?.children.length > 0) {
                    cardContainer.innerHTML = "";
                }
    
                const card = await payments.card();
                await card.attach("#card-container"); // Ensure this div exists in the JSX
    
                setPaymentInstance(card);
            } catch (error) {
                console.error("Square Payments SDK Error:", error);
            }
        }
    
        initializePayment();
    }, []);

    const onAddressValid = async (addressParts) => {
        console.log("onAddressValid :: ", addressParts);
        if (addressParts.selectedAddress && addressParts.addressLine1 && addressParts.city && addressParts.state && addressParts.zipCode) {
            setShippingAddress(addressParts);
            // setIsLoading(true);
            const verifiedCart = verifyProducts();
            if (verifiedCart) {
                setShowCardEntry(true)
            }
        } else {
            // 
        }
    };

    const handlePayment = async () => {
        if (!paymentInstance) return;

        console.log("paymentInstance", paymentInstance)

        // setIsLoading(true);
        setErrorMessage("");

        try {
            const { token } = await paymentInstance.tokenize();
            if (!token) {
                setErrorMessage("Payment failed. Please try again.");
                // setIsLoading(false);
                return;
            }

            console.log("token", token)

            const response = await fetch("/api/submitPayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart, shippingAddress, token }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Payment result ::", data)
            } else {
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error("Payment error:", error);
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            // setIsLoading(false);
        }
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
                    setShowCardEntry={setShowCardEntry} 
                />

                {/* {isLoading && <div className={styles.loaderWrapper}><div className={styles.loader}></div></div>} */}

                <div className={cx(styles.paymentSection, {[styles.showCardEntry] : showCardEntry} )}>
                    <div id="card-container"></div>  {/* 🔹 This is where the card input should appear */}
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

                    <button className={styles.checkoutBtn} onClick={handlePayment} XXX_disabled={isLoading}>
                        {/* {isLoading ? <div className={styles.loader}></div> : "Submit Payment"} */}
                        Submit Payment
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
