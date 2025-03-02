export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { address, city, state, zip } = req.body;
  if (!address || !city || !state || !zip) {
    return res.status(400).json({ error: "Missing address fields" });
  }

  const USPS_USER_ID = process.env.USPS_USER_ID;
  const xmlRequest = `<AddressValidateRequest USERID="${USPS_USER_ID}">
    <Address>
      <Address1></Address1>
      <Address2>${address}</Address2>
      <City>${city}</City>
      <State>${state}</State>
      <Zip5>${zip}</Zip5>
      <Zip4></Zip4>
    </Address>
  </AddressValidateRequest>`;

  const url = `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=${encodeURIComponent(xmlRequest)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Check if USPS returned an error
    if (text.includes("<Error>")) {
      return res.status(400).json({ error: "USPS could not validate the address." });
    }

    res.status(200).json({ success: "Address validated successfully!", data: text });
  } catch (error) {
    res.status(500).json({ error: "USPS API request failed" });
  }
}
