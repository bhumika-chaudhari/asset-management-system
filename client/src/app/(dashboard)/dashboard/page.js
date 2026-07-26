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
      const [
        statsRes,
        categoryRes,
        statusRes,
      ] = await Promise.all([
        getDashboardStats(),
        getAssetCategoryDistribution(),
        getAssetStatusDistribution(),
      ]);

      setStats(statsRes.data);
      setCategoryData(categoryRes.data);
      setStatusData(statusRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "70vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
          style={{
            height: "3rem",
            width: "3rem",
          }}
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
      glow:
        "group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]",
    },
    {
      title: "Employees",
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: "from-cyan-600 to-cyan-400",
      glow:
        "group-hover:shadow-[0_0_20px_rgba(8,145,178,0.4)]",
    },
    {
      title: "Assigned",
      value: stats?.assignedAssets || 0,
      icon: ClipboardList,
      color: "from-emerald-600 to-emerald-400",
      glow:
        "group-hover:shadow-[0_0_20px_rgba(5,150,105,0.4)]",
    },
    {
      title: "Maintenance",
      value: stats?.maintenanceAssets || 0,
      icon: Wrench,
      color: "from-orange-600 to-orange-400",
      glow:
        "group-hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]",
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
          Welcome back! Here's a real-time snapshot of your asset
          management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group cursor-pointer rounded-2xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/10"
              style={{
                padding: "1.5rem",
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

                  <h2 className="text-3xl font-bold text-white">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`rounded-xl bg-gradient-to-br ${card.color} ${card.glow} ring-1 ring-white/10 transition-all duration-300`}
                  style={{
                    height: "3.5rem",
                    width: "3.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    size={24}
                    className="text-white"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
          alignItems: "stretch",
        }}
      >
        <AssetCategoryChart data={categoryData} />

        <AssetStatusPieChart data={statusData} />
      </div>
    </div>
  );
} 