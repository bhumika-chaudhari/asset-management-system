"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, AlertTriangle, ShieldCheck, Shield } from "lucide-react";

import {
  getUsers,
  createUser,
  deleteUser,
} from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  
  // Create User Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee"
  });
  const [creating, setCreating] = useState(false);

  // State for Custom Delete Modal
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    // Security check on the frontend as well
    if (user && user.role !== "Admin") {
        toast.error("Access denied. Admins only.");
        router.push("/dashboard");
    } else if (user) {
        fetchUsers();
    }
  }, [user]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  // Handle Delete (Called from inside the custom confirmation modal)
  async function confirmDelete() {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      toast.success("User deleted successfully");
      
      setUserToDelete(null); // Close modal
      fetchUsers();

    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to delete user"
      );
    }
  }

  // Handle Create User
  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      setCreating(true);
      await createUser(formData);
      toast.success("User created successfully!");
      setShowModal(false);
      setFormData({ name: "", email: "", password: "", role: "Employee" });
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  if (user && user.role !== "Admin") {
      return null;
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="text-cyan-400" size={32} />
            System Users
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Manage system access, administrators, and employee accounts.
          </p>
        </div>

        <button
          onClick={() => {
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
          <span>Add User</span>
        </button>
      </div>

      {/* Table Container */}
      <div
        className="animate-fade-up rounded-[2rem] border border-white/5 bg-[#0A101D]/80 shadow-2xl backdrop-blur-xl"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflow: "hidden",
          animationDelay: "0.1s",
          animationFillMode: "both",
        }}
      >
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            
            {/* Table Header */}
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                <th style={{ padding: "1.25rem 1.5rem" }}>ID</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Name</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Email</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Role</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Created At</th>
                <th style={{ padding: "1.25rem 1.5rem" }}>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-sm text-slate-300">
              {loading ? (
                // Premium Skeleton Loader Rows
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-8 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-32 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-40 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-6 w-24 rounded-full bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}><div className="h-4 w-24 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div className="h-8 w-20 rounded-lg bg-slate-800/50 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-slate-500" style={{ padding: "4rem" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td className="font-mono text-xs text-slate-400" style={{ padding: "1.25rem 1.5rem" }}>
                      #{u.id}
                    </td>
                    <td className="font-medium text-white" style={{ padding: "1.25rem 1.5rem" }}>
                      {u.name}
                    </td>
                    <td className="text-slate-400" style={{ padding: "1.25rem 1.5rem" }}>{u.email}</td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {u.role === "Admin" ? (
                         <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400 ring-1 ring-inset ring-amber-500/20">
                            <Shield size={12} />
                            Admin
                         </span>
                      ) : (
                         <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400 ring-1 ring-inset ring-cyan-500/20">
                            Employee
                         </span>
                      )}
                    </td>
                    <td className="font-mono text-xs text-slate-400" style={{ padding: "1.25rem 1.5rem" }}>
                        {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    
                    {/* Actions Cell */}
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      {u.id !== user?.id && (
                        <button
                            onClick={() => setUserToDelete(u)}
                            className="rounded-lg bg-red-600/10 text-red-400 transition-colors hover:bg-red-600/30 ring-1 ring-inset ring-red-500/20"
                            style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: "600" }}
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
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
                maxWidth: "28rem",
                display: "flex",
                flexDirection: "column",
                padding: "2rem",
            }}
            >
                <div style={{ marginBottom: "1.5rem" }}>
                    <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                        <ShieldCheck className="text-cyan-400" size={24} />
                        Add New User
                    </h2>
                    <p className="text-sm font-medium text-slate-400 mt-1">
                        Create a secure access account.
                    </p>
                </div>

                <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label className="text-sm font-semibold text-slate-300">Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label className="text-sm font-semibold text-slate-300">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label className="text-sm font-semibold text-slate-300">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label className="text-sm font-semibold text-slate-300">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                        >
                            <option value="Employee">Employee (Standard Access)</option>
                            <option value="Admin">Admin (Full Control)</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="rounded-xl border border-white/10 bg-slate-900/50 font-semibold text-white transition-colors hover:bg-slate-800"
                            style={{ flex: 1, padding: "0.875rem" }}
                        >
                            Cancel
                        </button>
                        
                        <button
                            type="submit"
                            disabled={creating}
                            className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50"
                            style={{ flex: 1, padding: "0.875rem" }}
                        >
                            {creating ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {userToDelete && (
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
                <h2 className="text-xl font-extrabold text-white">Delete User</h2>
                <p className="text-sm font-medium text-slate-400" style={{ lineHeight: "1.5" }}>
                  Are you sure you want to revoke access for <span className="font-bold text-white">{userToDelete.name}</span>? They will no longer be able to log in.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", width: "100%" }}>
              <button
                onClick={() => setUserToDelete(null)}
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
