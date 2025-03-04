import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { 
            token,
            cart,
            totals,
            customizations,
            shippingInformation            
        } = req.body;

        if (!cart || cart.length === 0 || !shippingInformation) {
            return res.status(400).json({ error: 'Missing required data' });
        }

        const ENV = process.env.ENV.toUpperCase();
        const locationId = process.env['SQUARE_LOCATION_ID_' + ENV];
        const squareAccessToken = process.env['SQUARE_ACCESS_TOKEN_' + ENV];
        const idempotencyKey = crypto.randomUUID();

        console.log("Processing order:", { cart, shippingInformation, totals, customizations });

        // ✅ Generate line items dynamically
        const lineItems = cart.map((item, index) => {
            const baseLineItem = {
                quantity: item.quantity.toString(),
                name: item.title,
                base_price_money: {
                    amount: Math.round(item.price * 100), // Convert to cents
                    currency: "USD"
                }
            };

            // ✅ If the item is a custom candle, attach its customization data
            if (item.type.includes("candle") && item.type.includes("custom") && customizations[item.id]) {
                baseLineItem.note = formatCustomization(customizations[item.id]);
            }

            return baseLineItem;
        });

        // ✅ Format custom candle details into a readable string
        function formatCustomization(customizationArray) {
            return customizationArray.map((customization, index) =>
                `Candle # ${index+1}: ` + Object.entries(customization)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")
            ).join(" | ");
        }

        // ✅ Build Square API order request body
        const requestBody = {
            "source_id": token,
            "idempotency_key": idempotencyKey,
            "order": {
                "location_id": locationId,
                "line_items": lineItems,
                "taxes": [
                    {
                        "name": "Sales Tax",
                        "percentage": (shippingInformation.state === "PA" ? "6.00" : "0.00"),
                        "scope": "ORDER"
                    }
                ]
            }
        };    

        console.log("Final Order Request:", JSON.stringify(requestBody, null, 2));

        // ✅ Submit request to Square API
        const response = await fetch('https://connect.squareupsandbox.com/v2/orders', {
            method: 'POST',
            headers: {
                'Square-Version': '2025-02-20',
                'Authorization': `Bearer ${squareAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        console.log("Payment Response:", data);

        if (response.ok && !data.errors) {
            return res.status(200).json(data);
        } else {
            return res.status(400).json({ error: data.errors?.[0]?.detail || "Payment failed", details: data });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
