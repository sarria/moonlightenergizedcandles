import { useState } from "react";
import cx from 'classnames';
import styles from "./shippingForm.module.scss";

const ShippingForm = ({ shippingInformation, setShippingInformation, setIsVerifyingAddress, checkAddressFields }) => { 
  const [suggestions, setSuggestions] = useState([]);
  const isAddressSelected = false;
  
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

    isAddressSelected = false
    fetchPlaces(value)
  };

  const handleFieldChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    // console.log(key, value)
    setShippingInformation((prev) => ({ 
      ...prev, 
      [key]: value
    }));
  }

  // Fetch Places API Autocomplete Results
  const fetchPlaces = async (inputText) => {
    if (!inputText) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch("/api/google-autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();
      // console.log("Autocomplete results:", data);

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
    }
  };

  // Handle Address Selection
  const handleSelectAddress = async (selectedAddress, placeId) => {
    setIsVerifyingAddress(true)
    isAddressSelected = true
    setShippingInformation((prev) => ({ 
      ...prev, 
      placeId,
      address: selectedAddress
    }));
    setSuggestions([]);
    await fetchPlaceDetails(selectedAddress, placeId);
  };

  const handleCheckboxChange = (e) => {
    setShippingInformation((prev) => ({ 
      ...prev, 
      joinMailingList: e.target.checked
    }));
  };  

  // Fetch and validate address components
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
      setIsVerifyingAddress(false)
    } catch (error) {
      console.error("Error fetching place details:", error);
      setIsVerifyingAddress(false)
    }
  };

  const missingField = (field) => {
    return typeof shippingInformation["firstName"] === "string" && !shippingInformation[field]?.trim()
  }

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>    
        <div className={styles["shipping-form"]}>
          <div className={styles.label}>Shipping Address</div>

          <div className={styles.shippingInput}>
            <div className={styles.inputs}>
              <div className={cx(styles.field, {[styles.missingField]: missingField('firstName')})}>
                <div className={styles.input}>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={shippingInformation.firstName || ''}
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
                        value={shippingInformation.lastName || ''}
                        placeholder="Last name"
                        onChange={handleFieldChange}
                    />
                </div>
              </div>              
            </div>
          </div>

          <div className={styles.shippingInput}>
            <div className={cx(styles.inputs, styles.column)}>
            <div className={cx(styles.field, {[styles.missingField]: missingField('email')})}>
                <div className={styles.input}>
                  <input
                    type="text"
                    name="email"
                    value={shippingInformation.email || ''}
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
                  checked={shippingInformation.joinMailingList || false}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="mailingList">Join our mailing list for updates and promotions</label>
              </div>                            
              <div className={styles.field}>
                <div className={styles.input}>
                  <textarea
                    type="text"
                    name="notes"
                    value={shippingInformation.notes || ''}
                    onChange={handleFieldChange}
                    placeholder="Any special delivery instructions?"
                  />
                </div>
              </div>              
            </div>
          </div>        

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
                    value={shippingInformation.address || ''}
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
        </div>

        {/* {isAddressSelected && !isAddressComplete && (
            <div className={styles.errorMessage}>
                <p>Please enter a complete shipping address before proceeding to payment.</p>
            </div>
        )}         */}
      </div>
    </div>
  );
};

export default ShippingForm;
