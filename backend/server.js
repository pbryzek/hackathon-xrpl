require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const bondsRouter = require("./routes/bondsRouter"); // Import the router

// ✅ Mount the bonds router
app.use("/bonds", bondsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
