export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { orderId, paymentId, shippingInformation, pickupInstructions, cart, totalOrderCosts, customizations, freeCandles } = req.body;

        if (!shippingInformation || !cart || cart.length === 0) {
            return res.status(400).json({ error: "Missing required data" });
        }

        // Construct order data for the email
        const orderData = {
            orderId,
            paymentId,
            shippingInformation,
            cart,
            totalOrderCosts,
            customizations,
            freeCandles,
            pickupInstructions,
            env: process.env.ENV
        };

        // console.log("sendReceipt", orderData)

        // Send order data to WordPress PHP script
        const wordpressEndpoint = "http://cms.moonlightenergizedcandles.com/scripts/" + (process.env.ENV == "production" ? "sendReceipt.php": "sendReceipt_sandbox.php")
        const response = await fetch(wordpressEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });

        const data = await response.text();

        if (response.ok) {
            return res.status(200).json({ message: "Email sent successfully", data });
        } else {
            return res.status(400).json({ error: "Failed to send email", response, orderData });
        }
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
