const db = require("../config/db");

const getDashboardStats = async () => {

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

    return {
        totalAssets: assetCount.totalAssets,
        availableAssets: availableCount.availableAssets,
        assignedAssets: assignedCount.assignedAssets,
        maintenanceAssets: maintenanceCount.maintenanceAssets,
        totalEmployees: employeeCount.totalEmployees,
        totalAllocations: allocationCount.totalAllocations,
        pendingMaintenance: pendingMaintenance.pendingMaintenance,
    };
};const getAssetStatusDistribution = async () => {
    const [rows] = await db.query(`
        SELECT
            status AS name,
            COUNT(*) AS value
        FROM assets
        GROUP BY status
    `);

    return rows;
};
const getAssetCategoryDistribution = async () => {

    const [rows] = await db.query(`
        SELECT
            category,
            COUNT(*) AS value
        FROM assets
        GROUP BY category
        ORDER BY value DESC
    `);

    return rows;

};
module.exports = {
    getDashboardStats,
    getAssetStatusDistribution,
    getAssetCategoryDistribution,
};