"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Input({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="space-y-2">

      <label className="block text-sm font-medium text-slate-200">
        {label}
      </label>

      <div className="relative">

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            bg-slate-900/60
            px-4
            py-3
            pr-12
            text-white
            placeholder:text-slate-400
            outline-none
            transition-all
            duration-300
            ${
              error
                ? "border-red-500 focus:ring-red-500/40"
                : "border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            }
          `}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              transition
              hover:text-white
            "
          >
            {showPassword ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </button>
        )}

      </div>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}