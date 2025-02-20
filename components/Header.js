import Head from 'next/head';

const Header = ({seo}) => {
	// console.log('SEO', seo)
	return (
		<Head>
		{/* Basic Meta Tags */}
		<title>{seo.title}</title>
		<meta name="description" content={seo.description} />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="icon" href="/favicon.ico" />

		{/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;600&display=swap" rel="stylesheet" />
		<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;400;500;600&display=swap" rel="stylesheet" /> */}

		{/* Open Graph Meta Tags for Facebook, WhatsApp, and LinkedIn */}
		<meta property="og:type" content="website" />
		<meta property="og:title" content={seo.title} />
		<meta property="og:description" content={seo.description} />
		<meta property="og:image" content={seo.logo.sourceUrl} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:url" content="https://www.moonlightenergizedcandles.com/" />
		<meta property="og:site_name" content={seo.title} />

		{/* Twitter (X) Card Meta Tags */}
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={seo.title} />
		<meta name="twitter:description" content={seo.description} />
		<meta name="twitter:image" content={seo.logo.sourceUrl} />
		<meta name="twitter:site" content="@YourTwitterHandle" /> {/* Replace with your X (Twitter) handle */}

		{/* Additional Meta Tags for SEO */}
		<meta name="robots" content="index, follow" />
		<meta name="author" content={seo.title} />

		{/* Canonical URL (Prevents Duplicate Content Issues) */}
		<link rel="canonical" href="https://www.moonlightenergizedcandles.com/" />
		</Head>
	);
};

export default Header;
