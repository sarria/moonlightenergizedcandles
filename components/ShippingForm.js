import { useState } from "react";
import styles from "./shippingForm.module.scss";

const ShippingForm = () => {
  const [formData, setFormData] = useState({ address: "", state: "", placeId: null });
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  // const [isAddressValid, setIsAddressValid] = useState(false);

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
    }); // ✅ Update input field value and reset address parts
    setIsAddressSelected(false); // Reset selection state
    fetchPlaces(value);
  };

  // ✅ Fetch Places API (New) Autocomplete Results
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

      if (data.suggestions && data.suggestions.length > 0) {
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
    setFormData({ ...formData, address: selectedAddress, placeId });
    setSuggestions([]);
    setIsAddressSelected(true);

    // ✅ Fetch state details for tax calculation
    await fetchPlaceDetails(placeId);
  };

  // ✅ Fetch State Details from Google Place API (New)
  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch("/api/google-place-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId }),
      });

      const data = await response.json();
      console.log("Place details:", data);

      if (data.addressComponents) {
        // ✅ Extract Address Parts
        const streetNumber = data.addressComponents.find((c) => c.types.includes("street_number"))?.shortText || "";
        const route = data.addressComponents.find((c) => c.types.includes("route"))?.shortText || "";
        const city = data.addressComponents.find((c) => c.types.includes("locality"))?.shortText || "";
        const state = data.addressComponents.find((c) => c.types.includes("administrative_area_level_1"))?.shortText || "";
        const zipCode = data.addressComponents.find((c) => c.types.includes("postal_code"))?.shortText || "";

        // ✅ Address Line 1 = Street Number + Route
        const addressLine1 = `${streetNumber} ${route}`.trim();

        // ✅ Save in State
        setFormData((prev) => ({
          ...prev,
          addressLine1,
          addressLine2: "", // Leave empty for potential input
          city,
          state,
          zipCode,
        }));

        console.log("Saved address parts:", { addressLine1, city, state, zipCode });
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
   };

  const isAddressValid = () => {
    if (formData.addressLine1 !== '' && formData.city !== '' && formData.state !== '' && formData.zipCode !== '') {
      return true;
    }
    return false;
  }

  return (
    <div className={styles.root}>
		    <div className={styles.wrapper}>    
            <form className={styles["shipping-form"]}>
                <div>Shipping Address</div>

                {errors.address && <p className={styles.error}>{errors.address}</p>}
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Start typing your address..."
                    className={styles.input}
                />

                {isValidating && <div>Validating Address...</div>}

                {suggestions.length > 0 && (
                    <ul className={styles["autocomplete-dropdown"]}>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectAddress(suggestion.description, suggestion.placeId)}>
                        {suggestion.description}
                        </li>
                    ))}
                    </ul>
                )}

            </form>

            {!isAddressValid() && <div>Please start typing your address and select one from the suggestions to continue</div>}

            {isAddressValid() && 
            <div>
              PAYMENT
            </div>}            
        </div>
    </div>
  );
};

export default ShippingForm;
