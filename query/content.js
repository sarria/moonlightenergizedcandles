export default function query(slug) {

	const Query = `
		query {
			acfOptionsGlobalOptions {
				global {
					title
					description
					logo {
						altText
						sourceUrl
						mediaDetails {
							width
							height
						}
					}
					address
					copyRight
					email
					telephone
					facebook
					twitter
					instagram
					youtube
					navigation {
						page {
						... on Page {
							slug
							title
						}
						},
						label,
						id
					}
					shoppingPage{
						... on Page {
							slug
							title
						}
					}
					instagramFeedHeader
					instagramFeed {
						link
						image {
							altText
							sourceUrl
						}
					}
					productsNavigation {
						... on Page {
							id
							title
							slug
						}
					}						
				    candles {
						... on Product {
							id
							slug
							image
							title
							price
							headline
							type
							weight
							buttonLink
						}
					}
				    zodiacCandles {
						... on Product {
							id
							slug
							image
							title
							price
							headline
							type
							weight
							buttonLink
						}
					}
					purposeCandles {
						... on Product {
							id
							slug
							image
							title
							price
							headline
							type
							weight
							buttonLink
						}
					}
					accessories {
						... on Product {
							id
							slug
							image
							title
							price
							headline
							type
							weight
							buttonLink
						}
					}
				    zodiacBracelets {
						... on Product {
							id
							slug
							image
							title
							price
							headline
							type
							weight
							buttonLink
						}
					}

				}
			}
			product: products(where: {name: "${slug}"}) {
				edges {
					node {
						__typename
						id
						slug
						title
						image
						type
						weight
						price
						headline
						description
						seoTitle
						seoDescription
					}
				}
			}
			content: pages(where: {name: "${slug}"}) {
				edges {
					node {
						__typename
						slug
						title
						content_blocks {
							modules {
								moduleType
								shopProducts
								text
								videoUrl
								imagesLayout
								imagePadding
								images {
									image {
										altText
										databaseId
										sourceUrl
										mediaDetails {
											width
											height
										}
									}
									linkLabel
									linkPage {
										... on Page {
										slug
										title
										}
									}
								}
								thumbnails {
									image {
										altText
										sourceUrl
										mediaDetails {
											width
											height
										}
									}
									description
								}
								bios {
									photo {
										altText
										sourceUrl
										mediaDetails {
											width
											height
										}
									}
									name
									bio
								}
								articles {
									photo {
										altText
										sourceUrl
										mediaDetails {
											width
											height
										}
									}
									headline
									text
								}
								events {
									name
									location
									linkToMap
									date
									image {
										altText
										sourceUrl
									}
								}											
								image {
									altText
									sourceUrl
									mediaDetails {
									width
									height
									}
								}
								headline
								linkLabel
								linkPage {
									... on Page {
									slug
									title
									}
								}
								quotes {
									quote
									authorLine1
									authorLine2
								}
								line1
								line2
								dark							
							}
						}
						seo {
							seoTitle
							seoDescription
						}							
					}
				}
			}
		}
	`.replace(/\s\s+/g, ' ');

	// console.log('Query', Query)

	return Query;
}
