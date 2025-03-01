import queryProducts from '../../query/products';

const convertProductsArrayToObject = (products) => {
    return products.reduce((acc, { node }) => {
        acc[node.id] = {
            title: node.title,
            image: node.image,
            price: node.price,
            headline: node.headline
        };
        return acc;
    }, {});
};

const sanitizeCart = (cart, products) => {
    return cart.map(item => {
        const correctProduct = products[item.id];

        if (correctProduct) {
            return {
                ...item,         // Preserve cart-specific properties (e.g., quantity, customizations)
                ...correctProduct // Override with validated product details (title, price, image, etc.)
            };
        }

        return null; // Optional: Remove items not found in the product list
    }).filter(Boolean); // Remove null values (if any products are missing)
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { cart } = req.body;

            // Fetch products from GraphQL
            const response = await fetch(process.env.GRAPHQL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: queryProducts() }),
            });

            const data = await response.json();
            const edges = data?.data?.products?.edges || [];
            const products = convertProductsArrayToObject(edges);
            const updatedCart = sanitizeCart(cart, products);

            // console.log("sanitizeCart", updatedCart)
            // console.log("cart", cart)
            // console.log("formattedProducts", products)

            return res.status(200).json(updatedCart);
        } catch (error) {
            console.error("API Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
