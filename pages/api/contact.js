export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const response = await fetch("http://cms.moonlightenergizedcandles.com/scripts/contact.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body), // Forward the request body
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json(data); // Pass success response
        } else {
            return res.status(400).json({ error: data.error || "Something went wrong" });
        }
    } catch (error) {
        console.error("Error forwarding request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
