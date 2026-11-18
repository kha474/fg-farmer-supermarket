const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// YOUR DARAJA SANDBOX CREDENTIALS
const CONSUMER_KEY = 'eP6qYbPkTjbUevgRWrOwBlkjdcuuq7NZ7BAG1fCY3oEGCoKN';
const CONSUMER_SECRET = '6nO75E1QarNEUnAWgdzxi4nTZkivXgT4d5bjZKLNAa79aK1ja0SB1ySJsiHYsKta';
const BUSINESS_SHORT_CODE = '174379';
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';

// Function to get access token
const getToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const res = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
};

// STK Push Route
app.post('/stk-push', async (req, res) => {
  try {
    const token = await getToken();
    const date = new Date();
    
    // Generate Timestamp
    const timestamp = date.getFullYear() + 
      ("0" + (date.getMonth() + 1)).slice(-2) + 
      ("0" + date.getDate()).slice(-2) + 
      ("0" + date.getHours()).slice(-2) + 
      ("0" + date.getMinutes()).slice(-2) + 
      ("0" + date.getSeconds()).slice(-2);
      
    // Generate Password
    const password = Buffer.from(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`).toString('base64');

    // Format phone number (e.g., 0712345678 becomes 254712345678)
    let phone = req.body.phone;
    if (phone.startsWith('0')) {
      phone = '254' + phone.slice(1);
    } else if (phone.startsWith('+')) {
      phone = phone.slice(1);
    }

    const data = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: req.body.amount,
      PartyA: phone,
      PartyB: BUSINESS_SHORT_CODE,
      PhoneNumber: phone,
      // For sandbox testing, this URL just needs to be a valid format to initiate the push.
      CallBackURL: "https://webhook.site/12345678-1234-1234-1234-1234567890ab", 
      AccountReference: "FG Farmer",
      TransactionDesc: "Payment for goods"
    };

    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json(response.data);
  } catch (error) {
    console.log("Error details:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to initiate STK Push" });
  }
});

app.listen(5000, () => console.log('M-Pesa Backend running on port 5000'));