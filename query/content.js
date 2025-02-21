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
				    candles {
						... on Product {
							image
							title
							price
							headline
							description
							type
							buttonLink
						}
					}
				    zodiacCandles {
						... on Product {
							image
							title
							price
							headline
							description
							type
							buttonLink
						}
					}
					purposeCandles {
						... on Product {
							image
							title
							price
							headline
							description
							type
							buttonLink
						}
					}
					accessories {
						... on Product {
							image
							title
							price
							headline
							description
							type
							buttonLink
						}
					}
				    zodiacBracelets {
						... on Product {
							image
							title
							price
							headline
							description
							type
							buttonLink
						}
					}

				}
			}
			content: pages(where: {name: "${slug}"}) {
				edges {
					node {
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


					}
				}
			}
		}
	`.replace(/\s\s+/g, ' ');

	console.log('Query', Query)

	return Query;
}
