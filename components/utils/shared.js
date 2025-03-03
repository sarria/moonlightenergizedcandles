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

export function formatCurrency(price, currency = 'USD', locale = 'en-US') {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0  
	}).format(price);
}

export function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }