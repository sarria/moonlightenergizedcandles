export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    const { placeId } = req.body;
    if (!placeId) {
      return res.status(400).json({ error: "Missing placeId" });
    }
  
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const url = `https://places.googleapis.com/v1/places/${placeId}?key=${GOOGLE_API_KEY}`;

    console.log('details url', url)
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "addressComponents", // ✅ Required FieldMask
        },
      });
  
      const data = await response.json();
      // console.log("Place details response:", data);
  
      if (!data.addressComponents) {
        return res.status(400).json({ error: "No address details found for this place." });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Google Place details" });
    }
  }
  