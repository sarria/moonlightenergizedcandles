import queryContent from '../../query/sitemap';

export default async function handler(req, res) {
    try {
        const query = await fetch(process.env.GRAPHQL + queryContent());
        const response = await query.json();

        if (!response) {
            return res.status(500).send("Failed to fetch data");
        }

        // Define site URL
        const siteUrl = "https://www.moonlightenergizedcandles.com";

        // Define slugs to exclude
        const excludedSlugs = ["calc", "checkout", "thank-you"];

        const ALL = [...response.data.pages.edges, ...response.data.products.edges]

        const urls = ALL
            .map((page) => ({
                slug: page.node.slug,
                url: `${siteUrl}/${page.node.slug}`,
                lastmod: page.node.modified.substring(0, 10), //new Date(page.node.modified).toISOString().split("Z")[0] + "+00:00", // Formats correctly
                priority: page.node.slug === "home-page" ? "1.0" : "0.8"
            }))
            .filter(page => !excludedSlugs.includes(page.slug));        

        // Generate XML Sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urls
                .map(({ url, lastmod, priority }) => `
                <url>
                    <loc>${url}</loc>
                    <lastmod>${lastmod}</lastmod>
                    <priority>${priority}</priority>
                </url>
            `)
            .join("")}
        </urlset>`;

        // Set headers and return XML
        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(sitemap);
        
    } catch (error) {
        console.error('Error processing sitemap:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
