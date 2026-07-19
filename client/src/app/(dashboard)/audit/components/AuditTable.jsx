"use client";

import { useMemo, useState } from "react";
import { Search, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function AuditTable({
  logs = [],
  loading = false,
}) {
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    if (!Array.isArray(logs)) return [];

    const keyword = search.toLowerCase();

    return logs.filter((log) => {
      return (
        log?.action?.toLowerCase().includes(keyword) ||
        log?.entity?.toLowerCase().includes(keyword) ||
        log?.description?.toLowerCase().includes(keyword)
      );
    });
  }, [logs, search]);

  const copyHash = (hash) => {
    if (!hash) return;

    navigator.clipboard.writeText(hash);
    toast.success("Hash copied to clipboard");
  };

  const badgeColor = (action) => {
    switch (action) {
      case "CREATE":
        return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20";

      case "UPDATE":
        return "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20";

      case "DELETE":
        return "bg-red-500/10 text-red-400 ring-red-500/20";

      case "ALLOCATE":
        return "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20";

      case "RETURN":
        return "bg-orange-500/10 text-orange-400 ring-orange-500/20";

      case "COMPLETE":
        return "bg-purple-500/10 text-purple-400 ring-purple-500/20";

      default:
        return "bg-slate-500/10 text-slate-300 ring-slate-500/20";
    }
  };

  const shortHash = (hash) => {
    if (!hash) return "—";

    return `${hash.substring(0, 12)}...${hash.substring(hash.length - 8)}`;
  };

  return (
    <div
      className="rounded-2xl border border-white/5 bg-[#0A101D]/80 backdrop-blur-xl"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "1.5rem",
        }}
      >
        <h2 className="text-xl font-bold tracking-tight text-white">
          Transaction Ledger
        </h2>

        <div
          className="rounded-2xl border border-white/10 bg-slate-900/50 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.25rem",
            width: "100%",
            maxWidth: "340px",
          }}
        >
          <Search size={18} className="text-slate-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ledger..."
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead className="border-y border-white/10 bg-white/5">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th style={{ padding: "1rem 1.5rem" }}>Block</th>
              <th style={{ padding: "1rem 1.5rem" }}>Action</th>
              <th style={{ padding: "1rem 1.5rem" }}>Entity</th>
              <th style={{ padding: "1rem 1.5rem" }}>Description</th>
              <th style={{ padding: "1rem 1.5rem" }}>Previous Hash</th>
              <th style={{ padding: "1rem 1.5rem" }}>Current Hash</th>
              <th style={{ padding: "1rem 1.5rem" }}>Date</th>
            </tr>
          </thead>

          <tbody className="text-sm text-slate-300">
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: "4rem", textAlign: "center" }}>
                  <div
                    className="animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"
                    style={{
                      width: "40px",
                      height: "40px",
                      margin: "0 auto",
                    }}
                  />
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-slate-500"
                  style={{ padding: "4rem" }}
                >
                  No audit logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td
                    className="font-semibold text-white"
                    style={{ padding: "1rem 1.5rem" }}
                  >
                    #{log.id}
                  </td>

                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td
                    className="font-medium"
                    style={{ padding: "1rem 1.5rem" }}
                  >
                    {log.entity}
                  </td>

                  <td style={{ padding: "1rem 1.5rem" }}>
                    {log.description}
                  </td>

                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span className="font-mono text-xs">
                        {shortHash(log.previous_hash)}
                      </span>

                      {log.previous_hash && (
                        <button onClick={() => copyHash(log.previous_hash)}>
                          <Copy
                            size={14}
                            className="text-slate-500 hover:text-cyan-400"
                          />
                        </button>
                      )}
                    </div>
                  </td>

                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span className="font-mono text-xs text-cyan-400">
                        {shortHash(log.current_hash)}
                      </span>

                      {log.current_hash && (
                        <button onClick={() => copyHash(log.current_hash)}>
                          <Copy
                            size={14}
                            className="text-slate-500 hover:text-cyan-400"
                          />
                        </button>
                      )}
                    </div>
                  </td>

                  <td
                    className="text-slate-400"
                    style={{ padding: "1rem 1.5rem" }}
                  >
                    {log.created_at
                      ? new Date(log.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}