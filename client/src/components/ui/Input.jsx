import { forwardRef, useId } from "react";

const Input = forwardRef(({ label, className = "", id, error, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex w-full flex-col space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`w-full rounded-xl border border-white/5 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 backdrop-blur-sm transition-all focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;