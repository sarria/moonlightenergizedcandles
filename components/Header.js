import Head from 'next/head';
import { useEffect, useState } from 'react';

const Header = ({ seo }) => {
	const [squareScriptUrl, setSquareScriptUrl] = useState('');

	useEffect(() => {
		// Fetch the correct Square script URL based on environment
		async function fetchSquareScript() {
			try {
				const response = await fetch('/api/getSquareConfig');
				const { scriptUrl } = await response.json();
				setSquareScriptUrl(scriptUrl);
			} catch (error) {
				console.error("Error fetching Square script URL:", error);
			}
		}

		fetchSquareScript();
	}, []);

	return (
		<Head>
			{/* Basic Meta Tags */}
			<title>{seo.title}</title>
			<meta name="description" content={seo.description} />
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
			<link rel="icon" href="/favicon.ico" />

			<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;600&display=swap" rel="stylesheet" />

			{/* Open Graph Meta Tags */}
			<meta property="og:type" content="website" />
			<meta property="og:title" content={seo.title} />
			<meta property="og:description" content={seo.description} />
			<meta property="og:image" content={seo.image.sourceUrl ? seo.image.sourceUrl : seo.image} />
			<meta property="og:url" content="https://www.moonlightenergizedcandles.com/" />
			<meta property="og:site_name" content={seo.title} />

			{/* Twitter (X) Meta Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={seo.title} />
			<meta name="twitter:description" content={seo.description} />
			<meta name="twitter:image" content={seo.image.sourceUrl ? seo.image.sourceUrl : seo.image} />

			{/* SEO Meta Tags */}
			<meta name="robots" content="index, follow" />
			<meta name="author" content={seo.title} />

			{/* Canonical URL */}
			<link rel="canonical" href="https://www.moonlightenergizedcandles.com/" />

			{/* Dynamically Load Square Script */}
			{squareScriptUrl && <script type="text/javascript" src={squareScriptUrl} async></script>}
		</Head>
	);
};

export default Header;
