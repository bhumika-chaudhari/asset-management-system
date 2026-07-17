"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import { getAssets } from "@/services/assetService";
import AddAssetModal from "./components/AddAssetModal";
export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    limit: 5,
  });
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    fetchAssets();
  }, [page]);

  async function fetchAssets() {
    try {
      setLoading(true);

      const res = await getAssets({
        page,
        limit: 5,
        search,
      });

      setAssets(res.data);

      setPagination({
        total: res.total,
        totalPages: res.totalPages,
        limit: res.limit,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
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
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Asset Registry
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Manage, track, and assign company hardware and software
          </p>
        </div>

        <button
  onClick={() => setShowAddModal(true)}
  className="group rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all duration-300 hover:from-indigo-500 hover:to-cyan-500"
  
  /* THIS FORCES THE PADDING REGARDLESS OF TAILWIND */
  style={{ 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: "0.75rem 1.25rem",  
    gap: "0.5rem"                
  }}
>
  <Plus size={18} />
  <span>Add Asset</span>
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
          <Search
            className="text-slate-500"
            size={18}
            style={{ flexShrink: 0 }}
          />
          <input
            type="text"
            placeholder="Search assets by name, category, or serial number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                fetchAssets();
              }
            }}
            className="bg-transparent text-sm font-medium text-white placeholder-slate-500 outline-none"
            style={{ width: "100%" }}
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
                <th style={{ padding: "1.25rem 1.5rem" }}>Asset Name</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Category</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Serial Number</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Status</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Location</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: "4rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        className="animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"
                        style={{ height: "2.5rem", width: "2.5rem" }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-slate-500"
                    style={{ padding: "4rem" }}
                  >
                    No assets found matching your criteria.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td
                      className="font-medium text-white"
                      style={{ padding: "1.25rem 1.5rem" }}
                    >
                      {asset.asset_name}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {asset.category}
                    </td>
                    <td
                      className="font-mono text-xs text-slate-400"
                      style={{ padding: "1.25rem 1.5rem" }}
                    >
                      {asset.serial_number}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span
                        className={`font-medium ring-1 ring-inset ${
                          asset.status === "Available"
                            ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                            : asset.status === "Assigned"
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
                        {asset.status}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {asset.location}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: "1rem",
        }}
      >
        <p className="text-sm font-medium text-slate-400">
          Total Assets: <span className="text-white">{pagination.total}</span>
        </p>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-white/10 bg-slate-900/50 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ padding: "0.625rem 1.25rem" }}
          >
            Previous
          </button>

          <button
            disabled={
              page === pagination.totalPages || pagination.totalPages === 0
            }
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-white/10 bg-slate-900/50 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ padding: "0.625rem 1.25rem" }}
          >
            Next
          </button>
        </div>
      </div>
      {showAddModal && (
        <AddAssetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchAssets();
          }}
        />
      )}
    </div>
  );
}
