"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Search, Wrench } from "lucide-react";
import toast from "react-hot-toast";
import { getAssets } from "@/services/assetService";

export default function MaintenanceAssetPicker({ open, onClose, onSelect }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      fetchAssets();
    }
  }, [open]);

  async function fetchAssets() {
    try {
      setLoading(true);
      const res = await getAssets({
        page: 1,
        limit: 1000,
      });
      setAssets(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  }

  // Show every asset except assets already under maintenance
  const filteredAssets = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return assets.filter((asset) => {
      if (asset.status === "Maintenance") return false;

      return (
        asset.asset_name.toLowerCase().includes(keyword) ||
        asset.category.toLowerCase().includes(keyword) ||
        asset.serial_number.toLowerCase().includes(keyword) ||
        (asset.location || "").toLowerCase().includes(keyword)
      );
    });
  }, [assets, search]);

  if (!open) return null;

  return (
    <div
      className="bg-black/60 backdrop-blur-sm"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.5rem",
      }}
    >
      <div
        className="rounded-[2rem] border border-white/10 bg-[#0A101D]/95 shadow-2xl backdrop-blur-xl"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "85vh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="border-b border-white/5 bg-white/5"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem 2rem",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              className="rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 ring-1 ring-white/10"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Wrench className="text-orange-400" size={20} />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Select Asset for Maintenance
              </h2>
              <p className="text-sm font-medium text-slate-400">
                Choose an available or assigned asset.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            style={{ padding: "0.5rem" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "1.5rem 2rem", flexShrink: 0 }}>
          <div
            className="rounded-2xl border border-white/10 bg-slate-900/50 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.875rem 1.25rem",
            }}
          >
            <Search size={18} className="text-slate-500" style={{ flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, or serial..."
              className="w-full bg-transparent text-sm font-medium text-white placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowY: "auto", flex: 1, minHeight: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead className="sticky top-0 z-10 bg-[#0A101D]/95 backdrop-blur-md">
              <tr className="border-y border-white/10 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                <th style={{ padding: "1.25rem 1.5rem" }}>Asset</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Category</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Serial</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Status</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Action</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: "4rem" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                      <div className="animate-spin rounded-full border-4 border-orange-500 border-t-transparent" style={{ height: "2.5rem", width: "2.5rem" }}></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-slate-500"
                    style={{ padding: "4rem" }}
                  >
                    No assets available for maintenance.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div className="font-medium text-white" style={{ marginBottom: "0.25rem" }}>
                        {asset.asset_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {asset.location || "Unspecified Location"}
                      </div>
                    </td>

                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {asset.category}
                    </td>

                    <td className="font-mono text-xs text-slate-400" style={{ padding: "1.25rem 1.5rem" }}>
                      {asset.serial_number}
                    </td>

                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          asset.status === "Assigned"
                            ? "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>

                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <button
                        onClick={() => {
                          onSelect(asset);
                          onClose();
                        }}
                        className="rounded-xl bg-orange-600/10 font-semibold text-orange-400 transition-colors hover:bg-orange-600/20 ring-1 ring-inset ring-orange-500/20"
                        style={{
                          padding: "0.5rem 1.25rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        Select
                      </button>
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