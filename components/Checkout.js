import { useEffect, useState } from 'react'
import cx from 'classnames'
import { isValidEmail } from './utils/shared'
import ShippingForm from './ShippingForm'
import { useCart } from '../context/CartContext'
import styles from './checkout.module.scss'
import Summary from './Summary'

const Checkout = () => {
    const { 
        cart, verifyProducts, customizations, getTotalItems, getSubtotal, calculateTotals, totalOrderCosts
    } = useCart();
    
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
    const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [paymentInstance, setPaymentInstance] = useState(null);
    const [shippingInformation, setShippingInformation] = useState({});
    const totalItems = getTotalItems();

    useEffect(() => {
        async function initializePayment() {
            if (!window.Square) {
                console.error("Square SDK failed to load.");
                return;
            }
    
            try {
                // Fetch Square credentials from the server
                const response = await fetch("/api/getSquareConfig");
                const { applicationId, environment } = await response.json();

                // console.log("applicationId, environment", applicationId, environment)
    
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


    const handleContinueToPayment = () => {
        // console.log("shippingInformation", shippingInformation)

        if (verifyProducts()) {
            // Go to next step Summary
            calculateTotals(shippingInformation)
            handleShowSummary(true)
        } else {
            // Send an erro message
            setShippingInformation(null);
        }        
    }    

    const handlePayment = async () => {
        setIsSubmittingPayment(true)

        try {
            const order = await createOrder();
            console.log("order ::", order)

            if (order?.order?.id) {
                console.log("==> order id: ", order.order.id)
                const payment = await createPayment({
                    orderId: order.order.id
                });
                console.log("payment ::", payment)

                if (payment?.payment?.id) {
                    // Send email with receipt to client and copy to us
                    setIsPaymentCompleted(true)
                }

            } else {
                setErrorMessage("Order could not be crated.");    
            }
            
        } catch (error) {
            console.error("handlePayment error");
        } finally {
            setIsSubmittingPayment(false)
        }            
    }

    const createOrder = async () => {
        if (!paymentInstance) return;

        // console.log("paymentInstance", paymentInstance)

        setErrorMessage("");

        try {
            const { token } = await paymentInstance.tokenize();
            if (!token) {
                setErrorMessage("Payment failed. Please try again.");
                return;
            }

            const response = await fetch("/api/createOrder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    cart,
                    totalOrderCosts,
                    customizations,
                    shippingInformation }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Payment result ::", data)
                return data
            } else {
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error("createOrder error:", error);
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            // Error
        }
    }

    const createPayment = async ({orderId}) => {
        console.log("createPayment orderId", orderId)

        if (!paymentInstance) return;

        setErrorMessage("");

        try {
            const { token } = await paymentInstance.tokenize();
            if (!token) {
                setErrorMessage("Payment failed. Please try again.");
                return;
            }

            const response = await fetch("/api/createPayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    orderId,
                    totalOrderCosts,
                    shippingInformation }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Payment result ::", data)
                return data
            } else {
                setErrorMessage(data.error);
            }
        } catch (error) {
            console.error("createPayment error:", error);
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            // Error
        }
    }

    const handleShowSummary = (value) => {
        setShowSummary(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const addressFields = [
        "addressLine1",
        "city",
        "state",
        "zipCode"
    ]

    const contactFields = [
        "firstName",
        "lastName",
        "email"
    ]

    const checkAddressFields = () => {
        const isValid = addressFields.every(field => shippingInformation[field]?.trim());
        return isValid
    }    

    const checkRequiredFields = () => {
        const requiredFields = [...addressFields, ...contactFields]
        const isValid = requiredFields.every(field => shippingInformation[field]?.trim());
        return isValid
    }

    const areShippingFieldsOk = checkRequiredFields() && isValidEmail(shippingInformation.email)

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>

                <div className={cx(styles.shippingScreen, {[styles.show]: !showSummary}, {[styles.hide]: showSummary})}>
                
                    <div className={styles.subtotal}>
                        <div className={styles.label}>
                            Subtotal ({totalItems} item{totalItems === 1 ? '' : 's'})
                        </div>
                        {totalItems > 0 && <div className={styles.money}>
                            ${getSubtotal()}
                        </div>}
                    </div>   

                    {totalItems > 0 && 
                        <>
                            <ShippingForm 
                                shippingInformation={shippingInformation}
                                setShippingInformation={setShippingInformation}
                                setIsVerifyingAddress={setIsVerifyingAddress}
                                setFetchingSuggestions={setFetchingSuggestions}
                                checkAddressFields={checkAddressFields}
                            />

                            <button className={styles.continueToPaymentBtn} onClick={handleContinueToPayment} disabled={!areShippingFieldsOk || isVerifyingAddress || fetchingSuggestions}>
                                {isVerifyingAddress || fetchingSuggestions ? <div className={styles.loader}></div> : "Continue"}
                            </button>

                            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                        </>
                    }
                </div>

                {totalItems > 0 && <div className={cx(styles.paymentScreen, {[styles.show]: showSummary}, {[styles.hide]: !showSummary})}>
                    <div className={styles.orderSummary}>
                        <Summary 
                            shippingInformation={shippingInformation} 
                            handleShowSummary={handleShowSummary}                            
                        />
                    </div>

                    <div className={styles.paymentInfo}>
                        <h3>Payment</h3>
                        <p>All transactions are secure and encrypted.</p>

                        <div className={styles.payment}>
                            <div id="card-container"></div>
                            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                        </div>
                    </div>

                    {!isPaymentCompleted && <button className={styles.checkoutBtn} onClick={handlePayment} disabled={!shippingInformation || isSubmittingPayment}>
                        {isSubmittingPayment ? <div className={styles.loader}></div> : "Submit Payment"}
                    </button>}

                    {isPaymentCompleted && <div>Payment completed</div>}
                </div>}
                
            </div>
        </div>
    );
};

export default Checkout;
