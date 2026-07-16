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
const employeeRoutes = require("./routes/employeeRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const allocationRoutes = require("./routes/allocationRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/assets", assetRoutes);

app.use("/api/employees", employeeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});