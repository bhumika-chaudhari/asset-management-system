"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, RotateCcw, AlertCircle } from "lucide-react";

import {
  getAllocations,
  returnAsset,
} from "@/services/allocationService";

import AllocationModal from "./components/AllocationModal";

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // State for Custom Return Modal
  const [allocationToReturn, setAllocationToReturn] = useState(null);

  useEffect(() => {
    fetchAllocations();
  }, []);

  async function fetchAllocations() {
    try {
      setLoading(true);
      const res = await getAllocations();
      setAllocations(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load allocations");
    } finally {
      setLoading(false);
    }
  }

  // Handle Return (Called from inside the custom confirmation modal)
  async function confirmReturn() {
    if (!allocationToReturn) return;

    try {
      await returnAsset(allocationToReturn.id);
      toast.success("Asset returned successfully");
      
      setAllocationToReturn(null); // Close modal
      fetchAllocations();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to return asset"
      );
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
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Asset Allocations
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Allocate assets to employees and manage returns
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
          <span>Allocate Asset</span>
        </button>
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
                <th style={{ padding: "1.25rem 1.5rem" }}>Employee</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Department</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Assigned</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Returned</th>
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
                      <div
                        className="animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"
                        style={{ height: "2.5rem", width: "2.5rem" }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ) : allocations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-slate-500" style={{ padding: "4rem" }}>
                    No allocations found.
                  </td>
                </tr>
              ) : (
                allocations.map((allocation) => (
                  <tr
                    key={allocation.id}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td className="font-medium text-white" style={{ padding: "1.25rem 1.5rem" }}>
                      {allocation.asset_name}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {allocation.employee_name}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span className="inline-flex items-center  px-2.5 py-0.5 text-xs font-medium text-slate-300 ">
                        {allocation.department}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {new Date(allocation.assigned_date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {allocation.return_date
                        ? new Date(allocation.return_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span
                        className={`font-medium ring-1 ring-inset ${
                          allocation.status === "Assigned"
                            ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20"
                            : "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                        }`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "9999px",
                          padding: "0.125rem 0.625rem",
                          fontSize: "0.75rem",
                        }}
                      >
                        {allocation.status}
                      </span>
                    </td>
                    
                    {/* Action Cell */}
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {allocation.status === "Assigned" ? (
                        <button
                          onClick={() => setAllocationToReturn(allocation)}
                          className="rounded-lg bg-orange-500/10 text-orange-400 transition-colors hover:bg-orange-500/30 ring-1 ring-inset ring-orange-500/20"
                          style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: "600" }}
                        >
                          <RotateCcw size={14} />
                          Return
                        </button>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
      {showModal && (
        <AllocationModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchAllocations();
          }}
        />
      )}

      {/* Custom Return Confirmation Modal */}
      {allocationToReturn && (
        <div
          className="bg-black/60 backdrop-blur-sm"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 60,
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
              maxWidth: "24rem",
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem" }}>
              <div 
                className="rounded-full bg-orange-500/10 ring-1 ring-orange-500/20" 
                style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "4rem", width: "4rem" }}
              >
                <AlertCircle className="text-orange-500" size={32} />
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <h2 className="text-xl font-bold text-white">Return Asset</h2>
                <p className="text-sm text-slate-400" style={{ lineHeight: "1.5" }}>
                  Are you sure you want to return <span className="font-bold text-white">{allocationToReturn.asset_name}</span> from <span className="font-bold text-white">{allocationToReturn.employee_name}</span>?
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", width: "100%" }}>
              <button
                onClick={() => setAllocationToReturn(null)}
                className="rounded-xl border border-white/10 bg-slate-900/50 font-medium text-white transition-colors hover:bg-slate-800"
                style={{ flex: 1, padding: "0.75rem" }}
              >
                Cancel
              </button>
              
              <button
                onClick={confirmReturn}
                className="rounded-xl bg-orange-600 font-bold text-white shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-all hover:bg-orange-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.5)]"
                style={{ flex: 1, padding: "0.75rem" }}
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}