const crypto = require("crypto");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const signingSecret = process.env.PAYMENT_SIGNING_SECRET;

    if (!secretKey || !signingSecret) {
      return res.status(500).json({
        message: "Payment environment variables are missing"
      });
    }

    const { email, amount } = req.body || {};
    const amountMinor = Math.round(Number(amount) * 100);

    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !Number.isSafeInteger(amountMinor) ||
      amountMinor < 100
    ) {
      return res.status(400).json({
        message: "Valid email and amount are required"
      });
    }

    const reference = `FG-${Date.now()}-${crypto.randomBytes(5).toString("hex")}`;
    const expiresAt = Date.now() + 15 * 60 * 1000;

    const payload = Buffer.from(JSON.stringify({
      reference,
      amountMinor,
      expiresAt
    })).toString("base64url");

    const signature = crypto
      .createHmac("sha256", signingSecret)
      .update(payload)
      .digest("hex");

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          amount: amountMinor,
          currency: "KES",
          reference
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
      return res.status(400).json({
        message: result.message || "Could not initialize payment"
      });
    }

    return res.status(200).json({
      access_code: result.data.access_code,
      reference,
      proof: `${payload}.${signature}`
    });

  } catch (error) {
    console.error("Payment initialization error:", error);

    return res.status(500).json({
      message: "Payment initialization failed"
    });
  }
};