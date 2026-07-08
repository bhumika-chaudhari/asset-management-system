const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to database
require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

const assetRoutes = require("./routes/assetRoutes");

app.use("/api/assets", assetRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Asset Management API is running 🚀"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});