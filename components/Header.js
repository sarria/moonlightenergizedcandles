import Head from 'next/head';
import { useEffect, useState } from 'react';

const Header = ({ seo }) => {
	const [squareLoaded, setSquareLoaded] = useState(false);

	useEffect(() => {
		// Fetch Square script URL dynamically
		async function loadSquareScript() {
			try {
				const response = await fetch('/api/getSquareConfig');
				const { scriptUrl } = await response.json();

				// Check if script is already added
				if (document.querySelector(`script[src="${scriptUrl}"]`)) {
					setSquareLoaded(true);
					return;
				}

				// Create and append the Square script
				const script = document.createElement('script');
				script.src = scriptUrl;
				script.async = true;
				script.onload = () => {
					console.log("✅ Square SDK Loaded on Header");
					setSquareLoaded(true);
				};
				script.onerror = () => {
					console.error("❌ Failed to load Square SDK");
				};

				document.head.appendChild(script);
			} catch (error) {
				console.error("Error loading Square script:", error);
			}
		}

		loadSquareScript();
	}, []);

	return (
		<Head>
			<title>{seo.title}</title>
			<meta name="description" content={seo.description} />
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
			<link rel="icon" href="/favicon.ico" />
			<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;600&display=swap" rel="stylesheet" />

			<meta property="og:type" content="website" />
			<meta property="og:title" content={seo.title} />
			<meta property="og:description" content={seo.description} />
			<meta property="og:image" content={seo.image.sourceUrl || seo.image} />
			<meta property="og:url" content="https://www.moonlightenergizedcandles.com/" />
			<meta property="og:site_name" content={seo.title} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={seo.title} />
			<meta name="twitter:description" content={seo.description} />
			<meta name="twitter:image" content={seo.image.sourceUrl || seo.image} />

			<meta name="robots" content="index, follow" />
			<meta name="author" content={seo.title} />

			<link rel="canonical" href="https://www.moonlightenergizedcandles.com/" />
		</Head>
	);
};

export default Header;
