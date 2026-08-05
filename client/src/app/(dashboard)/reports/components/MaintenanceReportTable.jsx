"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Download,
  Printer,
  Wrench,
  IndianRupee,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { getMaintenanceReport } from "@/services/reportService";

export default function MaintenanceReport() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
  try {
    setLoading(true);

    const res = await getMaintenanceReport();
    setRecords(res.data);

  } catch (error) {

    if (error.response?.status === 403) {
      toast.dismiss();
      toast.error("You are not authorized to view maintenance reports.");
      setRecords([]);
      return;
    }

    if (error.response?.status === 401) {
      toast.dismiss();
      toast.error("Session expired. Please login again.");
      setRecords([]);
      return;
    }

    console.error(error);

    toast.dismiss();
    toast.error(
      error.response?.data?.message ||
      "Failed to load maintenance report."
    );

    setRecords([]);

  } finally {
    setLoading(false);
  }
}

  const filtered = useMemo(() => {
    return records.filter((item) => {
      const keyword = search.toLowerCase();
      return (
        item.asset_name.toLowerCase().includes(keyword) ||
        item.serial_number.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      );
    });
  }, [records, search]);

  const totalCost = filtered.reduce(
    (sum, item) => sum + Number(item.cost),
    0
  );

  const pending = filtered.filter(
    (item) => item.status === "Pending"
  ).length;

  const completed = filtered.filter(
    (item) => item.status === "Completed"
  ).length;

  function exportCSV() {
    const headers = [
      "Asset",
      "Serial Number",
      "Maintenance Date",
      "Description",
      "Cost",
      "Status",
    ];

    const rows = filtered.map((item) => [
      item.asset_name,
      item.serial_number,
      item.maintenance_date?.split("T")[0],
      item.description,
      item.cost,
      item.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "maintenance-report.csv";
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
        <SummaryCard
          title="Maintenance Records"
          value={filtered.length}
          icon={Wrench}
          color="#3b82f6"
        />
        <SummaryCard
          title="Pending"
          value={pending}
          icon={Clock}
          color="#f59e0b"
        />
        <SummaryCard
          title="Completed"
          value={completed}
          icon={CheckCircle2}
          color="#22c55e"
        />
        <SummaryCard
          title="Total Cost"
          value={`₹${totalCost.toLocaleString()}`}
          icon={IndianRupee}
          color="#14b8a6"
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
        {/* Top Controls */}
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
              placeholder="Search maintenance..."
              className="bg-transparent text-sm font-medium text-white placeholder-slate-500 outline-none"
              style={{ width: "100%" }}
            />
          </div>

          {/* Export Buttons */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
            }}
          >
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

            <button
              onClick={() => window.print()}
              className="rounded-xl bg-indigo-600/10 text-indigo-400 font-semibold transition-colors hover:bg-indigo-600/20 ring-1 ring-inset ring-indigo-500/20"
              style={{
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead className="border-y border-white/10 bg-white/5">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                <th style={{ padding: "1.25rem 1.5rem" }}>Asset</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Serial Number</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Date</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Description</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Cost</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Status</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: "4rem" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                      <div className="animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" style={{ height: "2.5rem", width: "2.5rem" }}></div>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-slate-500"
                    style={{ padding: "4rem" }}
                  >
                    No maintenance records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td className="font-medium text-white" style={{ padding: "1.25rem 1.5rem" }}>
                      {item.asset_name}
                    </td>
                    <td className="font-mono text-xs text-slate-400" style={{ padding: "1.25rem 1.5rem" }}>
                      {item.serial_number}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {item.maintenance_date?.split("T")[0]}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem", maxWidth: "250px" }} className="truncate">
                      {item.description}
                    </td>
                    <td className="font-mono text-emerald-400" style={{ padding: "1.25rem 1.5rem" }}>
                      ₹{Number(item.cost).toLocaleString()}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          item.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                            : "bg-orange-500/10 text-orange-400 ring-orange-500/20"
                        }`}
                      >
                        {item.status}
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

function SummaryCard({ title, value, icon: Icon, color }) {
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