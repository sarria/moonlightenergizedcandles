import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [customizations, setCustomizations] = useState({});
    const [isCartVisible, setIsCartVisible] = useState(false);
    const [slug, setSlug] = useState('');

    // Load cart and customizations from sessionStorage on first render
    useEffect(() => {
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        const savedCustomForms = sessionStorage.getItem('customForms');
        if (savedCustomForms) {
            setCustomizations(JSON.parse(savedCustomForms));
        }        
    }, []);

    // Save cart to sessionStorage whenever it changes
    useEffect(() => {
        if (cart.length > 0) {
            sessionStorage.setItem('cart', JSON.stringify(cart));
        } else {
            sessionStorage.removeItem('cart');
        }
    }, [cart]);

    // Save customizations to sessionStorage whenever it changes
    useEffect(() => {
        if (customizations) {
            // console.log('sessionStorage customForms', customizations)
            sessionStorage.setItem('customForms', JSON.stringify(customizations));
        } else {
            // console.log("Remove customForms")
            sessionStorage.removeItem('customForms');
        }
    }, [customizations]);    

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });

        if (item.type.includes("candle") && item.type.includes("custom")) {
            toggleCart(true)
        }
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    // Get total number of items in the cart
    const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

    // Get total cost of items in the cart
    const getSubtotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const getTotalQuantityById = (id) => {
        const item = cart.find((cartItem) => cartItem.id === id);
        return item ? item.quantity : 0;
    };

    // Toggle cart visibility
    const toggleCart = (visible) => {
        if (getTotalItems() !== 0) {
            setIsCartVisible((prev) => 
                visible !== undefined && visible !== null ? visible : !prev
            )
        }
    };
    
    const handleCustomizationChange = (id, index, field, value) => {
        console.log("id, index, field, value :: ", id, index, field, value);

        setCustomizations((prev) => {
            const existingEntries = prev[id] || []; // Ensure an array exists
            const updatedEntries = [...existingEntries];
    
            // Ensure the correct entry exists in the array
            updatedEntries[index] = {
                ...(updatedEntries[index] || {}), // Preserve existing fields
                [field]: value, // Update only the changed field
            };

            console.log("updatedEntries", updatedEntries)
    
            return { ...prev, [id]: updatedEntries };
        });
    };

    const handleRemoveCustomCandle = (id, index) => {
        console.log("Removing customization:", id, index);

        setCustomizations((prev) => {
            if (!prev[id]) return prev; // If no customizations exist, return unchanged
            const updatedEntries = prev[id].filter((_, i) => i !== index); // Remove the specific entry
            return { ...prev, [id]: updatedEntries };
        });

        const newQty = getTotalQuantityById(id) - 1

        if (newQty == 0) {
            removeFromCart(id)
        } else {
            updateQuantity(id, getTotalQuantityById(id) - 1)
        }
    };
    
    const isCheckoutValid = () => {
        for (const item of cart) {
            if (item.type.includes("candle") && item.type.includes("custom")) {
                for (let index = 0; index < item.quantity; index++) {
					const formData = customizations[item.id] ? customizations[item.id][index] || {} : {}
                    if (
                        !(formData.date || formData.words) || // Must have either a date or three words
                        !formData.name1 || !formData.zodiac1 || // First name & zodiac required
                        !formData.name2 || !formData.zodiac2   // Second name & zodiac required
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // Verify the prices in case of a hack to the sessionStorage
    const verifyProducts = async () => {
        try {
            const response = await fetch('/api/verifyProducts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart }) // Send cart data for verification
            });
    
            const updatedCart = await response.json();
            // console.log("updatedCart :: ", updatedCart);
    
            if (updatedCart) {
                console.log("Cart successfully verified and updated!");
                sessionStorage.setItem('cart', JSON.stringify(updatedCart));
                setCart(updatedCart);
                return true;
            } else {
                console.error("Verification failed: No updated cart returned.");
                return false;
            }
        } catch (error) {
            console.error("Error verifying cart:", error);
            return false;
        }
    };
    
    const calculateTaxes = (state) => {
        const taxRate = state === "PA" ? 0.06 : 0;
        return getSubtotal() * taxRate;
    };

    const getTotalOrderCost = (state) => {
        const subtotal = getSubtotal();
        const taxes = calculateTaxes(state);
        return subtotal + taxes;
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            getTotalItems, 
            getSubtotal, 
            getTotalQuantityById,
            toggleCart, 
            isCartVisible,
            customizations,
            handleCustomizationChange,
            handleRemoveCustomCandle,
            isCheckoutValid,
            verifyProducts,
            slug, setSlug,
            calculateTaxes,
            getTotalOrderCost
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
