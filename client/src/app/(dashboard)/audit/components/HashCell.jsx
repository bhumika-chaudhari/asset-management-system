"use client";

import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function HashCell({ hash, isCurrent = false }) {
  function copyHash() {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    toast.success("Hash copied to clipboard");
  }

  if (!hash) {
    return (
      <span className="font-mono text-xs text-slate-500">
        —
      </span>
    );
  }

  const shortHash = hash.substring(0, 12) + "..." + hash.substring(hash.length - 8);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span
        className={`font-mono text-xs ${isCurrent ? 'text-cyan-400/80' : 'text-slate-400'}`}
        title={hash}
      >
        {shortHash}
      </span>

      <button
        type="button"
        onClick={copyHash}
        className="text-slate-500 transition-colors hover:text-cyan-400 focus:outline-none"
        title="Copy Hash"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}