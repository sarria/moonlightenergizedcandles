import { Console } from "console";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { cart, addressParts, token } = req.body;

        if (!cart || cart.length === 0 || !addressParts) {
            return res.status(400).json({ error: 'Missing required data' });
        }

        const ENV = process.env.ENV.toUpperCase()
        const locationId = process.env['SQUARE_LOCATION_ID_' + ENV]
        const squareAccessToken = process.env['SQUARE_ACCESS_TOKEN_' + ENV]
        const idempotencyKey = crypto.randomUUID()

        // console.log("locationId", 'SQUARE_LOCATION_ID_' + ENV, ENV, locationId)
        console.log("submitPayment cart, addressParts ::", cart, addressParts)

        const requestBody = {
            "sourceId": token,
            "idempotency_key": idempotencyKey,
            "autocomplete": true,
            "amount_money": {
              "amount": 100,
              "currency": "USD"
            },
            "buyer_email_address": "jaunsarria@gmail.com",
            "location_id": locationId,
            "shipping_address": {
              "address_line_1": "255 Park Ridge Dr",
              "administrative_district_level_1": "PA",
              "first_name": "Juan",
              "last_name": "Sarria",
              "locality": "Easton",
              "postal_code": "18040"
            },
            "source_id": "cnon:card-nonce-ok"
        }

        console.log("requestBody", requestBody)

        const response = await fetch('https://connect.squareupsandbox.com/v2/payments', {
            method: 'POST',
            headers: {
                'Square-Version': '2025-02-20',
                'Authorization': `Bearer ${squareAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        console.log("Payment Result", data)

        if (response.ok && !data.errors) {
            return res.status(200).json(data);
        } else {
            return res.status(400).json({ error: data.errors[0].detail, details: data });
        }
    } catch (error) {
        console.error('Error in submitting payment API:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
