"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/dashboardService";
import {
  Package,
  Users,
  ClipboardList,
  Wrench,
} from "lucide-react";
export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", height: "70vh", alignItems: "center", justifyContent: "center" }}>
        <div 
          className="animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
          style={{ height: "3rem", width: "3rem" }}
        ></div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Assets",
      value: stats?.totalAssets || 0,
      icon: Package,
      color: "from-indigo-600 to-indigo-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]",
    },
    {
      title: "Employees",
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: "from-cyan-600 to-cyan-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(8,145,178,0.4)]",
    },
    {
      title: "Assigned",
      value: stats?.assignedAssets || 0,
      icon: ClipboardList,
      color: "from-emerald-600 to-emerald-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(5,150,105,0.4)]",
    },
    {
      title: "Maintenance",
      value: stats?.maintenanceAssets || 0,
      icon: Wrench,
      color: "from-orange-600 to-orange-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>

      {/* Header Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm font-medium text-slate-400">
          Welcome back! Here's a real-time snapshot of your asset management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: "1.5rem",
          width: "100%"
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group cursor-pointer rounded-2xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/10"
              style={{ padding: "1.5rem" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <p className="text-sm font-medium text-slate-400">
                    {card.title}
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`rounded-xl bg-gradient-to-br ${card.color} ${card.glow} ring-1 ring-white/10 transition-all duration-300`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "3.5rem", width: "3.5rem", flexShrink: 0 }}
                >
                  <Icon className="text-white" size={24} />
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}