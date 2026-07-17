"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, UserPlus, UserPen } from "lucide-react";
import {
  createEmployee,
  updateEmployee,
} from "@/services/employeeService";

export default function EmployeeModal({
  employee,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employee_code: "",
    name: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        employee_code: employee.employee_code || "",
        name: employee.name || "",
        department: employee.department || "",
        designation: employee.designation || "",
        email: employee.email || "",
        phone: employee.phone || "",
      });
    }
  }, [employee]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (employee) {
        await updateEmployee(employee.id, formData);
        toast.success("Employee updated successfully");
      } else {
        await createEmployee(formData);
        toast.success("Employee added successfully");
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
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
              {employee ? (
                <UserPen className="text-cyan-400" size={20} />
              ) : (
                <UserPlus className="text-cyan-400" size={20} />
              )}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {employee ? "Edit Employee" : "Add New Employee"}
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
            <label className="text-sm font-medium text-slate-300">Employee Code</label>
            <input
              name="employee_code"
              placeholder="e.g., EMP-001"
              value={formData.employee_code}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <input
              name="name"
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Department</label>
            <input
              name="department"
              placeholder="e.g., Engineering, HR"
              value={formData.department}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Designation</label>
            <input
              name="designation"
              placeholder="e.g., Senior Developer"
              value={formData.designation}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g., john@company.com"
              value={formData.email}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.875rem 1rem", width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label className="text-sm font-medium text-slate-300">Phone Number</label>
            <input
              name="phone"
              placeholder="e.g., +1 234 567 890"
              value={formData.phone}
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
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(8,112,184,0.5)] disabled:opacity-50"
              style={{ padding: "0.75rem 2rem", minWidth: "140px" }}
            >
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <div className="animate-spin rounded-full border-2 border-white/30 border-t-white" style={{ height: "1rem", width: "1rem" }}></div>
                  Saving...
                </div>
              ) : employee ? (
                "Update Employee"
              ) : (
                "Save Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}