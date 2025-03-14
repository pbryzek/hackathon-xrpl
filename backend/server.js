require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { XummSdk } = require("xumm-sdk");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Xumm SDK
const xumm = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

app.use(express.json());
app.use(cors());

// Route to generate a Xumm payload (Sign-in request)
app.post("/create-signin", async (req, res) => {
  try {
    const payload = {
      txjson: { TransactionType: "SignIn" },
    };

    const xummPayload = await xumm.payload.create(payload);
    res.json({ uuid: xummPayload.uuid, next: xummPayload.next.always });
  } catch (error) {
    console.error("Error creating Xumm payload:", error);
    res.status(500).json({ error: "Failed to create payload" });
  }
});

// Webhook to handle Xumm callbacks
app.post("/webhook", async (req, res) => {
  console.log("Webhook received:", req.body);
  res.status(200).send("Received");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
