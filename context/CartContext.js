import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);

    // Load cart from localStorage on first render
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
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
        setIsCartVisible((prev) => 
            visible !== undefined && visible !== null ? visible : !prev
        );
    };
    

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
            isCartVisible 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
