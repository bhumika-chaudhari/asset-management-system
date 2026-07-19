"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Package,
  CheckCircle2,
  Users,
  ClipboardList,
  Wrench,
  IndianRupee,
  Boxes,
} from "lucide-react";
import { getDashboardReport } from "@/services/reportService";

export default function DashboardAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const res = await getDashboardReport();
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard report");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          width: "100%",
        }}
      >
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-white/5 bg-slate-900/50 animate-pulse"
            style={{ height: "160px" }}
          />
        ))}
      </div>
    );
  }

  const cards = [
    { title: "Total Assets", value: data.totalAssets, icon: Package, color: "#3b82f6" },
    { title: "Available Assets", value: data.availableAssets, icon: CheckCircle2, color: "#22c55e" },
    { title: "Assigned Assets", value: data.assignedAssets, icon: ClipboardList, color: "#f59e0b" },
    { title: "Maintenance", value: data.maintenanceAssets, icon: Wrench, color: "#ef4444" },
    { title: "Employees", value: data.totalEmployees, icon: Users, color: "#8b5cf6" },
    { title: "Allocations", value: data.totalAllocations, icon: Boxes, color: "#06b6d4" },
    { title: "Maintenance Cost", value: `₹${Number(data.totalMaintenanceCost).toLocaleString()}`, icon: IndianRupee, color: "#14b8a6" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.5rem",
        width: "100%",
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group rounded-3xl border border-white/10 bg-[#0A101D]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            style={{ padding: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  background: `${card.color}15`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: `1px solid ${card.color}30`
                }}
              >
                <Icon size={24} color={card.color} />
              </div>
            </div>

            <h3 className="text-sm font-medium text-slate-400">
              {card.title}
            </h3>
            <div className="mt-1 text-3xl font-bold text-white">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}