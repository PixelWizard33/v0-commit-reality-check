"use client"

import { useState, useRef, useCallback, type ReactNode } from "react"

interface TerminalTooltipProps {
  text: string
  children: ReactNode
  position?: "top" | "right"
  accentColor?: "green" | "cyan" | "orange" | "magenta"
}

const accentMap = {
  green: {
    border: "border-neon-green/50",
    glow: "shadow-[0_0_10px_rgba(0,255,65,0.25)]",
    pointer: "border-t-neon-green/50",
    pointerRight: "border-l-neon-green/50",
    caret: "text-neon-green",
  },
  cyan: {
    border: "border-neon-cyan/50",
    glow: "shadow-[0_0_10px_rgba(0,255,255,0.25)]",
    pointer: "border-t-neon-cyan/50",
    pointerRight: "border-l-neon-cyan/50",
    caret: "text-neon-cyan",
  },
  orange: {
    border: "border-neon-orange/50",
    glow: "shadow-[0_0_10px_rgba(255,165,0,0.25)]",
    pointer: "border-t-neon-orange/50",
    pointerRight: "border-l-neon-orange/50",
    caret: "text-neon-orange",
  },
  magenta: {
    border: "border-neon-magenta/50",
    glow: "shadow-[0_0_10px_rgba(255,0,170,0.25)]",
    pointer: "border-t-neon-magenta/50",
    pointerRight: "border-l-neon-magenta/50",
    caret: "text-neon-magenta",
  },
}

export function TerminalTooltip({
  text,
  children,
  position = "top",
  accentColor = "green",
}: TerminalTooltipProps) {
  const [visible, setVisible] = useState(false)
  const [displayText, setDisplayText] = useState("")
  const [hasBeenSeen, setHasBeenSeen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const accent = accentMap[accentColor]

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (typingRef.current) clearInterval(typingRef.current)
  }, [])

  const startTyping = useCallback(() => {
    let i = 0
    setDisplayText("")
    typingRef.current = setInterval(() => {
      i++
      setDisplayText(text.slice(0, i))
      if (i >= text.length) {
        if (typingRef.current) clearInterval(typingRef.current)
      }
    }, 18)
  }, [text])

  const handleMouseEnter = useCallback(() => {
    clearTimers()
    timeoutRef.current = setTimeout(() => {
      setVisible(true)
      if (hasBeenSeen) {
        setDisplayText(text)
      } else {
        startTyping()
        setHasBeenSeen(true)
      }
    }, 120)
  }, [clearTimers, hasBeenSeen, startTyping, text])

  const handleMouseLeave = useCallback(() => {
    clearTimers()
    setVisible(false)
    setDisplayText("")
  }, [clearTimers])

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && displayText && (
        <span
          role="tooltip"
          className={`absolute z-40 whitespace-nowrap border bg-terminal-bg px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-foreground ${accent.border} ${accent.glow} animate-in fade-in-0 duration-100 ${
            position === "top"
              ? "bottom-full left-1/2 mb-2 -translate-x-1/2"
              : "left-full top-1/2 ml-2 -translate-y-1/2"
          }`}
        >
          <span className={accent.caret}>{">"}</span>{" "}
          {displayText}
          <span className={`cursor-blink ${accent.caret}`}>{"_"}</span>
          {/* Pointer / caret arrow */}
          {position === "top" ? (
            <span
              className={`absolute left-1/2 top-full -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent ${accent.pointer}`}
            />
          ) : (
            <span
              className={`absolute right-full top-1/2 -translate-y-1/2 border-y-[5px] border-l-[5px] border-y-transparent ${accent.pointerRight}`}
            />
          )}
        </span>
      )}
    </span>
  )
}
