const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

async function connectDB() {
    try {
        const connection = await db.getConnection();

        console.log("✅ MySQL Connected");

        connection.release();
    } catch (error) {
        console.error(error);
    }
}

connectDB();

app.get("/", (req, res) => {
    res.json({
        message: "Asset Management API Running"
    });
});

const assetRoutes = require("./routes/assetRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/assets", assetRoutes);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});