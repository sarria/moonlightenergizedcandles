export const calculateDiscount = (cart, coupon) => {
    // console.log("calculateDiscount", coupon);

    if (coupon?.kind === "free_candle") {
        const discountedCandle = getDiscountedCandle(cart);
        return discountedCandle ? Number(discountedCandle.price) : 0;
    }

    return 0;
};

export const getDiscountedCandle = (cart) => {
    // Find the cheapest candle (9oz or 6oz) in the cart
    return cart
        .filter(item => item.type.includes("candle") && (item.weight === "9" || item.weight === "6"))
        .sort((a, b) => a.price - b.price)[0] || null; // Return the cheapest or null if none exist
};

export const calculateFreeCandles = (cart, coupon) => {
    const eligibleCandles = cart.filter(item => item.type.includes("candle") && item.weight === "9");
    
    let eligibleQuantity = eligibleCandles.reduce((total, item) => total + item.quantity, 0);

    // Use the helper function to determine the discounted candle
    const discountedCandle = getDiscountedCandle(cart);

    // If the discounted candle is 9oz, subtract it from the free candle calculation
    if (coupon && coupon?.kind === "free_candle" && discountedCandle?.weight === "9") {
        eligibleQuantity -= 1; // Subtract one 9oz candle from eligibility
    }

    // console.log('eligibleQuantity (after coupon adjustment)', eligibleQuantity);

    const freeCandles = Math.floor(eligibleQuantity / 3);
    const candlesNeededForNext = 3 - (eligibleQuantity % 3); // How many more 9oz candles are needed

    return { freeCandles, candlesNeededForNext };
};
