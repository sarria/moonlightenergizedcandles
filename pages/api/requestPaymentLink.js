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

        const idempotencyKey = crypto.randomUUID();
        const locationId = process.env.SQUARE_LOCATION_ID;
        const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
        const squarePATaxId = process.env.SQUARE_PA_TAX_ID;

        const lineItems = cart.map(item => ({
            quantity: item.quantity.toString(),
            name: item.title,
            note: item.headline,
            base_price_money: {
                amount: Math.round(parseFloat(item.price) * 100), // Convert to cents
                currency: "USD"
            }
        }));

        const requestBody = {
            idempotency_key: idempotencyKey,
            checkout_options: {
                redirect_url: "https://www.moonlightenergizedcandles.com/thank-you",
                ask_for_shipping_address: false,
                enable_coupon: false
            },
            order: {
                location_id: locationId,
                line_items: lineItems,
                fulfillments: [
                    {
                        type: "SHIPMENT",
                        shipment_details: {
                            recipient: {
                                address: {
                                    address_line_1: shippingInformation.addressLine1,
                                    locality: shippingInformation.city,
                                    postal_code: shippingInformation.zipCode,
                                    country: "US"                                    
                                }
                            }
                        }
                    }
                ]
            }
        }

        if (shippingInformation.state === 'PA') {
            requestBody.order.taxes = [
                {
                  "catalog_object_id": squarePATaxId
                }
            ] 
        }

        console.log("requestBody", requestBody)

        const response = await fetch('https://connect.squareupsandbox.com/v2/online-checkout/payment-links', {
            method: 'POST',
            headers: {
                'Square-Version': '2025-02-20',
                'Authorization': `Bearer ${squareAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (response.ok && data.payment_link) {
            return res.status(200).json({ paymentLink: data.payment_link.url });
        } else {
            return res.status(400).json({ error: 'Failed to generate payment link', details: data });
        }
    } catch (error) {
        console.error('Error in requestPaymentLink API:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
