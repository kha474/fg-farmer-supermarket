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

    const { reference, proof } = req.body || {};

    if (!reference || !proof) {
      return res.status(400).json({
        message: "Reference and payment proof are required"
      });
    }

    const parts = proof.split(".");

    if (parts.length !== 2) {
      return res.status(400).json({
        message: "Invalid payment proof"
      });
    }

    const [payload, suppliedSignature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", signingSecret)
      .update(payload)
      .digest("hex");

    const supplied = Buffer.from(suppliedSignature, "hex");
    const expected = Buffer.from(expectedSignature, "hex");

    if (
      supplied.length !== expected.length ||
      !crypto.timingSafeEqual(supplied, expected)
    ) {
      return res.status(400).json({
        message: "Payment proof is invalid"
      });
    }

    const payment = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (
      payment.reference !== reference ||
      !Number.isSafeInteger(payment.amountMinor) ||
      payment.expiresAt < Date.now()
    ) {
      return res.status(400).json({
        message: "Payment proof has expired or is invalid"
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
      return res.status(400).json({
        message: result.message || "Payment verification failed"
      });
    }

    const transaction = result.data;

    const verified =
      transaction.status === "success" &&
      transaction.reference === reference &&
      transaction.amount === payment.amountMinor &&
      transaction.currency === "KES";

    if (!verified) {
      return res.status(400).json({
        verified: false,
        message: "Payment was not successful or details do not match"
      });
    }

    return res.status(200).json({
      verified: true,
      reference: transaction.reference,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status
    });

  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      verified: false,
      message: "Could not verify payment"
    });
  }
};