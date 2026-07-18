"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Search, UserSearch } from "lucide-react";
import toast from "react-hot-toast";
import { getEmployees } from "@/services/employeeService";

export default function EmployeePickerModal({ open, onClose, onSelect }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  async function fetchEmployees() {
    try {
      setLoading(true);

      const res = await getEmployees({
        page: 1,
        limit: 1000,
      });

      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const keyword = search.toLowerCase();

      return (
        employee.employee_code.toLowerCase().includes(keyword) ||
        employee.name.toLowerCase().includes(keyword) ||
        employee.department.toLowerCase().includes(keyword) ||
        employee.designation.toLowerCase().includes(keyword)
      );
    });
  }, [employees, search]);

  if (!open) return null;

  return (
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
          maxWidth: "56rem",
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
              <UserSearch className="text-cyan-400" size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Select Employee
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

        {/* Modal Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            gap: "1.5rem",
          }}
        >
          {/* Search Bar */}
          <div
            className="rounded-2xl border border-white/10 bg-slate-900/50 transition-all focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50"
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
              size={18}
              className="text-slate-500"
              style={{ flexShrink: 0 }}
            />
            <input
              type="text"
              placeholder="Search employee by name, code, department, or designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm font-medium text-white placeholder-slate-500 outline-none"
              style={{ width: "100%" }}
            />
          </div>

          {/* Table Container */}
          <div
            className="rounded-xl border border-white/5 bg-slate-900/30"
            style={{
              overflowY: "auto",
              maxHeight: "450px",
              width: "100%",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead className="sticky top-0 z-10 border-b border-white/10 bg-[#0A101D]/90 backdrop-blur-md">
                <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th style={{ padding: "1.25rem 1.5rem" }}>Code</th>
                  <th style={{ padding: "1.25rem 1.5rem" }}>Name</th>
                  <th style={{ padding: "1.25rem 1.5rem" }}>Department</th>
                  <th style={{ padding: "1.25rem 1.5rem" }}>Designation</th>
                  <th style={{ padding: "1.25rem 1.5rem" }}>Action</th>
                </tr>
              </thead>

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
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-slate-500"
                      style={{ padding: "4rem" }}
                    >
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                    >
                      <td
                        className="font-mono text-xs text-cyan-400"
                        style={{ padding: "1.25rem 1.5rem" }}
                      >
                        {employee.employee_code}
                      </td>
                      <td
                        className="font-medium text-white"
                        style={{ padding: "1.25rem 1.5rem" }}
                      >
                        {employee.name}
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10">
                          {employee.department}
                        </span>
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        {employee.designation}
                      </td>
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <button
                          onClick={() => {
                            onSelect(employee);
                            onClose();
                          }}
                          className="rounded-lg bg-cyan-600/10 text-cyan-400 font-medium transition-colors hover:bg-cyan-600/30 ring-1 ring-inset ring-cyan-500/20"
                          style={{
                            padding: "0.5rem 1rem",
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
    </div>
  );
}