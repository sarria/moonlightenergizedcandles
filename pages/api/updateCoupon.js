import queryContent from '../../query/mutations/coupon';

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { couponCode } = req.body;

        if (!couponCode) {
            return res.status(400).json({ error: "Missing coupon" });
        }

        const response = await fetch(process.env.GRAPHQL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${process.env.GRAPHQL_AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                query: queryContent(couponCode),
            }),
        });

        const result = await response.json();

        console.log("updateCoupon.js", result);

        if (!result || result.errors) {
            return res.status(500).json({ error: result.errors || "Failed to update coupon" });
        }

        res.status(200).json({ data: result.data });

    } catch (error) {
        console.error("Error updating coupon:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
