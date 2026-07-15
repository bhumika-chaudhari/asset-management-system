export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        rounded-xl
        bg-indigo-600
        px-4
        py-3
        font-semibold
        text-white
        transition-all
        duration-300
        hover:bg-indigo-700
        hover:scale-[1.02]
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </button>
  );
}