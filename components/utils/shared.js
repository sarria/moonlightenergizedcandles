export function generateIdFromLabel(label) {
    return label && label
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .trim() // Remove leading/trailing whitespace
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

export function handleScrollToSection(id) {
	const element = document.getElementById(id);
	if (element) {
		const offset = 77; // Adjust this for your fixed header
		const elementPosition = element.getBoundingClientRect().top + window.scrollY;
		window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
	}
}

export function formatCurrency(price, minimumFractionDigits = 0, maximumFractionDigits = 0, currency = 'USD', locale = 'en-US') {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
		minimumFractionDigits,
		maximumFractionDigits  
	}).format(price);
}

export function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && email !== "" ? emailRegex.test(email) : true;
}


export const FreeCandleProgressMsg = ({ freeCandles, candlesNeededForNext }) => {
    return (
        <>
            {freeCandles === 0 ? (
                <div>You're <strong>{candlesNeededForNext} Zodiac Candle{candlesNeededForNext > 1 ? 's' : ''}</strong> away from earning a FREE 3.5 oz Protection Candle!</div>
            ) : (
                <div>🎁 Congratulations! You've earned <strong>{freeCandles} FREE 3.5 oz Protection Candle{freeCandles === 1 ? '' : 's'}</strong> with your order! 🎉</div>
            )}
        </>
    );
};


export const FreeShippingMsg = ({freeShipping}) => {
	return (
		<>
			{freeShipping > 0 ? (
				<div>You're <strong>{formatCurrency(freeShipping)}</strong> away from Free Shipping!</div>
			) : (
				<div>🎉 Congratulations! You qualify for <strong>Free Shipping!</strong></div>
			)}
		</>
	)
}