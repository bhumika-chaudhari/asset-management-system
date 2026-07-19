/*What this gives you
📦 Total Blocks (total audit log records)
⛓ Latest Block (currently displayed as #totalLogs; later we can replace it with the actual latest block ID)
🛡️ Blockchain Status (Verified/Tampered with color-coded badge)*/

"use client";

import {
  ShieldCheck,
  ShieldAlert,
  Database,
  Blocks,
} from "lucide-react";

export default function BlockchainStatus({ verified, totalLogs, loading }) {
  // Graceful loading skeleton
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
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-white/5 bg-slate-900/50 animate-pulse"
            style={{ height: "130px" }}
          />
        ))}
      </div>
    );
  }

  // Determine status UI dynamically
  const statusConfig = verified
    ? {
        text: "Verified",
        icon: ShieldCheck,
        color: "#10b981", // Emerald
        textColor: "text-emerald-400",
      }
    : {
        text: "Tampered",
        icon: ShieldAlert,
        color: "#ef4444", // Red
        textColor: "text-red-400",
      };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.5rem",
        width: "100%",
      }}
    >
      <StatusCard
        title="Total Blocks"
        value={totalLogs}
        icon={Database}
        color="#06b6d4" // Cyan
        textColor="text-white"
      />

      <StatusCard
        title="Latest Block"
        value={`#${totalLogs}`}
        icon={Blocks}
        color="#6366f1" // Indigo
        textColor="text-white"
      />

      <StatusCard
        title="Blockchain Status"
        value={statusConfig.text}
        icon={statusConfig.icon}
        color={statusConfig.color}
        textColor={statusConfig.textColor}
      />
    </div>
  );
}

// Reusable internal card component for consistency
function StatusCard({ title, value, icon: Icon, color, textColor }) {
  return (
    <div
      className="group rounded-3xl border border-white/10 bg-[#0A101D]/80 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl"
      style={{
        padding: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <p className="text-sm font-medium text-slate-400">
          {title}
        </p>
        <h2
          className={`font-bold ${textColor}`}
          style={{
            fontSize: "2rem",
            marginTop: "0.5rem",
          }}
        >
          {value}
        </h2>
      </div>

      <div
        style={{
          width: "54px",
          height: "54px",
          borderRadius: "16px",
          background: `${color}15`, // 15% opacity of the hex color
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: `1px solid ${color}30`,
          flexShrink: 0,
        }}
      >
        <Icon size={26} color={color} />
      </div>
    </div>
  );
}