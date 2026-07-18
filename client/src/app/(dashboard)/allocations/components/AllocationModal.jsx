"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { X, ClipboardList, Search } from "lucide-react";
import { allocateAsset } from "@/services/allocationService";
import AssetPickerModal from "./AssetPickerModal";
import EmployeePickerModal from "./EmployeePickerModal";

export default function AllocationModal({ onClose, onSuccess }) {
  // Step 2: New Form State with Picker states
  const [form, setForm] = useState({
    asset_id: "",
    employee_id: "",
    assigned_date: "",
  });

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Step 7: Update handleSubmit with Validation
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.asset_id) {
      toast.error("Please select an asset");
      return;
    }

    if (!form.employee_id) {
      toast.error("Please select an employee");
      return;
    }

    if (!form.assigned_date) {
      toast.error("Please select an assigned date");
      return;
    }

    try {
      setLoading(true);
      
      await allocateAsset(form);
      
      toast.success("Asset Allocated Successfully");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Allocation failed");
    } finally {
      setLoading(false);
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
                <ClipboardList className="text-cyan-400" size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Allocate Asset
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
            {/* Step 4: Custom Asset Button Picker */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label className="text-sm font-medium text-slate-300">Asset</label>
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
                  boxSizing: "border-box"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {selectedAsset ? (
                    <>
                      <p className="font-semibold text-white">
                        {selectedAsset.asset_name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {selectedAsset.serial_number}
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-500">Click to select an asset</p>
                  )}
                </div>
                <Search size={18} className="text-cyan-400" style={{ flexShrink: 0 }} />
              </button>
            </div>

            {/* Step 5: Custom Employee Button Picker */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label className="text-sm font-medium text-slate-300">Employee</label>
              <button
                type="button"
                onClick={() => setShowEmployeePicker(true)}
                className="rounded-xl border border-white/10 bg-slate-900/50 text-left transition-colors hover:border-cyan-500/50"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {selectedEmployee ? (
                    <>
                      <p className="font-semibold text-white">
                        {selectedEmployee.name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {selectedEmployee.department}
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-500">Click to select an employee</p>
                  )}
                </div>
                <Search size={18} className="text-cyan-400" style={{ flexShrink: 0 }} />
              </button>
            </div>

            {/* Assigned Date */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label className="text-sm font-medium text-slate-300">Assigned Date</label>
              <input
                type="date"
                name="assigned_date"
                value={form.assigned_date}
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50 [color-scheme:dark]"
                style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
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
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(8,112,184,0.5)] disabled:opacity-50"
                style={{ padding: "0.75rem 2rem", minWidth: "140px" }}
              >
                {loading ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <div className="animate-spin rounded-full border-2 border-white/30 border-t-white" style={{ height: "1rem", width: "1rem" }}></div>
                    Processing...
                  </div>
                ) : (
                  "Allocate Asset"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Step 6: Include Picker Modals Outside Main Container */}
      <AssetPickerModal
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

      <EmployeePickerModal
        open={showEmployeePicker}
        onClose={() => setShowEmployeePicker(false)}
        onSelect={(employee) => {
          setSelectedEmployee(employee);
          setForm((prev) => ({
            ...prev,
            employee_id: employee.id,
          }));
        }}
      />
    </>
  );
}