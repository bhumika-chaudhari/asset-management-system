"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Printer, Download } from "lucide-react";

import { getAllocationReport } from "@/services/reportService";

export default function AllocationReport() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

async function loadReport() {
  try {
    setLoading(true);

    const res = await getAllocationReport();
    setAllocations(res.data);

  } catch (error) {

    const status = error.response?.status;

    if (status === 403) {
      toast.error("You are not authorized to view allocation reports.");
      setAllocations([]);
      return;
    }

    if (status === 401) {
      toast.error("Session expired. Please login again.");
      return;
    }

    toast.error(
  error.response?.data?.message ||
    "Failed to load dashboard report.",
  {
    id: "dashboard-error",
  }
);
  } finally {
    setLoading(false);
  }
}
  const filtered = useMemo(() => {
    return allocations.filter((item) => {
      const keyword = search.toLowerCase();
      return (
        item.asset_name.toLowerCase().includes(keyword) ||
        item.employee_name.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword) ||
        item.serial_number.toLowerCase().includes(keyword)
      );
    });
  }, [allocations, search]);

  function exportCSV() {
    const headers = [
      "Asset",
      "Serial",
      "Employee",
      "Department",
      "Assigned Date",
      "Return Date",
      "Status",
    ];

    const rows = filtered.map((item) => [
      item.asset_name,
      item.serial_number,
      item.employee_name,
      item.department,
      item.assigned_date?.split("T")[0],
      item.return_date ? item.return_date.split("T")[0] : "-",
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
    link.download = "allocation-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
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
            placeholder="Search allocations..."
            className="bg-transparent text-sm font-medium text-white placeholder-slate-500 outline-none"
            style={{ width: "100%" }}
          />
        </div>

        {/* Buttons */}
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

      {/* Table */}
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead className="border-y border-white/10 bg-white/5">
            <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-400">
              <th style={{ padding: "1.25rem 1.5rem" }}>Asset</th>
              <th style={{ padding: "1.25rem 1.5rem" }}>Serial</th>
              <th style={{ padding: "1.25rem 1.5rem" }}>Employee</th>
              <th style={{ padding: "1.25rem 1.5rem" }}>Department</th>
              <th style={{ padding: "1.25rem 1.5rem" }}>Assigned Date</th>
              <th style={{ padding: "1.25rem 1.5rem" }}>Return Date</th>
              <th style={{ padding: "1.25rem 1.5rem" }}>Status</th>
            </tr>
          </thead>

          <tbody className="text-sm text-slate-300">
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: "4rem" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <div className="animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" style={{ height: "2.5rem", width: "2.5rem" }}></div>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-slate-500"
                  style={{ padding: "4rem" }}
                >
                  No allocation records found.
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
                    {item.employee_name}
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    {item.department}
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    {item.assigned_date?.split("T")[0]}
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    {item.return_date ? item.return_date.split("T")[0] : "—"}
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        item.status === "Assigned"
                          ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20"
                          : "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
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
  );
}