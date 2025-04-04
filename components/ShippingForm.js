import { useState } from "react";
import { useCart } from '../context/CartContext';
import cx from 'classnames';
import styles from "./shippingForm.module.scss";
import { isValidEmail } from './utils/shared';

const ShippingForm = ({ setIsVerifyingAddress, setFetchingSuggestions, checkAddressFields }) => { 
  const { shippingInformation, setShippingInformation, applyCoupon, coupon } = useCart();

  const [suggestions, setSuggestions] = useState([]);
  const [couponCode, setCouponCode] = useState(coupon?.code || '');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  let isAddressSelected = false;

  const handleAddressChange = (e) => {
    const value = e.target.value;

    setShippingInformation((prev) => ({ 
      ...prev, 
      address: value,
      selectedAddress: "",
      addressLine1: "",
      city: "",
      state: "",
      zipCode: ""         
    }));    

    isAddressSelected = false;
    fetchPlaces(value);
  };

  const handleFieldChange = (e) => {
    const key = e.target.name;
    let value = e.target.value;

    if (key === "notes" && value.length > 500) {
      value = value.slice(0, 500);
    }

    setShippingInformation((prev) => ({ 
      ...prev, 
      [key]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setShippingInformation((prev) => ({ 
      ...prev, 
      [name]: checked
    }));
  };

  const fetchPlaces = async (inputText) => {
    if (!inputText) {
      setSuggestions([]);
      return;
    }

    setFetchingSuggestions(true);

    try {
      const response = await fetch("/api/google-autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();

      if (data.suggestions?.length > 0) {
        const formattedSuggestions = data.suggestions.map((s) => ({
          description: s.placePrediction.text.text,
          placeId: s.placePrediction.placeId,
        }));
        setSuggestions(formattedSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setFetchingSuggestions(false);
    }
  };

  const handleSelectAddress = async (selectedAddress, placeId) => {
    setIsVerifyingAddress(true);
    isAddressSelected = true;
    setShippingInformation((prev) => ({ 
      ...prev, 
      placeId,
      address: selectedAddress
    }));
    setSuggestions([]);
    await fetchPlaceDetails(selectedAddress, placeId);
  };

  const fetchPlaceDetails = async (selectedAddress, placeId) => {
    try {
      const response = await fetch("/api/google-place-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      });

      const data = await response.json();
      if (data.addressComponents) {
        const addressParts = {
          selectedAddress,
          streetNumber: data.addressComponents.find((c) => c.types.includes("street_number"))?.shortText || "",
          route: data.addressComponents.find((c) => c.types.includes("route"))?.shortText || "",
          city: data.addressComponents.find((c) => c.types.includes("locality"))?.shortText || "",
          state: data.addressComponents.find((c) => c.types.includes("administrative_area_level_1"))?.shortText || "",
          zipCode: data.addressComponents.find((c) => c.types.includes("postal_code"))?.shortText || ""
        };
        addressParts.addressLine1 = `${addressParts.streetNumber} ${addressParts.route}`.trim();

        setShippingInformation((prev) => ({ 
          ...prev, 
          ...addressParts
        }));
      }
      setIsVerifyingAddress(false);
    } catch (error) {
      console.error("Error fetching place details:", error);
      setIsVerifyingAddress(false);
    }
  };

  const missingField = (field) => {
    if (!shippingInformation) return false;
    return typeof shippingInformation[field] === "string" && !shippingInformation[field]?.trim();
  };

  const handleCheckCoupon = async () => {
    setIsApplyingCoupon(true);
    applyCoupon(null);
    setCouponError('');

    try {
      const response = await fetch("/api/validateCoupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode }),
      });

      const data = await response.json();
      const coupon = data?.data?.data?.coupons;

      if (response.ok && coupon?.length) {
        applyCoupon(coupon[0]);
      } else {
        applyCoupon(null);
        setCouponError('Invalid or expired coupon.');
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>    
        <div className={styles["shipping-form"]}>

          <div className={styles.shippingInput}>
            <div className={styles.inputs}>
              <div className={cx(styles.field, {[styles.missingField]: missingField('firstName')})}>
                <div className={styles.input}>
                  <input 
                    type="text" 
                    placeholder="Enter coupon code" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)} 
                  />
                </div>
              </div>
              <div className={cx(styles.field, styles.button)}>
                <button className={styles.applyCouponBtn} onClick={handleCheckCoupon} disabled={isApplyingCoupon} >
                  {isApplyingCoupon ? <div className={styles.loader}></div> : "Apply Coupon"}
                </button>
              </div>
            </div>
            {coupon && <div className={styles.couponApplied}>{coupon.message}</div>}
            {!coupon && couponError !== '' && <div className={styles.couponError}>{couponError}</div>}
          </div>

          <br />

          <div className={styles.note}>
            Orders take 3-5 business days to process before shipping. Mailing takes about 2 days, and we’ll email you the tracking number once shipped.
          </div>

          <div className={styles.checkboxField}>
            <input 
              type="checkbox" 
              id="pickup" 
              name="pickup"
              checked={shippingInformation?.pickup || false}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="pickup"><strong>I'll pick up my order locally</strong></label>
          </div><br/>

          <div className={styles.label}>Your information</div>

          <div className={styles.shippingInput}>
            <div className={styles.inputs}>
              <div className={cx(styles.field, {[styles.missingField]: missingField('firstName')})}>
                <div className={styles.input}>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={shippingInformation?.firstName || ''}
                    placeholder="First name"
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
              <div className={cx(styles.field, {[styles.missingField]: missingField('lastName')})}>
                <div className={styles.input}>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={shippingInformation?.lastName || ''}
                    placeholder="Last name"
                    onChange={handleFieldChange}
                  />
                </div>
              </div>              
            </div>
          </div>

          <div className={styles.shippingInput}>
            <div className={cx(styles.inputs, styles.column)}>
              <div className={cx(styles.field, {[styles.missingField]: missingField('email') || !isValidEmail(shippingInformation?.email)})}>
                <div className={styles.input}>
                  <input
                    type="text"
                    name="email"
                    value={shippingInformation?.email || ''}
                    onChange={handleFieldChange}
                    placeholder="Email address to receipt"
                  />
                </div>
              </div>
              <div className={styles.checkboxField}>
                <input 
                  type="checkbox" 
                  id="mailingList" 
                  name="joinMailingList"
                  checked={shippingInformation?.joinMailingList || false}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="mailingList">Join our mailing list for updates and promotions</label>
              </div>
              <div className={styles.field}>
                <div className={styles.input}>
                  <textarea
                    type="text"
                    name="notes"
                    value={shippingInformation?.notes || ''}
                    onChange={handleFieldChange}
                    placeholder="Any special instructions?"
                  />
                </div>
              </div>              
            </div>
          </div>        

          {!shippingInformation?.pickup && (
            <>
              <br/>
              <div className={styles.label}>Shipping Address</div>

              <div className={styles.note}>
                Please type your address and select one from the suggestions to validate and continue
              </div>

              <div className={styles.shippingInput}>
                <div className={styles.inputs}>
                  <div className={cx(styles.field, {[styles.missingField]: missingField('address') || !checkAddressFields()})}>
                    <div className={styles.input}>
                      <input
                        type="text"
                        name="address"
                        value={shippingInformation?.address || ''}
                        onChange={handleAddressChange}
                        placeholder="Enter your shipping address here"
                      />
                    </div>
                  </div>              
                </div>
              </div>

              {!isAddressSelected && suggestions.length > 0 && (
                <ul className={styles["autocomplete-dropdown"]}>
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSelectAddress(suggestion.description, suggestion.placeId)}>
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
