import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [customizations, setCustomizations] = useState({});
    const [isCartVisible, setIsCartVisible] = useState(false);

    // Load cart and customizations from localStorage on first render
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        const savedCustomForms = localStorage.getItem('customForms');
        if (savedCustomForms) {
            setCustomizations(JSON.parse(savedCustomForms));
        }        
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            localStorage.removeItem('cart');
        }
    }, [cart]);

    // Save customizations to localStorage whenever it changes
    useEffect(() => {
        console.log("customizations.length", customizations ? 'si' : 'no')
        if (customizations) {
            console.log('localStorage customForms', customizations)
            localStorage.setItem('customForms', JSON.stringify(customizations));
        } else {
            console.log("Remove customForms")
            localStorage.removeItem('customForms');
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
    const getTotalCost = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

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

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            getTotalItems, 
            getTotalCost, 
            getTotalQuantityById,
            toggleCart, 
            isCartVisible,
            customizations,
            handleCustomizationChange,
            handleRemoveCustomCandle,
            isCheckoutValid
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
