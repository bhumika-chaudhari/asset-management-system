"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { X, PackagePlus } from "lucide-react";
import { createAsset } from "@/services/assetService";

export default function AddAssetModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    asset_name: "",
    category: "",
    serial_number: "",
    purchase_date: "",
    status: "Available",
    asset_condition: "Good",
    location: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      await createAsset(form);
      toast.success("Asset added successfully");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add asset");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="bg-black/60 backdrop-blur-sm"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        className="rounded-[2rem] border border-white/10 bg-[#0A101D]/95 shadow-2xl backdrop-blur-xl"
        style={{
          width: "100%",
          maxWidth: "42rem",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="border-b border-white/5 bg-white/5"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem 2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 ring-1 ring-white/10"
              style={{
                display: "flex",
                height: "2.5rem",
                width: "2.5rem",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PackagePlus className="text-cyan-400" size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Add New Asset
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            style={{ padding: "0.5rem" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body - Grid Layout forced via inline style */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.25rem",
            padding: "2rem",
          }}
        >
          
          {/* Input Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Asset Name</label>
            <input
              name="asset_name"
              placeholder="e.g., MacBook Pro M3"
              value={form.asset_name}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Category</label>
            <input
              name="category"
              placeholder="e.g., Laptop, Monitor"
              value={form.category}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Serial Number</label>
            <input
              name="serial_number"
              placeholder="Enter unique serial"
              value={form.serial_number}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm font-mono text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Purchase Date</label>
            <input
              type="date"
              name="purchase_date"
              value={form.purchase_date}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50 [color-scheme:dark]"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Condition</label>
            <select
              name="asset_condition"
              value={form.asset_condition}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
            >
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
              <option value="Repair">Repair</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1" }}>
            <label className="text-sm font-medium text-slate-300">Location</label>
            <input
              name="location"
              placeholder="e.g., HQ Office, Remote, Server Room A"
              value={form.location}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          {/* Action Buttons */}
          <div
            className="border-t border-white/5"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              gridColumn: "1 / -1",
              paddingTop: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-slate-900/50 font-medium text-white transition-colors hover:bg-slate-800"
              style={{ padding: "0.75rem 1.5rem" }}
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(8,112,184,0.5)] disabled:opacity-50"
              style={{ padding: "0.75rem 2rem", minWidth: "140px" }}
            >
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <div className="animate-spin rounded-full border-2 border-white/30 border-t-white" style={{ height: "1rem", width: "1rem" }}></div>
                  Saving...
                </div>
              ) : (
                "Save Asset"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}