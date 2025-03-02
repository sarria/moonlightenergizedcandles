export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    const { inputText } = req.body;
    if (!inputText) {
      return res.status(400).json({ error: "Missing input field in request body" });
    }
  
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const url = `https://places.googleapis.com/v1/places:autocomplete?key=${GOOGLE_API_KEY}`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: inputText, // New API requires "input" inside JSON body
        }),
      });
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Google Places data" });
    }
  }
  