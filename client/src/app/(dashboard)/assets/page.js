"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, AlertTriangle, Trash2, Edit2 } from "lucide-react";
import { getAssets, getAssetById, deleteAsset } from "@/services/assetService";
import AssetModal from "./components/AssetModal";

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
  
  // States for editing
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // States for custom Delete Modal
  const [assetToDelete, setAssetToDelete] = useState(null);

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

  // Handle Edit
  async function handleEdit(id) {
    try {
      const res = await getAssetById(id);
      setSelectedAsset(res.data || res);
      setShowEditModal(true);
    } catch (error) {
      toast.error("Failed to load asset details");
    }
  }

 const handleDelete = async (id) => {
  try {
    await deleteAsset(id);

    alert("Asset deleted successfully");

    fetchAssets();

  } catch (error) {

    const status = error.response?.status;
    const message = error.response?.data?.message;

    switch (status) {

      case 400:
        alert(message);
        break;

      case 403:
        alert("Access Denied!\nOnly administrators can delete assets.");
        break;

      case 404:
        alert("Asset not found.");
        break;

      default:
        alert("Something went wrong.");
    }
  }
};

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
        className="animate-fade-up"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          width: "100%",
          animationDelay: "0s",
          animationFillMode: "both",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Asset Registry
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Manage, track, and assign company hardware and software.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="group rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all duration-300 hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_25px_rgba(8,112,184,0.5)]"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.875rem 1.5rem",
            gap: "0.5rem",
          }}
        >
          <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Search Bar */}
      <div 
        className="animate-fade-up"
        style={{ 
          display: "flex", 
          width: "100%",
          animationDelay: "0.1s",
          animationFillMode: "both", 
        }}
      >
        <div
          className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl transition-all focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "0.875rem 1.25rem",
            gap: "0.75rem",
          }}
        >
          <Search className="text-slate-500" size={18} style={{ flexShrink: 0 }} />
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
        className="animate-fade-up rounded-[2rem] border border-white/5 bg-[#0A101D]/80 shadow-2xl backdrop-blur-xl"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
          animationDelay: "0.2s",
          animationFillMode: "both",
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
                <th style={{ padding: "1.25rem 1.5rem" }}>Condition</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Location</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-sm text-slate-300">
              {loading ? (
                // Premium Skeleton Loader Rows
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-32 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-24 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-28 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-6 w-20 rounded-full bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-6 w-20 rounded-full bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-24 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <div className="h-8 w-16 rounded-lg bg-slate-800/50 animate-pulse"></div>
                        <div className="h-8 w-20 rounded-lg bg-slate-800/50 animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : assets.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
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
                    <td className="font-medium text-white" style={{ padding: "1.25rem 1.5rem" }}>
                      {asset.asset_name}
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
                          asset.status === "Available"
                            ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                            : asset.status === "Assigned"
                              ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20"
                              : "bg-orange-500/10 text-orange-400 ring-orange-500/20"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          asset.asset_condition === "Good"
                            ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                            : asset.asset_condition === "Damaged"
                              ? "bg-red-500/10 text-red-400 ring-red-500/20"
                              : "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
                        }`}
                      >
                        {asset.asset_condition}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {asset.location}
                    </td>

                    {/* Actions Cell */}
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <button
                          onClick={() => handleEdit(asset.id)}
                          className="rounded-lg bg-cyan-600/10 text-cyan-400 transition-colors hover:bg-cyan-600/20 ring-1 ring-inset ring-cyan-500/20"
                          style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: "600" }}
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() => setAssetToDelete(asset)}
                          className="rounded-lg bg-red-600/10 text-red-400 transition-colors hover:bg-red-600/20 ring-1 ring-inset ring-red-500/20"
                          style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: "600" }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
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
        className="animate-fade-up"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: "1rem",
          animationDelay: "0.3s",
          animationFillMode: "both",
        }}
      >
        <p className="text-sm font-medium text-slate-400">
          Total Assets: <span className="font-bold text-white">{pagination.total}</span>
        </p>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-white/10 bg-slate-900/50 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ padding: "0.625rem 1.25rem" }}
          >
            Previous
          </button>

          <button
            disabled={
              page === pagination.totalPages || pagination.totalPages === 0
            }
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-white/10 bg-slate-900/50 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ padding: "0.625rem 1.25rem" }}
          >
            Next
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showAddModal && (
        <AssetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchAssets();
          }}
        />
      )}

      {showEditModal && selectedAsset && (
        <AssetModal
          asset={selectedAsset}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchAssets();
          }}
        />
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {assetToDelete && (
        <div
          className="bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          style={{
            position: "fixed",
            top: 0, right: 0, bottom: 0, left: 0,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            className="animate-scale-up rounded-[2rem] border border-white/10 bg-[#0A101D]/95 shadow-2xl"
            style={{
              width: "100%",
              maxWidth: "24rem",
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem" }}>
              <div 
                className="rounded-full bg-red-500/10 ring-1 ring-red-500/20" 
                style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "4rem", width: "4rem" }}
              >
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <h2 className="text-xl font-extrabold text-white">Delete Asset</h2>
                <p className="text-sm font-medium text-slate-400" style={{ lineHeight: "1.5" }}>
                  Are you sure you want to delete <span className="font-bold text-white">{assetToDelete.asset_name}</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", width: "100%" }}>
              <button
                onClick={() => setAssetToDelete(null)}
                className="rounded-xl border border-white/10 bg-slate-900/50 font-semibold text-white transition-colors hover:bg-slate-800"
                style={{ flex: 1, padding: "0.875rem" }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-600 font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all hover:bg-red-500 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
                style={{ flex: 1, padding: "0.875rem" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Animations Keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up {
          animation: fadeUp 0.4s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}