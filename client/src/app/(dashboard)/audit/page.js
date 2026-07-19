"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import AuditTable from "./components/AuditTable";
import BlockchainStatus from "./components/BlockchainStatus";
import VerifyButton from "./components/VerifyButton";
import toast from "react-hot-toast";
import {
  getAuditLogs,
  verifyBlockchain,
} from "@/services/auditService";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [verified, setVerified] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [logsRes, verifyRes] = await Promise.all([
  getAuditLogs(),
  verifyBlockchain(),
]);

setLogs(logsRes.data || []);
setVerified(verifyRes.valid);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
    } finally {
      setLoading(false);
    }
  }

async function handleVerify() {
  try {
    const result = await verifyBlockchain();

    setVerified(result.valid);

    const logs = await getAuditLogs();
    setLogs(logs.data || []);

    if (result.valid) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

  } catch (error) {
    toast.error("Verification failed");
  }
}
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        width: "100%",
      }}
    >
      {/* Header Card */}
      <div
        className="rounded-[2rem] border border-white/5 bg-[#0A101D]/80 shadow-2xl backdrop-blur-xl"
        style={{
          padding: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
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
            <ShieldCheck size={32} className="text-cyan-400" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Audit Logs
            </h1>
            <p className="text-sm font-medium text-slate-400">
              Immutable blockchain trail of asset lifecycle events and system actions.
            </p>
          </div>
        </div>

        {/* Action Button positioned in the header */}
        <VerifyButton onVerify={handleVerify} />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          width: "100%",
          animation: "fadeUp 0.3s ease-out forwards",
        }}
      >
        <BlockchainStatus
          verified={verified}
          totalLogs={logs.length}
          loading={loading}
        />

        <AuditTable 
          logs={logs} 
          loading={loading} 
        />
      </div>

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