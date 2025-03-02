export default function query(slug) {

	const Query = `
		query {
            products(first: 200) { 
                edges {
                    node {
						__typename
						id
						slug
						title
						image
						type
						price
						headline
                    }
                }
            }
        }
	`.replace(/\s\s+/g, ' ');

	console.log('Products Query', Query)

	return Query;
}
