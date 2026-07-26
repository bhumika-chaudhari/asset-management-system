"use client";

import { useEffect, useState } from "react";

import {
  getDashboardStats,
  getAssetCategoryDistribution,
  getAssetStatusDistribution,
} from "@/services/dashboardService";

import AssetCategoryChart from "./components/AssetCategoryChart";
import AssetStatusPieChart from "./components/AssetStatusPieChart";

import {
  Package,
  Users,
  ClipboardList,
  Wrench,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const [statsRes, categoryRes, statusRes] = await Promise.all([
        getDashboardStats(),
        getAssetCategoryDistribution(),
        getAssetStatusDistribution(),
      ]);

      setStats(statsRes.data);
      setCategoryData(categoryRes.data);
      setStatusData(statusRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Premium Skeleton Loader
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>
        {/* Header Skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="h-10 w-64 rounded-xl bg-slate-800/50 animate-pulse" />
          <div className="h-5 w-96 rounded-lg bg-slate-800/30 animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[120px] rounded-2xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div className="h-[450px] rounded-[2rem] bg-slate-800/40 animate-pulse" style={{ flex: "2 1 500px" }} />
          <div className="h-[450px] rounded-[2rem] bg-slate-800/40 animate-pulse" style={{ flex: "1 1 300px" }} />
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Assets",
      value: stats?.totalAssets || 0,
      icon: Package,
      color: "from-indigo-600 to-indigo-400",
      glow: "group-hover:shadow-[0_0_25px_rgba(79,70,229,0.4)]",
    },
    {
      title: "Employees",
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: "from-cyan-600 to-cyan-400",
      glow: "group-hover:shadow-[0_0_25px_rgba(8,145,178,0.4)]",
    },
    {
      title: "Assigned",
      value: stats?.assignedAssets || 0,
      icon: ClipboardList,
      color: "from-emerald-600 to-emerald-400",
      glow: "group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]",
    },
    {
      title: "Maintenance",
      value: stats?.maintenanceAssets || 0,
      icon: Wrench,
      color: "from-orange-600 to-amber-500",
      glow: "group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        className="animate-fade-up"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm font-medium text-slate-400">
          Welcome back! Here's a real-time snapshot of your asset management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`group cursor-pointer rounded-[1.5rem] border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-[#0A101D]/95 animate-fade-up`}
              style={{
                padding: "1.5rem",
                animationDelay: `${(index + 1) * 0.1}s`, // Staggered entry
                animationFillMode: "both",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {card.title}
                  </p>
                  <h2 className="text-3xl font-extrabold text-white" style={{ marginTop: "0.25rem" }}>
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`rounded-[1rem] bg-gradient-to-br ${card.color} ${card.glow} ring-1 ring-white/20 transition-all duration-300`}
                  style={{
                    height: "3.5rem",
                    width: "3.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} className="text-white drop-shadow-md" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div
        className="animate-fade-up"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          alignItems: "stretch",
          animationDelay: "0.5s",
          animationFillMode: "both",
        }}
      >
        <div style={{ flex: "2 1 500px", minWidth: 0 }}>
          <AssetCategoryChart data={categoryData} />
        </div>

        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <AssetStatusPieChart data={statusData} />
        </div>
      </div>

      {/* Global Animation Styles */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}