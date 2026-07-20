"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Search, PackageSearch } from "lucide-react";
import toast from "react-hot-toast";
import { getAssets } from "@/services/assetService";

export default function AssetPickerModal({
  open,
  onClose,
  onSelect,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      fetchAssets();
    }
  }, [open]);

  async function fetchAssets() {
    try {
      setLoading(true);

      // Fetch ONLY available assets
      const res = await getAssets({
        page: 1,
        limit: 1000,
        status: "Available",
      });

      setAssets(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  }

  const filteredAssets = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return assets.filter((asset) => {
      // Extra safety
      if (asset.status !== "Available") return false;

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
          width: "100%",
          maxWidth: "900px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="border-b border-white/10"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem 2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <PackageSearch
                size={22}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Select Asset
              </h2>

              <p className="text-sm text-slate-400">
                Only available assets are displayed.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "24px" }}>
          <div
            className="rounded-xl border border-white/10 bg-slate-900/50"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              gap: "10px",
            }}
          >
            <Search
              size={18}
              className="text-slate-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search asset..."
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            maxHeight: "450px",
            overflowY: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead className="sticky top-0 bg-[#0A101D]">
              <tr className="border-y border-white/10 text-left text-xs uppercase tracking-wider text-slate-400">
                <th style={{ padding: "18px 24px" }}>Asset</th>
                <th style={{ padding: "18px 24px" }}>Category</th>
                <th style={{ padding: "18px 24px" }}>Serial</th>
                <th style={{ padding: "18px 24px" }}>Status</th>
                <th style={{ padding: "18px 24px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ padding: "60px" }}
                  >
                    <div className="flex justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAssets.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-slate-500"
                    style={{ padding: "60px" }}
                  >
                    No available assets found.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td style={{ padding: "18px 24px" }}>
                      <div className="font-medium text-white">
                        {asset.asset_name}
                      </div>

                      <div className="text-xs text-slate-500">
                        {asset.location}
                      </div>
                    </td>

                    <td
                      style={{ padding: "18px 24px" }}
                      className="text-slate-300"
                    >
                      {asset.category}
                    </td>

                    <td
                      style={{ padding: "18px 24px" }}
                      className="font-mono text-xs text-slate-400"
                    >
                      {asset.serial_number}
                    </td>

                    <td style={{ padding: "18px 24px" }}>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        {asset.status}
                      </span>
                    </td>

                    <td style={{ padding: "18px 24px" }}>
                      <button
                        onClick={() => {
                          onSelect(asset);
                          onClose();
                        }}
                        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
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