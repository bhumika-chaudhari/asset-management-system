"use client";

import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function VerifyButton({ onVerify }) {
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    try {
      setLoading(true);

      // Calls the parent function
      await onVerify();

      toast.success("Blockchain verified successfully");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Blockchain verification failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleVerify}
      disabled={loading}
      className="group rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-white shadow-[0_0_15px_rgba(8,112,184,0.3)] transition-all duration-300 hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(8,112,184,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.875rem 1.5rem",
        minWidth: "200px",
      }}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Verifying Chain...</span>
        </>
      ) : (
        <>
          <ShieldCheck 
            size={18} 
            className="transition-transform duration-300 group-hover:scale-110" 
          />
          <span>Verify Integrity</span>
        </>
      )}
    </button>
  );
}