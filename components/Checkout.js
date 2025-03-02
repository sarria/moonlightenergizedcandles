import { useState } from 'react';
import ShippingForm from './ShippingForm'
import styles from './checkout.module.scss'

const Checkout = () => {
    const [isAddressSelected, setIsAddressSelected] = useState(false);

    const isAddressValid = () => isAddressSelected;

    return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
                <ShippingForm 
                    isAddressSelected={isAddressSelected}
                    setIsAddressSelected={setIsAddressSelected}
                />

                {isAddressValid() && 
                <div>
                PAYMENT
                </div>}
            </div>
        </div>
    )
};

export default Checkout;
