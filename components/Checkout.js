import { useState } from 'react';
import ShippingForm from './ShippingForm'
import styles from './checkout.module.scss'

const Checkout = () => {

    return (
		<div className={styles.root}>
			<div className={styles.wrapper}>
                <ShippingForm />
           
            </div>
        </div>
    )
};

export default Checkout;
