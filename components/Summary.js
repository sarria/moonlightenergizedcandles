import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router'; 
import { formatCurrency } from './utils/shared';
import styles from './summary.module.scss';
import Image from 'next/image';
import faDown from '../public/icons/chevron-down-solid.svg';
import parse from 'html-react-parser';

const Summary = ({ shippingInformation }) => {
    const { cart, getTotalItems, getSubtotal, getTotalOrderCost, calculateTaxes } = useCart();

    const totalItems = getTotalItems();
    const router = useRouter();
    
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    const toggleSummary = () => {
        setIsSummaryOpen(prevState => !prevState);
    };

    const subtotal = getSubtotal();
    const taxes = calculateTaxes(shippingInformation.state);
    const totalOrderCost = getTotalOrderCost(shippingInformation.state);

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                
                <div className={styles.totalCost}>
                    <div className={styles.money}>
                        {formatCurrency(totalOrderCost, 2, 2)}
                    </div>
                </div>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div className={styles.summary}>
                        <div className={styles.header}>
                            <div className={styles.label}>
                                Order Summary ({totalItems} item{totalItems === 1 ? '' : 's'})
                            </div>
                            <div className={styles.expand}>
                                <div 
                                    className={`${styles.toogleIcon} ${isSummaryOpen ? styles.rotate : ''}`} 
                                    onClick={toggleSummary}
                                >
                                    <Image src={faDown} layout="fill" title="Toggle Summary" />
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.items} ${isSummaryOpen ? styles.show : styles.hide}`}>
                            {cart.map((item) => {
                                return (
                                    <div key={item.id} className={styles.cartItem}>
                                        <div className={styles.item}>
                                            <div className={styles.info}>
                                                <div className={styles.title}>{item.title}</div>
                                                <div className={styles.headline}>{parse(item.headline)}</div>
                                                <div className={styles.cost}>{formatCurrency(item.price, 2, 2)} x {item.quantity}</div>
                                            </div>
                                            <div className={styles.price}>
                                                <div>{formatCurrency(item.price * item.quantity, 2, 2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className={styles.summaryFooter}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal, 2, 2)}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Taxes ({shippingInformation.state === "PA" ? "PA Sales Tax" : "No Tax"})</span>
                                    <span>{formatCurrency(taxes, 2, 2)}</span>
                                </div>
                                <div className={styles.summaryRowTotal}>
                                    <span>Order Total</span>
                                    <span>{formatCurrency(totalOrderCost, 2, 2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.shippingInfo}>
                    <h3>Shipping Information</h3>
                    <p><strong>Name:</strong> {shippingInformation.firstName} {shippingInformation.lastName}</p>
                    <p><strong>Email:</strong> {shippingInformation.email}</p>
                    <p><strong>Address:</strong> {shippingInformation.addressLine1}, {shippingInformation.city}, {shippingInformation.state} {shippingInformation.zipCode}</p>
                    {shippingInformation.notes && (
                        <p><strong>Notes:</strong> {shippingInformation.notes}</p>
                    )}
                </div>
           
            </div>
        </div>
    );
};

export default Summary;
