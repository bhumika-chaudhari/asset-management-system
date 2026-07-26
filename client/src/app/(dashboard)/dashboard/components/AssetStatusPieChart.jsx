"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f97316",
    "#8b5cf6",
    "#ec4899",
];

export default function AssetStatusPieChart({ data }) {

    return (
        <div
            className="rounded-2xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl"
            style={{
                padding: "1.5rem",
                height: "380px",
            }}
        >
            <h2 className="mb-6 text-lg font-bold text-white">
                Asset Status Distribution
            </h2>

            <ResponsiveContainer width="100%" height="90%">
                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        innerRadius={60}
                        paddingAngle={4}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}