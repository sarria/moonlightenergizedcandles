export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end(); 
    }

    const ENV = process.env.ENV

    res.status(200).json({
        applicationId: process.env['SQUARE_APPLICATION_ID_' + ENV.toUpperCase()],
        environment: ENV
    });
}
