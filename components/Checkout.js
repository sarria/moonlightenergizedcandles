import { useEffect, useState } from 'react';
import cx from 'classnames';
import { isValidEmail } from './utils/shared';
import ShippingForm from './ShippingForm';
import { useCart } from '../context/CartContext';
import styles from './checkout.module.scss';

const Checkout = () => {
    const { 
        cart, verifyProducts, getTotalItems, getTotalCost
    } = useCart();
    
    const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
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
                // 🔹 Fetch Square credentials from the server
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

    // const onAddressValid = async (addressParts) => {
    //     // console.log("onAddressValid :: ", addressParts);
    //     const requiredFields = ["selectedAddress","addressLine1","city","state","zipCode","firtName","lastName","email"]
    //     const areShippingFieldsOk = requiredFields.every(field => addressParts[field]?.trim());
    //     //const isValid = requiredFields.every(field => !!addressParts[field]?.trim());

    //     // console.log("addressParts", addressParts)
    //     // console.log(areShippingFieldsOk)

    //     if (areShippingFieldsOk) {
            // const verifiedCart = verifyProducts(); // Verify with the server the prodcut details in the cart
            
            // if (verifiedCart) {
            //     // Continue the payment process
            //     setShippingInformation(addressParts);

            //     // Calculate Taxes and Shpping costs

            // } else {
            //     setShippingInformation(null);
            // }
    //     } else {
    //         // alert("Address could not be verified")
    //     }
    // };

    const handlePayment = async () => {
        if (!paymentInstance) return;

        console.log("paymentInstance", paymentInstance)

        setErrorMessage("");

        try {
            const { token } = await paymentInstance.tokenize();
            if (!token) {
                setErrorMessage("Payment failed. Please try again.");
                return;
            }

            console.log("token", token)

            const response = await fetch("/api/submitPayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart, shippingInformation, token }),
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
            // Error
        }
    }

    const handleContinueToPayment = () => {
        console.log("shippingInformation", shippingInformation)

        if (verifyProducts()) {
            // Verify with the server the prodcut details in the cart
            // Continue the payment process
            // Calculate Taxes and Shpping costs


        } else {
            // Send an erro message
            setShippingInformation(null);
        }        
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

                <div className={styles.shippingScreen}>
                
                    <div className={styles.subtotal}>
                        <div className={styles.label}>
                            Subtotal ({totalItems} item{totalItems === 1 ? '' : 's'})
                        </div>
                        <div className={styles.money}>
                            ${getTotalCost()}
                        </div>
                    </div>   

                    <ShippingForm 
                        shippingInformation={shippingInformation}
                        setShippingInformation={setShippingInformation}
                        setIsVerifyingAddress={setIsVerifyingAddress}
                        checkAddressFields={checkAddressFields}
                    />

                    <button className={styles.continueToPaymentBtn} onClick={handleContinueToPayment} disabled={!areShippingFieldsOk || isVerifyingAddress}>
                        {isVerifyingAddress ? <div className={styles.loader}></div> : "Continue"}
                    </button>

                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}              
                </div>

                <div className={styles.paymentScreen}>
                    <div id="card-container"></div>
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

                    <button className={styles.checkoutBtn} onClick={handlePayment} disabled={!shippingInformation}>
                        {/* {isMakingPayment ? <div className={styles.loader}></div> : "Submit Payment"} */}
                        {/* <div className={styles.loader}></div> */}
                        Submit Payment
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default Checkout;
