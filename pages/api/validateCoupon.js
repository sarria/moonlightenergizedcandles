import queryContent from '../../query/coupons';

export default async function handler(req, res) {
    try {
        const { couponCode } = req.body;

        if (!couponCode) {
          return res.status(400).json({ error: "Missing coupon" });
        }

        const query = await fetch(process.env.GRAPHQL + queryContent(couponCode));
        const response = await query.json();

        if (!response) {
            return res.status(500).send("Failed to fetch coupons");
        }

        res.status(200).json({ data: response });
        
    } catch (error) {
        console.error('Error getting coupons:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
