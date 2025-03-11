export default function sitemapQuery() {
    return `
      query {
        pages(first: 100) {
          edges {
            node {
              slug
              title
              modified
            }
          }
        }
        products(first: 100) {
          edges {
            node {
              slug
              title
              modified
            }
          }
        }
      }
    `.replace(/\s\s+/g, ' ');
  }
  