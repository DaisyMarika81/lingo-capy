import React from "react";

interface LingoCapyProps {
  size?: number;
  className?: string;
  mood?: "happy" | "thinking" | "celebrating" | "sleepy";
}

export function LingoCapy({ size = 44, className = "", mood = "happy" }: LingoCapyProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="48" cy="68" rx="34" ry="24" fill="#B7814F" />
      {/* Ears */}
      <circle cx="29" cy="26" r="8" fill="#A06C3F" />
      <circle cx="67" cy="26" r="8" fill="#A06C3F" />
      {/* Head */}
      <rect x="20" y="22" width="56" height="48" rx="22" fill="#C99763" />
      {/* Muzzle / Snout */}
      <rect x="28" y="44" width="40" height="26" rx="13" fill="#E0B98A" />
      {/* Nostrils */}
      <circle cx="41" cy="52" r="3" fill="#5C3A1E" />
      <circle cx="55" cy="52" r="3" fill="#5C3A1E" />
      {/* Eyes */}
      {mood === "sleepy" ? (
        <>
          <path d="M32 38h6" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
          <path d="M58 38h6" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : mood === "celebrating" ? (
        <>
          <path d="M31 40q4-6 8 0" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M57 40q4-6 8 0" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="35" cy="38" r="4.5" fill="#1E1B4B" />
          <circle cx="61" cy="38" r="4.5" fill="#1E1B4B" />
        </>
      )}
      {/* Mouth */}
      <path
        d="M42 61q6 5 12 0"
        stroke="#5C3A1E"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tangerine on head (Signature Capybara feature) */}
      <circle cx="48" cy="16" r="9" fill="#FBBF24" />
      <path d="M48 8v16M40 16h16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
