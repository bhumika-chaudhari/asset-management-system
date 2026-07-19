"use client";

import { useState } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Wrench,
  BarChart3,
} from "lucide-react";
import DashboardAnalytics from "./components/DashboardAnalytics";
import AllocationReport from "./components/AllocationReportTable";
import EmployeeReport from "./components/EmployeeReportTable";
import MaintenanceReport from "./components/MaintenanceReportTable";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "allocations",
      label: "Allocations",
      icon: ClipboardList,
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: Wrench,
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
        className="rounded-[2rem] border border-white/5 bg-[#0A101D]/80 shadow-2xl backdrop-blur-xl"
        style={{
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div
            className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 ring-1 ring-white/10"
            style={{
              width: "64px",
              height: "64px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <BarChart3 size={32} className="text-cyan-400" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Reports & Analytics
            </h1>
            <p className="text-sm font-medium text-slate-400">
              View allocation reports, maintenance history, employee asset usage and system analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="rounded-2xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl"
        style={{
          padding: "0.75rem",
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)]"
                  : "bg-transparent font-medium text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "0.75rem",
              }}
            >
              <Icon 
                size={18} 
                className={active ? "text-white" : "text-slate-500 group-hover:text-cyan-400 transition-colors"} 
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div
        key={activeTab} // Changing the key forces React to re-mount the div and re-trigger the animation!
        style={{
          animation: "fadeUp 0.3s ease-out forwards",
          width: "100%",
        }}
      >
        {activeTab === "dashboard" && <DashboardAnalytics />}
        {activeTab === "allocations" && <AllocationReport />}
        {activeTab === "employees" && <EmployeeReport />}
        {activeTab === "maintenance" && <MaintenanceReport />}
      </div>

      {/* Global Animation Keyframes */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}