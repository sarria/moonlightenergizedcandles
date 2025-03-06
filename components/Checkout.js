import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import cx from 'classnames'
import { isValidEmail } from './utils/shared'
import ShippingForm from './ShippingForm'
import { useCart } from '../context/CartContext'
import styles from './checkout.module.scss'
import Summary from './Summary'

const Checkout = () => {
    const { 
        cart, setCart, verifyProducts, customizations, getTotalItems, getSubtotal, calculateTotals, totalOrderCosts, setTotalOrderCosts, setCustomizations,
        shippingInformation, setShippingInformation, calculateFreeCandles
    } = useCart();

    const router = useRouter();
    
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
    const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [paymentInstance, setPaymentInstance] = useState(null);
    const totalItems = getTotalItems();


    useEffect(() => {
        async function initializePayment() {
            let attempts = 0;
            const maxAttempts = 10; // Retry up to 10 times
            const delay = 500; // 500ms delay between retries
    
            while (!window.Square && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delay));
                attempts++;
            }
    
            if (window.Square) {
                console.log("✅ Square SDK exists on Checkout");
            } else {
                console.error("❌ Square SDK failed to load after retries.");
                return;
            }
    
            try {
                // Fetch Square credentials from the server
                const response = await fetch("/api/getSquareConfig");
                const { applicationId, environment } = await response.json();
    
                const payments = window.Square.payments(applicationId, environment);
    
                const cardContainer = document.getElementById("card-container");
                if (cardContainer?.children.length > 0) {
                    cardContainer.innerHTML = "";
                }
    
                const card = await payments.card();
                await card.attach("#card-container"); // Ensure this div exists in the JSX
    
                setPaymentInstance(card);
            } catch (error) {
                console.error("❌ Square Payments SDK Error:", error);
            }
        }
    
        initializePayment();
    }, []);


    const handleContinueToPayment = () => {
        // console.log("shippingInformation", shippingInformation)

        if (verifyProducts()) {
            // Go to next step Summary
            calculateTotals()
            handleShowSummary(true)
        } else {
            // Send an erro message
            setShippingInformation(null);
        }        
    }

    const closeSession = () => {
        setCart([])
        setShippingInformation({})
        setTotalOrderCosts({})
        setCustomizations({})
        router.push(`/thank-you`); // ✅ Redirect to than you page
    }

    const handlePayment = async () => {
        setIsSubmittingPayment(true);
    
        try {
            const order = await createOrder();
            console.log("order ::", order);
    
            if (order?.order?.id) {
                console.log("==> order id: ", order.order.id);
                const payment = await createPayment({ orderId: order.order.id });
                console.log("payment ::", payment);
    
                if (payment?.payment?.id) {
                    // ✅ Send Email Confirmation
                    const freeCandles = calculateFreeCandles();
                    const data = { 
                        orderId: order.order.id,
                        paymentId: payment.payment.id,
                        shippingInformation, 
                        cart, 
                        totalOrderCosts, 
                        customizations,
                        freeCandles
                    }
                    await fetch("/api/sendReceipt", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    });
    
                    setIsPaymentCompleted(true);
                    closeSession(); // Reset Cart & Data
                } else {
                    setErrorMessage("Payment could not be made.");    
                }
            } else {
                setErrorMessage("Order could not be created.");
            }
        } catch (error) {
            console.error("handlePayment error", error);
        } finally {
            setIsSubmittingPayment(false);
        }
    };
    

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
        if (!shippingInformation) return false;
        const isValid = addressFields.every(field => shippingInformation[field]?.trim());
        return isValid
    }    

    const checkRequiredFields = () => {
        if (!shippingInformation) return false;
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
                                // shippingInformation={shippingInformation}
                                // setShippingInformation={setShippingInformation}
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
                            // shippingInformation={shippingInformation} 
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

                    {isPaymentCompleted && <div className={styles.paymentCompletedLabel}>Payment completed!</div>}
                </div>}
                
            </div>
        </div>
    );
};

export default Checkout;
