import React from "react"

export type StatusTone = "success" | "warning" | "error" | "info" | "neutral"

const toneClassMap: Record<StatusTone, string> = {
  success: "status-pill-success",
  warning: "status-pill-warning",
  error: "status-pill-error",
  info: "status-pill-info",
  neutral: "status-pill-neutral",
}

export interface StatusBadgeProps {
  tone: StatusTone
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ tone, children, className = "" }: StatusBadgeProps): JSX.Element {
  const toneClass = toneClassMap[tone]
  return (
    <span className={`status-badge status-pill ${toneClass} ${className}`}>
      {children}
    </span>
  )
}
