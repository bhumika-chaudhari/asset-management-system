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
    <div className="flex w-full max-w-7xl mx-auto flex-col gap-8 p-4 sm:p-6 lg:p-8">

      {/* Header Section */}
      <div
        className="animate-fade-up flex flex-wrap items-center justify-between gap-4 w-full"
        style={{ animationDelay: "0s", animationFillMode: "both" }}
      >
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="text-cyan-400" size={36} />
            System Users
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-400">
            Manage system access, administrators, and employee accounts.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3.5 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all duration-300 hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_25px_rgba(8,112,184,0.5)]"
        >
          <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
          <span>Add User</span>
        </button>
      </div>

      {/* Table Container */}
      <div
        className="animate-fade-up flex flex-col w-full overflow-hidden rounded-2xl border border-white/5 bg-[#0A101D]/80 shadow-2xl backdrop-blur-xl"
        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
      >
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse">

            {/* Table Header */}
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="whitespace-nowrap px-6 py-5">ID</th>
                <th className="whitespace-nowrap px-6 py-5">Name</th>
                <th className="whitespace-nowrap px-6 py-5">Email</th>
                <th className="whitespace-nowrap px-6 py-5">Role</th>
                <th className="whitespace-nowrap px-6 py-5">Created At</th>
                <th className="whitespace-nowrap px-6 py-5">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-sm text-slate-300">
              {loading ? (
                // Premium Skeleton Loader Rows
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-6 py-5"><div className="h-4 w-8 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td className="px-6 py-5"><div className="h-4 w-32 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td className="px-6 py-5"><div className="h-4 w-40 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td className="px-6 py-5"><div className="h-6 w-24 rounded-full bg-slate-800/50 animate-pulse"></div></td>
                    <td className="px-6 py-5"><div className="h-4 w-24 rounded bg-slate-800/50 animate-pulse"></div></td>
                    <td className="px-6 py-5"><div className="h-8 w-20 rounded-lg bg-slate-800/50 animate-pulse"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-slate-500 py-16">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldCheck size={48} className="text-slate-700 mb-2" />
                      <p className="text-lg font-medium text-slate-400">No users found</p>
                      <p className="text-sm text-slate-500">Get started by adding a new user to the system.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td className="whitespace-nowrap px-6 py-5 font-mono text-xs text-slate-400">
                      #{u.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 font-medium text-white">
                      {u.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-slate-400">
                      {u.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5">
                      {u.role === "Admin" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 ring-1 ring-inset ring-amber-500/20">
                          <Shield size={14} />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 ring-1 ring-inset ring-cyan-500/20">
                          Employee
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 font-mono text-xs text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions Cell */}
                    <td className="whitespace-nowrap px-6 py-5">
                      {u.id !== user?.id ? (
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-600/10 px-3 py-2 text-xs font-semibold text-red-400 ring-1 ring-inset ring-red-500/20 transition-colors hover:bg-red-600/30"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Current User</span>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex w-full max-w-md flex-col animate-scale-up rounded-3xl border border-white/10 bg-[#0A101D]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">

            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-2xl font-extrabold text-white">
                <ShieldCheck className="text-cyan-400" size={28} />
                Add New User
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-400">
                Create a secure access account for a new team member.
              </p>
            </div>

            <form onSubmit={handleCreateUser} className="flex flex-col gap-5">

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-300">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border border-white/10 bg-slate-900/50 p-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-300">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl border border-white/10 bg-slate-900/50 p-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-300">Password</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="rounded-xl border border-white/10 bg-slate-900/50 p-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-300">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="rounded-xl border border-white/10 bg-slate-900/80 p-3.5 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                >
                  <option value="Employee">Employee (Standard Access)</option>
                  <option value="Admin">Admin (Full Control)</option>
                </select>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-900/50 py-3.5 font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3.5 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex w-full max-w-sm flex-col animate-scale-up rounded-3xl border border-white/10 bg-[#0A101D]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">

            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
                <AlertTriangle className="text-red-500" size={32} />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-extrabold text-white">Delete User</h2>
                <p className="text-sm font-medium leading-relaxed text-slate-400">
                  Are you sure you want to revoke access for <span className="font-bold text-white">{userToDelete.name}</span>? They will no longer be able to log in.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3 w-full">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-900/50 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all hover:bg-red-500 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
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