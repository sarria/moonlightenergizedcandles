import axios from "axios";

function getRequestParams(email_address, FNAME='', LNAME='', PHONE='-', COMPANY='-', addr1='-', city='-', state='-', zip='-') {
  // get env variables
  const API_KEY = ''; //process.env.MAILCHIMP_API_KEY;
  const LIST_ID = ''; //process.env.MAILCHIMP_LIST_ID;
  // mailchimp datacenter - mailchimp api keys always look like this:
  // fe4f064432e4684878063s83121e4971-us6
  // We need the us6 part
  const DATACENTER = process.env.MAILCHIMP_API_KEY.split("-")[1];

  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  // Add aditional params here. See full list of available params:
  // https://mailchimp.com/developer/reference/lists/list-members/
  const data = {
    email_address,
    status: "subscribed",
    "merge_fields": {
      FNAME,
      LNAME,
      PHONE,
      COMPANY,
      "ADDRESS": {
        addr1,
        city,
        state,
        zip
      }
    }    
  };

  // Api key needs to be encoded in base 64 format
  const base64ApiKey = Buffer.from(`anystring:${API_KEY}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${base64ApiKey}`,
  };

  return {
    url,
    data,
    headers,
  };
}

const Newsletter = async (req, res) => {
  const { email_address, FNAME, LNAME, PHONE, COMPANY, addr1, city, state, zip } = req.body;

  if (!email_address || !email_address.length) {
    return res.status(400).json({
      error: "Forgot to add your email?",
    });
  }

  if (!FNAME || !FNAME.length || !LNAME || !LNAME.length) {
    return res.status(400).json({
      error: "Forgot to add your first and last name?",
    });
  }

  if (!COMPANY || !COMPANY.length) {
    return res.status(400).json({
      error: "Forgot to add your company?",
    });
  }
  
  if (addr1 || city || state || zip) {
    if (!addr1 || !city || !state || !zip) {
      return res.status(400).json({
        error: "If adding your address, please don't forget to enter all fields",
      });
    }
  }

  try {
    const { url, data, headers } = getRequestParams(email_address, FNAME, LNAME, PHONE, COMPANY, addr1, city, state, zip);

    const response = await axios.post(url, data, { headers });

    // Success
    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(400).json({
      error: `Ops!, something went wrong...`, // Send me an email at info@Moonlight Energized Candles.com and I'll add you to the list.`,
    });

    // Report error to Sentry or whatever
  }
};

export default Newsletter;
