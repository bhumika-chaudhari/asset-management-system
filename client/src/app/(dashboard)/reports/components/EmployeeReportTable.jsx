"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Download, Users, Briefcase, PackageCheck } from "lucide-react";

import { getEmployeeAssetReport } from "@/services/reportService";

export default function EmployeeReport() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
  try {
    setLoading(true);

    const res = await getEmployeeAssetReport();
    setEmployees(res.data);

  } catch (error) {
    if (error.response?.status === 403) {
      setEmployees([]);
      return;
    }

    if (error.response?.status === 401) {
      setEmployees([]);
      return;
    }

    console.error(error);
    setEmployees([]);
  } finally {
    setLoading(false);
  }
}
  const filtered = useMemo(() => {
    return employees.filter((employee) => {
      const keyword = search.toLowerCase();
      return (
        employee.employee_name.toLowerCase().includes(keyword) ||
        employee.employee_code.toLowerCase().includes(keyword) ||
        employee.department.toLowerCase().includes(keyword)
      );
    });
  }, [employees, search]);

  const totalEmployees = employees.length;

  const assignedEmployees = employees.filter(
    (employee) => Number(employee.total_assets) > 0
  ).length;

  const totalAssetsAssigned = employees.reduce(
    (sum, employee) => sum + Number(employee.total_assets),
    0
  );

  function exportCSV() {
    const headers = [
      "Employee Code",
      "Employee Name",
      "Department",
      "Assigned Assets",
    ];

    const rows = filtered.map((employee) => [
      employee.employee_code,
      employee.employee_name,
      employee.department,
      employee.total_assets,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "employee-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        width: "100%",
      }}
    >
      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <Card
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
          color="#3b82f6"
        />
        <Card
          title="Employees With Assets"
          value={assignedEmployees}
          icon={Briefcase}
          color="#22c55e"
        />
        <Card
          title="Assigned Assets"
          value={totalAssetsAssigned}
          icon={PackageCheck}
          color="#06b6d4"
        />
      </div>

      {/* Table Section */}
      <div
        className="rounded-2xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            padding: "1.5rem",
          }}
        >
          {/* Search */}
          <div
            className="rounded-2xl border border-white/10 bg-slate-900/50 transition-all focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1.25rem",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <Search size={18} className="text-slate-500" style={{ flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="bg-transparent text-sm font-medium text-white placeholder-slate-500 outline-none"
              style={{ width: "100%" }}
            />
          </div>

          {/* Export Button */}
          <button
            onClick={exportCSV}
            className="rounded-xl bg-cyan-600/10 text-cyan-400 font-semibold transition-colors hover:bg-cyan-600/20 ring-1 ring-inset ring-cyan-500/20"
            style={{
              padding: "0.75rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead className="border-y border-white/10 bg-white/5">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                <th style={{ padding: "1.25rem 1.5rem" }}>Employee Code</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Employee Name</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Department</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Assigned Assets</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ padding: "4rem" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                      <div className="animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" style={{ height: "2.5rem", width: "2.5rem" }}></div>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-slate-500"
                    style={{ padding: "4rem" }}
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                filtered.map((employee) => (
                  <tr
                    key={employee.employee_id || employee.employee_code}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td className="font-mono text-xs text-cyan-400" style={{ padding: "1.25rem 1.5rem" }}>
                      {employee.employee_code}
                    </td>
                    <td className="font-medium text-white" style={{ padding: "1.25rem 1.5rem" }}>
                      {employee.employee_name}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {employee.department}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-400 ring-1 ring-inset ring-cyan-500/20">
                        {employee.total_assets}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Updated Card Component
function Card({ title, value, icon: Icon, color }) {
  return (
    <div
      className="group rounded-3xl border border-white/10 bg-[#0A101D]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
      style={{ padding: "1.5rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: `${color}15`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: `1px solid ${color}30`,
          }}
        >
          <Icon size={24} color={color} />
        </div>
      </div>

      <h3 className="text-sm font-medium text-slate-400">
        {title}
      </h3>
      <div className="mt-1 text-3xl font-bold text-white">
        {value}
      </div>
    </div>
  );
}