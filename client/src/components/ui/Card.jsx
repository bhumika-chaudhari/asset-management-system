import { forwardRef } from "react";

const Card = forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
export default Card;