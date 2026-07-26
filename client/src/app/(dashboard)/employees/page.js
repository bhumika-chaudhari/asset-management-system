"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, AlertTriangle } from "lucide-react";

import {
  getEmployees,
  deleteEmployee,
} from "@/services/employeeService";

import EmployeeModal from "./components/EmployeeModal";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    limit: 5,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // State for Custom Delete Modal
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  async function fetchEmployees() {
    try {
      setLoading(true);

      const res = await getEmployees({
        page,
        limit: 5,
        search,
      });

      setEmployees(res.data);

      setPagination({
        total: res.total,
        totalPages: res.totalPages,
        limit: res.limit,
      });

    } catch (error) {
      console.error(error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  // Handle Delete (Called from inside the custom confirmation modal)
  async function confirmDelete() {
    if (!employeeToDelete) return;

    try {
      await deleteEmployee(employeeToDelete.id);
      toast.success("Employee deleted successfully");
      
      setEmployeeToDelete(null); // Close modal
      
      // Navigate to previous page if last item on current page is deleted
      if (employees.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchEmployees();
      }

    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to delete employee"
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
            Employee Directory
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Manage company personnel and contact information.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedEmployee(null);
            setShowModal(true);
          }}
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
          <span>Add Employee</span>
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
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "0.875rem 1.25rem",
            gap: "0.75rem",
          }}
        >
          <Search className="text-slate-500" size={18} style={{ flexShrink: 0 }} />
          <input
            placeholder="Search employee by name, code, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                fetchEmployees();
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
                <th style={{ padding: "1.25rem 1.5rem" }}>Code</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Name</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Department</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Designation</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Email</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Phone</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-sm text-slate-300">
              {loading ? (
                // Premium Skeleton Loader Rows
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-20 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-32 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-6 w-24 rounded-full bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-28 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-40 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-24 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <div className="h-8 w-16 rounded-lg bg-slate-800/50 animate-pulse"></div>
                        <div className="h-8 w-20 rounded-lg bg-slate-800/50 animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-slate-500" style={{ padding: "4rem" }}>
                    No employees found matching your criteria.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td className="font-mono text-xs text-cyan-400" style={{ padding: "1.25rem 1.5rem" }}>
                      {employee.employee_code}
                    </td>
                    <td className="font-medium text-white" style={{ padding: "1.25rem 1.5rem" }}>
                      {employee.name}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                        {employee.department}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>{employee.designation}</td>
                    <td className="text-slate-400" style={{ padding: "1.25rem 1.5rem" }}>{employee.email}</td>
                    <td className="font-mono text-xs text-slate-400" style={{ padding: "1.25rem 1.5rem" }}>{employee.phone}</td>
                    
                    {/* Actions Cell */}
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowModal(true);
                          }}
                          className="rounded-lg bg-cyan-600/10 text-cyan-400 transition-colors hover:bg-cyan-600/30 ring-1 ring-inset ring-cyan-500/20"
                          style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: "600" }}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => setEmployeeToDelete(employee)}
                          className="rounded-lg bg-red-600/10 text-red-400 transition-colors hover:bg-red-600/30 ring-1 ring-inset ring-red-500/20"
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
          Total Employees: <span className="font-bold text-white">{pagination.total}</span>
        </p>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded-xl border border-white/10 bg-slate-900/50 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ padding: "0.625rem 1.25rem" }}
          >
            Previous
          </button>

          <button
            disabled={page === pagination.totalPages || pagination.totalPages === 0}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-xl border border-white/10 bg-slate-900/50 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ padding: "0.625rem 1.25rem" }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchEmployees();
          }}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      {employeeToDelete && (
        <div
          className="bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
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
            className="animate-scale-up rounded-[2rem] border border-white/10 bg-[#0A101D]/95 shadow-2xl backdrop-blur-xl"
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
                <h2 className="text-xl font-extrabold text-white">Delete Employee</h2>
                <p className="text-sm font-medium text-slate-400" style={{ lineHeight: "1.5" }}>
                  Are you sure you want to delete <span className="font-bold text-white">{employeeToDelete.name}</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", width: "100%" }}>
              <button
                onClick={() => setEmployeeToDelete(null)}
                className="rounded-xl border border-white/10 bg-slate-900/50 font-semibold text-white transition-colors hover:bg-slate-800"
                style={{ flex: 1, padding: "0.875rem" }}
              >
                Cancel
              </button>
              
              <button
                onClick={confirmDelete}
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