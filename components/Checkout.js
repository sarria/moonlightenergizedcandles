import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import cx from 'classnames'
import { isValidEmail } from './utils/shared'
import ShippingForm from './ShippingForm'
import { useCart } from '../context/CartContext'
import styles from './checkout.module.scss'
import Summary from './Summary'

const Checkout = ({global}) => {
    const { 
        cart, verifyProducts, customizations, getTotalItems, calculateSubTotal, calculateTotals, totalOrderCosts,
        shippingInformation, setShippingInformation, calculateFreeCandles, coupon, clearSession
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
    const subTotal = calculateSubTotal()
    const pickupInstructions = global.pickupInstructions.replace(/\n/g, '<br>')
    
    useEffect(() => {
        async function initializePayment() {
            let attempts = 0;
            const maxAttempts = 10;
            const delay = 500;
    
            while (!window.Square && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delay));
                attempts++;
            }
    
            if (!window.Square) {
                console.error("❌ Square SDK failed to load after retries.");
                return;
            }
    
            try {
                const response = await fetch("/api/getSquareConfig");
                const { applicationId, environment } = await response.json();
                const payments = window.Square.payments(applicationId, environment);
    
                // Properly clean up any existing payment instance
                if (paymentInstance) {
                    await paymentInstance.destroy();
                    setPaymentInstance(null);
                }
    
                const card = await payments.card();
                await card.attach("#card-container");
    
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

    const handlePayment = async () => {
        setIsSubmittingPayment(true);
    
        try {
            const order = await createOrder();
            // console.log("order ::", order);
    
            if (order?.order?.id) {
                // console.log("==> order id: ", order.order.id);
                const payment = await createPayment({ orderId: order.order.id });
                // console.log("payment ::", payment);
    
                if (payment?.payment?.id) {
                    const { freeCandles } = calculateFreeCandles(cart, coupon)
                    
                    const data = { 
                        orderId: order.order.id,
                        paymentId: payment.payment.id,
                        shippingInformation, 
                        cart, 
                        totalOrderCosts, 
                        customizations,
                        freeCandles,
                        pickupInstructions
                    }

                    await fetch("/api/sendReceipt", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    });

                    setIsPaymentCompleted(true);
                    await closeSession(); // Reset Cart & Data
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

    const handleSubmitFreeOrder = async () => {
        const { freeCandles } = calculateFreeCandles(cart, coupon)
        const data = { 
            orderId: '',
            paymentId: '',
            shippingInformation, 
            cart, 
            totalOrderCosts, 
            customizations,
            freeCandles,
            pickupInstructions
        }

        // console.log("handleSubmitFreeOrder", data)

        await fetch("/api/sendReceipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        setIsPaymentCompleted(true);
        await closeSession(); // Reset Cart & Data
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
                // console.log("Payment result ::", data)
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
        // console.log("createPayment orderId", orderId)

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
                // console.log("Payment result ::", data)
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
        const requiredFields = shippingInformation?.pickup ? [...contactFields] : [...addressFields, ...contactFields]
        const isValid = requiredFields.every(field => shippingInformation[field]?.trim());
        return isValid
    }

    const closeSession = async () => {
        // console.log("coupon", coupon)

        if (coupon && coupon?.code !== "") {
            // console.log("Updating coupon quantity", coupon)
            const updateCoupon = await fetch("/api/updateCoupon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    couponCode: coupon.code 
                }),
            });
            
            // console.log("updateCoupon", updateCoupon)
        }

        clearSession()
        router.push(`/thank-you`);
    }    

    const areShippingFieldsOk = checkRequiredFields() && isValidEmail(shippingInformation.email)
    const continueToPayment = areShippingFieldsOk && !isVerifyingAddress && !fetchingSuggestions

    // console.log("areShippingFieldsOk", areShippingFieldsOk, !isVerifyingAddress, !fetchingSuggestions, areShippingFieldsOk && !isVerifyingAddress && !fetchingSuggestions)

    return (
        <div className={styles.root}>
            {!isPaymentCompleted && 
            <div className={styles.wrapper}>
                
                <div className={cx(styles.shippingScreen, {[styles.show]: !showSummary}, {[styles.hide]: showSummary})}>
                
                    <div className={styles.subtotal}>
                        <div className={styles.label}>
                            Subtotal ({totalItems} item{totalItems === 1 ? '' : 's'})
                        </div>
                        {totalItems > 0 && <div className={styles.money}>
                           ${subTotal}
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

                            <button className={styles.continueToPaymentBtn} onClick={handleContinueToPayment} disabled={!continueToPayment}>
                                {isVerifyingAddress || fetchingSuggestions ? <div className={styles.loader}></div> : "Continue"}
                            </button>

                            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                        </>
                    }
                </div>

                <div className={cx(styles.paymentScreen, {[styles.show]: showSummary}, {[styles.hide]: !showSummary})}>
                    <div className={styles.orderSummary}>
                        <Summary 
                            // shippingInformation={shippingInformation} 
                            handleShowSummary={handleShowSummary}
                            global={global}
                        />
                    </div>

                    <div className={cx({[styles.hide] : subTotal === 0})}>
                        <div className={styles.paymentInfo}>
                            <h3 className={styles.center}>Payment</h3>
                            <p>All transactions are secure and encrypted.</p>

                            <div className={styles.payment}>
                                <div id="card-container"></div>
                                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                            </div>
                        </div>

                        <div className={styles.center}>
                            <button className={styles.checkoutBtn} onClick={handlePayment} disabled={!shippingInformation || isSubmittingPayment}>
                                {isSubmittingPayment ? <div className={styles.loader}></div> : "Submit Payment"}
                            </button>
                        </div>

                    </div>
                    <div className={cx(styles.hide, {[styles.show] : subTotal === 0})}>
                        <button className={styles.checkoutBtn} onClick={handleSubmitFreeOrder}>
                            {isSubmittingPayment ? <div className={styles.loader}></div> : "Submit Free Order"}
                        </button>
                    </div>
                </div>
                
            </div>}
        </div>
    );
};

export default Checkout;
