import Head from 'next/head'

const Header = ({seo}) => {
	return (
		<>
			<Head>
				<title>{seo.title}</title>
				<meta name="description" content={seo.metaDesc} />
				<meta name="keywords" content={seo.metaKeywords} />
				<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;600&display=swap" rel="stylesheet" />
				<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;400;500;600&display=swap" rel="stylesheet" />
				<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
			</Head>
		</>
	)
}

export default Header;