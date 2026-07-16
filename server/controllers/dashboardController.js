const asyncHandler = require("../utils/asyncHandler");
const db = require("../config/db");

const getDashboardStats = asyncHandler(async (req, res) => {

    const [[assetCount]] = await db.query(
        "SELECT COUNT(*) AS totalAssets FROM assets"
    );

    const [[availableCount]] = await db.query(
        "SELECT COUNT(*) AS availableAssets FROM assets WHERE status='Available'"
    );

    const [[assignedCount]] = await db.query(
        "SELECT COUNT(*) AS assignedAssets FROM assets WHERE status='Assigned'"
    );

    const [[maintenanceCount]] = await db.query(
        "SELECT COUNT(*) AS maintenanceAssets FROM assets WHERE status='Maintenance'"
    );

    const [[employeeCount]] = await db.query(
        "SELECT COUNT(*) AS totalEmployees FROM employees"
    );

    const [[allocationCount]] = await db.query(
        "SELECT COUNT(*) AS totalAllocations FROM allocations"
    );

    const [[pendingMaintenance]] = await db.query(
        "SELECT COUNT(*) AS pendingMaintenance FROM maintenance WHERE status='Pending'"
    );

    res.status(200).json({
        success: true,
        data: {
            totalAssets: assetCount.totalAssets,
            availableAssets: availableCount.availableAssets,
            assignedAssets: assignedCount.assignedAssets,
            maintenanceAssets: maintenanceCount.maintenanceAssets,
            totalEmployees: employeeCount.totalEmployees,
            totalAllocations: allocationCount.totalAllocations,
            pendingMaintenance: pendingMaintenance.pendingMaintenance
        }
    });

});

module.exports = {
    getDashboardStats
};