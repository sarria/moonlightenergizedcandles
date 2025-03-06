import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { 
            token,
            orderId,
            totalOrderCosts,
            shippingInformation            
        } = req.body;

        console.log("\nEntra createPayment\n")

        if (!token || !orderId || !totalOrderCosts || !shippingInformation) {
            return res.status(400).json({ error: 'Missing required data' });
        }

        const ENV = process.env.ENV.toUpperCase();
        const locationId = process.env['SQUARE_LOCATION_ID_' + ENV];
        const squareAccessToken = process.env['SQUARE_ACCESS_TOKEN_' + ENV];
        const idempotencyKey = crypto.randomUUID();

        console.log("\nProcessing payment:\n", { orderId, totalOrderCosts, shippingInformation });

        // ✅ Build Square API payment request body
        const requestBody = {
            "source_id": token,
            "idempotency_key": idempotencyKey,
            "amount_money": {
                "amount": Math.round(totalOrderCosts.charge * 100), // Convert to cents
                "currency": "USD"
            },
            "buyer_email_address": shippingInformation.email,
            "location_id": locationId,
            "shipping_address": {
                address_line_1: shippingInformation.addressLine1,
                administrative_district_level_1: shippingInformation.state,
                first_name: shippingInformation.firstName,
                last_name: shippingInformation.lastName,
                locality: shippingInformation.city,
                postal_code: shippingInformation.zipCode,
            },
            "order_id": orderId,
            "note": (shippingInformation.firstName + ' ' + shippingInformation.lastName + " - " + shippingInformation.selectedAddress).substring(0, 500)
        };

        if (ENV === 'sandbox') {
            requestBody.source_id = "cnon:card-nonce-ok"
        }

        console.log("\nFinal payment Request:\n", JSON.stringify(requestBody, null, 2));

        // ✅ Submit request to Square API
        const response = await fetch(squareAPI + 'payments', {
            method: 'POST',
            headers: {
                'Square-Version': '2025-02-20',
                'Authorization': `Bearer ${squareAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        console.log("\nPayment Response:\n", data);

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
