"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  Wrench,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const menu = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Assets", href: "/assets", icon: Package },
    { title: "Employees", href: "/employees", icon: Users },
    { title: "Allocations", href: "/allocations", icon: ClipboardList },
    { title: "Maintenance", href: "/maintenance", icon: Wrench },
    { title: "Reports", href: "/reports", icon: BarChart3 },
    { title: "Audit Logs", href: "/audit", icon: ShieldCheck },
    
  ];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    // 1. Root wrapper strictly locked to screen size
    <div 
      className="bg-[#070B14] text-white font-sans"
      style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}
    >
      
      {/* 2. Sidebar with forced layout styles */}
      <aside 
        className="border-r border-white/5 bg-[#0A101D] shadow-2xl"
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          width: "280px", 
          flexShrink: 0, 
          height: "100%",
          boxSizing: "border-box"
        }}
      >
        
        {/* Logo Section */}
        <div 
          className="border-b border-white/5"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            padding: "1.5rem 2rem", 
            flexShrink: 0 
          }}
        >
          <div 
            className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 ring-1 ring-white/10"
            style={{ 
              display: "flex", 
              height: "2.5rem", 
              width: "2.5rem", 
              alignItems: "center", 
              justifyContent: "center",
              marginRight: "0.75rem"
            }}
          >
            <Package className="text-cyan-400" size={20} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Asset
            </span>
            MS
          </h1>
        </div>

        {/* Navigation - Forced vertical flex lists */}
        <nav 
          className="custom-scrollbar"
          style={{ 
            display: "flex",
            flexDirection: "column",
            gap: "0.375rem",
            flex: 1, 
            padding: "1.5rem 1rem", 
            overflowY: "auto" 
          }}
        >
          {menu.map((item) => {
            const Icon = item.icon;
            // Handle sub-paths so the menu stays active (e.g., /audit/details)
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl transition-all duration-300
                  ${
                    active
                      ? "bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-cyan-400 shadow-[inset_2px_0_0_0_#22d3ee]"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                style={{ padding: "0.875rem 1rem", textDecoration: "none" }}
              >
                <Icon 
                  size={20} 
                  className={`transition-colors duration-300 ${active ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`} 
                />
                <span className="font-medium text-sm">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout Button */}
        <div 
          className="border-t border-white/5"
          style={{ padding: "1rem", flexShrink: 0 }}
        >
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl font-medium text-slate-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
            style={{ padding: "0.875rem 1rem" }}
          >
            <LogOut size={20} className="text-slate-500 transition-colors duration-300 group-hover:text-red-400" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* 3. Main container stretching dynamically */}
      <main 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          flex: 1, 
          minWidth: 0, 
          height: "100%", 
          overflow: "hidden" 
        }}
      >
        
        {/* 4. Topbar Header */}
        <header 
          className="border-b border-white/5 bg-[#070B14]/80 backdrop-blur-xl"
          style={{ 
            display: "flex", 
            height: "5rem", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "0 2rem", 
            flexShrink: 0,
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          
          {/* Search Box */}
          <div className="relative w-full max-w-md" style={{ marginRight: "auto" }}>
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              placeholder="Search assets, employees..."
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-500/50"
              style={{ padding: "0.625rem 1rem 0.625rem 2.75rem", boxSizing: "border-box" }}
            />
          </div>

          {/* User Actions Panel */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            
            {/* Notification Icon */}
          

            {/* Profile Avatar & Info */}
            <div 
              className="border-l border-white/10"
              style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "1.5rem" }}
            >
              <div className="hidden text-right md:block">
                <h3 className="text-sm font-semibold text-slate-200">
                  {user?.name || "Admin User"}
                </h3>
                <p className="text-xs font-medium text-cyan-500" style={{ marginTop: "0.125rem" }}>
                  {user?.role || "System Administrator"}
                </p>
              </div>

              <div 
                className="bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(8,112,184,0.4)] ring-2 ring-white/10"
                style={{ 
                  display: "flex", 
                  height: "2.5rem", 
                  width: "2.5rem", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: "700"
                }}
              >
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* 5. Content Viewport */}
        <div 
          className="relative"
          style={{ flex: 1, overflowY: "auto", width: "100%" }}
        >
          {/* Faint Grid Layer */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              backgroundImage: "linear-gradient(to right, #4f4f4f1a 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f1a 1px, transparent 1px)", 
              backgroundSize: "24px 24px",
              maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)",
              zIndex: 0
            }} 
          />
          
          <section className="relative" style={{ zIndex: 10, padding: "2rem", minHeight: "100%", boxSizing: "border-box" }}>
            {children}
          </section>
        </div>
      </main>

    </div>
  );
}