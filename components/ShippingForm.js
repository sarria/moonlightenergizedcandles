import { useState } from "react";
import cx from 'classnames';
import styles from "./shippingForm.module.scss";

const ShippingForm = ({ onAddressValid, setShowCardEntry }) => { 
  const [formData, setFormData] = useState({ address: "", state: "", placeId: null });
  const [suggestions, setSuggestions] = useState([]);
  const isAddressSelected = false;
  const isAddressComplete = false
  
  // ✅ Handle input changes and fetch suggestions
  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ 
      ...formData, 
      address: value,
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: ""    
    });

    isAddressSelected = false
    isAddressComplete = false
    setShowCardEntry(false)
    fetchPlaces(value)
  };

  // ✅ Fetch Places API Autocomplete Results
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
      console.log("Autocomplete results:", data);

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

  // ✅ Handle Address Selection
  const handleSelectAddress = async (selectedAddress, placeId) => {
    isAddressSelected = true
    setFormData({ ...formData, address: selectedAddress, placeId });
    setSuggestions([]);
    await fetchPlaceDetails(selectedAddress, placeId);
  };

  // ✅ Fetch and validate address components
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

        setFormData((prev) => ({ ...prev, ...addressParts }));

        if (addressParts.addressLine1 && addressParts.city && addressParts.state && addressParts.zipCode) {
          isAddressComplete = true
          onAddressValid(addressParts);
        }
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>    
        <div className={styles["shipping-form"]}>
          <div className={styles.label}>Shipping Address</div>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Start typing your address..."
            className={styles.input}
          />

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

        <div className={cx(styles.note, { [styles.hide]: isAddressComplete })}>
          Please start typing your address and select one from the suggestions to continue
        </div>

        {isAddressSelected && !isAddressComplete && (
            <div className={styles.errorMessage}>
                <p>Please enter a complete shipping address before proceeding to payment.</p>
            </div>
        )}        
      </div>
    </div>
  );
};

export default ShippingForm;
