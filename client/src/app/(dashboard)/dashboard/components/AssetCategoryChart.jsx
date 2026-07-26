"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Custom Tooltip for a premium glassmorphism hover effect
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl border border-white/10 bg-[#0A101D]/95 shadow-2xl backdrop-blur-md"
        style={{
          padding: "1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-xl font-bold text-white">
          {payload[0].value}{" "}
          <span className="text-sm font-medium text-cyan-500">Assets</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AssetCategoryChart({ data }) {
  return (
    <div
      className="group rounded-[2rem] border border-white/5 bg-[#0A101D]/80 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
        width: "100%",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 className="text-xl font-extrabold tracking-tight text-white">
          Assets by Category
        </h2>
        <p className="text-sm font-medium text-slate-400" style={{ marginTop: "0.25rem" }}>
          Distribution of company assets across all types.
        </p>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 0,
              right: 20,
              left: 10,
              bottom: 0,
            }}
          >
            {/* SVG Gradient Definition */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} /> {/* Indigo */}
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} /> {/* Cyan */}
              </linearGradient>
            </defs>

            {/* Subtle Vertical Grid Lines (Horizontal removed for cleaner look) */}
            <CartesianGrid 
              strokeDasharray="4 4" 
              stroke="rgba(255,255,255,0.05)" 
              horizontal={false} 
            />

            <XAxis 
              type="number" 
              stroke="#64748b" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              dx={-5}
            />

            <YAxis
              dataKey="category"
              type="category"
              stroke="#64748b"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 600 }}
              width={100}
            />

            {/* Custom Tooltip injected here */}
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
            />

            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}
              fill="url(#barGradient)"
              barSize={24}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}