export default function query() {

	return `
	query getPages {
		pages {
		  edges {
			node {
			  pageId
			  slug
			  title
			}
		  }
		}
	  }
	`.replace(/\s\s+/g, ' ');
}
