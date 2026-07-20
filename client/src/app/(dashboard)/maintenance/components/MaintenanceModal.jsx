"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { X, Wrench, Search } from "lucide-react";

import { addMaintenance } from "@/services/maintenanceService";
import MaintenanceAssetPicker from "./MaintenanceAssetPicker";

export default function MaintenanceModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    asset_id: "",
    maintenance_date: "",
    description: "",
    cost: "",
    status: "Pending",
  });

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.asset_id) {
      toast.error("Please select an asset");
      return;
    }

    try {
      setSaving(true);

      await addMaintenance({
        ...form,
        cost: Number(form.cost),
      });

      toast.success("Maintenance record created successfully");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to create record");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
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
            maxWidth: "32rem",
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
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
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
                <Wrench className="text-cyan-400" size={20} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Add Maintenance
                </h2>
              </div>
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

          {/* Form Body */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              padding: "2rem",
            }}
          >
            {/* Custom Asset Button Picker */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label className="text-sm font-medium text-slate-300">
                Select Asset
              </label>
              <button
                type="button"
                onClick={() => setShowAssetPicker(true)}
                className="rounded-xl border border-white/10 bg-slate-900/50 text-left transition-colors hover:border-cyan-500/50"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  {selectedAsset ? (
                    <>
                      <p className="font-semibold text-white">
                        {selectedAsset.asset_name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {selectedAsset.serial_number} • {selectedAsset.category}
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-500">
                      Click to search for an asset...
                    </p>
                  )}
                </div>
                <Search
                  size={18}
                  className="text-cyan-400"
                  style={{ flexShrink: 0 }}
                />
              </button>
            </div>

            {/* Maintenance Date */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label className="text-sm font-medium text-slate-300">
                Maintenance Date
              </label>
              <input
                type="date"
                name="maintenance_date"
                value={form.maintenance_date}
                onChange={handleChange}
                required
                className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50 [color-scheme:dark]"
                style={{
                  padding: "0.875rem 1rem",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Description */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label className="text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Describe the maintenance required..."
                className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
                style={{
                  padding: "0.875rem 1rem",
                  width: "100%",
                  boxSizing: "border-box",
                  resize: "none",
                }}
              />
            </div>

            {/* Cost */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label className="text-sm font-medium text-slate-300">
                Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                required
                placeholder="Enter estimated or actual cost"
                className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
                style={{
                  padding: "0.875rem 1rem",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Action Buttons */}
            <div
              className="border-t border-white/5"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
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
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(8,112,184,0.5)] disabled:opacity-50"
                style={{ padding: "0.75rem 2rem", minWidth: "160px" }}
              >
                {saving ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      className="animate-spin rounded-full border-2 border-white/30 border-t-white"
                      style={{ height: "1rem", width: "1rem" }}
                    ></div>
                    Saving...
                  </div>
                ) : (
                  "Add Maintenance"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MaintenanceAssetPicker
        open={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        onSelect={(asset) => {
          setSelectedAsset(asset);

          setForm((prev) => ({
            ...prev,
            asset_id: asset.id,
          }));
        }}
      />
    </>
  );
}
