export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end(); 
    }

    const ENV = process.env.ENV

    res.status(200).json({
        environment: ENV,
        applicationId: process.env['SQUARE_APPLICATION_ID_' + ENV.toUpperCase()],
        scriptUrl: process.env['SQUARE_SCRIPT_URL_' + ENV.toUpperCase()],
    });
}
