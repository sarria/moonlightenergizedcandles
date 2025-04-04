import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency, FreeCandleProgressMsg, FreeShippingMsg } from './utils/shared';
import styles from './summary.module.scss';
import cx from 'classnames';
import Image from 'next/image';
import faDown from '../images/icons/chevron-down-solid.svg';
import faPencil from '../images/icons/pencil-solid.svg';
import parse from 'html-react-parser';

const Summary = ({ handleShowSummary, global }) => {
  const { 
    cart, getTotalItems, customizations, totalOrderCosts, calculateFreeCandles,
    shippingInformation, freeShippingThreshold, coupon
  } = useCart();

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const totalItems = getTotalItems();
  const { freeCandles, candlesNeededForNext } = calculateFreeCandles(cart, coupon);
  const freeShipping = freeShippingThreshold();
  const isPickUp = shippingInformation?.pickup

  const toggleSummary = () => {
    setIsSummaryOpen(prevState => !prevState);
  };

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.totalCost}>
          <div className={styles.money}>
            {formatCurrency(totalOrderCosts.charge, 2, 2)}
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
                const isCustomCandle = item.type.includes("candle") && item.type.includes("custom");
                const itemCustomizations = customizations[item.id] || [];

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

                    {isCustomCandle && itemCustomizations.length > 0 && (
                      <div className={styles.customizations}>
                        <h4>Customization Details</h4>
                        {itemCustomizations.map((customization, index) => (
                          <div key={`${item.id}-custom-${index}`} className={styles.customItem}>
                            {customization.date && <p><strong>Date:</strong> {customization.date}</p>}
                            {customization.words && <p><strong>Words:</strong> {customization.words}</p>}
                            <p><strong>Name 1:</strong> {customization.name1} ({customization.zodiac1})</p>
                            <p><strong>Name 2:</strong> {customization.name2} ({customization.zodiac2})</p>
                          </div>
                        ))}
                      </div>
                    )}                                        
                  </div>
                );
              })}
            </div>

            <div className={styles.summaryFooter}>
              {totalOrderCosts.subtotal - totalOrderCosts.discount !== 0 && 
              <div className={cx(styles.summaryRow, styles.promo)}>
                <FreeShippingMsg freeShipping={freeShipping} />
              </div>}
              <div className={cx(styles.summaryRow, styles.promo)}>
                <FreeCandleProgressMsg freeCandles={freeCandles} candlesNeededForNext={candlesNeededForNext} />
              </div>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(totalOrderCosts.subtotal, 2, 2)}</span>
              </div>
              {totalOrderCosts.discount !== 0 && (
                <>
                  <div className={styles.summaryRow}>
                    <span>Discount:</span>
                    <span>-{formatCurrency(totalOrderCosts.discount, 2, 2)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span><strong>Subtotal after Discount:</strong></span>
                    <span>{formatCurrency(totalOrderCosts.subtotal - totalOrderCosts.discount, 2, 2)}</span>
                  </div>
                </>
              )}                            
              <div className={styles.summaryRow}>
                <span>Taxes {totalOrderCosts.taxes === 0 ? "(No Tax)" : "(PA Sales Tax)"}</span>
                <span>{formatCurrency(totalOrderCosts.taxes, 2, 2)}</span>
              </div>                            
              <div className={styles.summaryRow}>
                <span>Shipping & Handling</span>
                <span>{formatCurrency(totalOrderCosts.shipping + totalOrderCosts.handling, 2, 2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Total</span>
                <span>{formatCurrency(totalOrderCosts.total, 2, 2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Processing Fees</span>
                <span>{formatCurrency(totalOrderCosts.fees, 2, 2)}</span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Total to pay</span>
                <span>{formatCurrency(totalOrderCosts.charge, 2, 2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.shippingInfo}>
          <div className={styles.headline}>
            <div>{isPickUp ? "Pickup" : "Shipping"} Information</div>
            <div onClick={() => handleShowSummary(false)} className={styles.editIcon}>
              <Image src={faPencil} layout="fill" title="Edit Shipping Info" />
            </div>                        
          </div>

          <p><strong>Name:</strong> <span>{shippingInformation?.firstName} {shippingInformation?.lastName}</span></p>
          <p><strong>Email:</strong> <span>{shippingInformation?.email}</span></p>

          {isPickUp ? (
            <div className={styles.pickupMessage}>
                {parse(global.pickupInstructions.replace(/\n/g, '<br>'))}
            </div>
          ) : (
            <p><strong>Address:</strong> <span>{shippingInformation?.addressLine1}, {shippingInformation?.city}, {shippingInformation?.state} {shippingInformation?.zipCode}</span></p>
          )}

          {shippingInformation?.notes && (
            <p><strong>Notes:</strong> <span>{shippingInformation?.notes}</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
