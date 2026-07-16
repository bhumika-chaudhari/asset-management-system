import { forwardRef } from "react";

const Button = forwardRef(({ children, className = "", variant = "primary", disabled, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(8,112,184,0.3)] hover:shadow-[0_0_25px_rgba(8,112,184,0.5)] focus:ring-cyan-500",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm focus:ring-slate-500",
    danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] focus:ring-red-500",
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${baseStyles} px-6 py-3 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;