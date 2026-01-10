import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-black/10 bg-white/70 backdrop-blur",
        "shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
  disabled,
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/90"
      : variant === "secondary"
      ? "bg-white text-black border border-black/15 hover:bg-black/5"
      : "bg-transparent text-black hover:bg-black/5";

  if (href) {
    return (
      <a className={[base, styles, className].join(" ")} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      className={[base, styles, className].join(" ")}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
