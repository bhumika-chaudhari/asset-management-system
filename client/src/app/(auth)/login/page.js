"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Server, Network, Fingerprint } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email,
        password,
      });

      login(res.token, res.user);
      router.refresh();
      toast.success(res.message);
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 70 } },
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B14] p-6 font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Animated Blobs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, -30, 0], scale: [1, 1.5, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[120px]"
      />

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [-30, 30, -30], x: [-10, 10, -10], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[40%] text-indigo-500/10"
      >
        <Server size={110} />
      </motion.div>
      <motion.div
        animate={{ y: [25, -25, 25], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[25%] left-[8%] text-cyan-500/10"
      >
        <Network size={90} />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] text-emerald-500/20"
      >
        <Fingerprint size={130} />
      </motion.div>

      <div className="relative z-10 grid w-full max-w-7xl gap-16 lg:grid-cols-2">
        {/* Left Side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="hidden lg:flex flex-col justify-center text-white"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                Asset
              </span>
              <br />
              Management
              <br />
              System
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              Manage assets, employees, maintenance, allocations, and generate
              real-time reports from one modern dashboard.
            </p>
          </motion.div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="flex w-full items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md">
            {/* Glowing Backdrop */}
            <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-cyan-500 opacity-20 blur-xl transition duration-1000"></div>
            
            {/* 
              FORCED INLINE STYLES: 
              style={{ padding: "3rem" }} ensures the borders will NEVER touch the content 
            */}
            <div 
              className="relative z-10 flex w-full flex-col items-center rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-xl"
              style={{ padding: "3rem", boxSizing: "border-box" }}
            >
              
              <div className="flex w-full flex-col items-center text-center" style={{ marginBottom: "2rem" }}>
                <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 ring-1 ring-white/20" style={{ height: "4rem", width: "4rem", marginBottom: "1.5rem" }}>
                  <ShieldCheck className="text-cyan-400" size={32} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Welcome Back
                </h2>
                <p className="text-sm text-slate-400" style={{ marginTop: "0.5rem" }}>
                  Authenticate to access the registry
                </p>
              </div>

              {/* Form gaps forced via inline style */}
              <form onSubmit={handleSubmit} className="flex w-full flex-col" style={{ gap: "1.5rem" }}>
                
                <div className="flex w-full flex-col" style={{ gap: "0.5rem" }}>
                  <label className="text-sm font-medium text-slate-300">Work Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    style={{ padding: "0.875rem 1rem", boxSizing: "border-box" }}
                  />
                </div>

                <div className="flex w-full flex-col" style={{ gap: "0.5rem" }}>
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                    style={{ padding: "0.875rem 1rem", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ marginTop: "0.5rem" }}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_20px_rgba(8,112,184,0.3)] transition-all hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_25px_rgba(8,112,184,0.5)] disabled:opacity-50"
                    style={{ padding: "1rem" }}
                  >
                    {loading ? "Authenticating..." : "Access Dashboard"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}