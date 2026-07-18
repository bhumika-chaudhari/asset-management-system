"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, CheckCircle2, Wrench } from "lucide-react";

import {
  getMaintenance,
  completeMaintenance,
} from "@/services/maintenanceService";

import MaintenanceModal from "./components/MaintenanceModal";

export default function MaintenancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  async function fetchMaintenance() {
    try {
      setLoading(true);

      const res = await getMaintenance();

      setRecords(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load maintenance records");
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(id) {
    try {
      await completeMaintenance(id);
      toast.success("Maintenance completed");
      fetchMaintenance();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to complete maintenance"
      );
    }
  }

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const value = search.toLowerCase();

      return (
        item.asset_name?.toLowerCase().includes(value) ||
        item.serial_number?.toLowerCase().includes(value) ||
        item.status?.toLowerCase().includes(value)
      );
    });
  }, [records, search]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        width: "100%",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Maintenance
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Track maintenance records and complete repairs
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="group rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all duration-300 hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(8,112,184,0.5)]"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.75rem 1.25rem",
            gap: "0.5rem",
          }}
        >
          <Plus size={18} />
          <span>Add Maintenance</span>
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ display: "flex", width: "100%" }}>
        <div
          className="rounded-2xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl transition-all focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "0.875rem 1.25rem",
            gap: "0.75rem",
          }}
        >
          <Search size={18} className="text-slate-500" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search asset, serial number or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Table Container */}
      <div
        className="rounded-2xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            
            {/* Table Header */}
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                <th style={{ padding: "1.25rem 1.5rem" }}>Asset</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Serial No.</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Date</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Description</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Cost</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Status</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: "4rem" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                      <div className="animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" style={{ height: "2.5rem", width: "2.5rem" }}></div>
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-slate-500" style={{ padding: "4rem" }}>
                    No maintenance records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td style={{ padding: "1.25rem 1.5rem" }} className="font-medium text-white">
                      {record.asset_name}
                    </td>
                    
                    <td style={{ padding: "1.25rem 1.5rem" }} className="font-mono text-xs">
                      {record.serial_number}
                    </td>
                    
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {new Date(record.maintenance_date).toLocaleDateString()}
                    </td>
                    
                    <td style={{ padding: "1.25rem 1.5rem", maxWidth: "250px" }}>
                      <span className="truncate block text-slate-300">
                        {record.description || "Routine Maintenance"}
                      </span>
                    </td>
                    
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span className="font-mono text-emerald-400">
                        ₹{Number(record.cost || 0).toFixed(2)}
                      </span>
                    </td>
                    
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span
                        className={`font-medium ring-1 ring-inset ${
                          record.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                            : record.status === "In Progress"
                            ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20"
                            : "bg-orange-500/10 text-orange-400 ring-orange-500/20"
                        }`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "9999px",
                          padding: "0.125rem 0.625rem",
                          fontSize: "0.75rem",
                        }}
                      >
                        {record.status || "Pending"}
                      </span>
                    </td>
                    
                    {/* Action Cell */}
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {record.status !== "Completed" ? (
                        <button
                          onClick={() => handleComplete(record.id)}
                          className="rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors hover:bg-emerald-500/30 ring-1 ring-inset ring-emerald-500/20"
                          style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: "600" }}
                        >
                          <CheckCircle2 size={14} />
                          Complete
                        </button>
                      ) : (
                        <span className="text-slate-500" style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: "500" }}>
                          <Wrench size={14} />
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Modal */}
      {showModal && (
        <MaintenanceModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchMaintenance();
          }}
        />
      )}
    </div>
  );
}