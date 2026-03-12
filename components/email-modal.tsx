"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

interface EmailModalProps {
  open: boolean
  onSubmit: (email: string) => void
  onClose: () => void
}

const HS_PORTAL_ID = "544893"
const HS_FORM_ID = "95a33a0a-1c17-40e2-a0d4-9f70ecaeb5ab"
const HS_SCRIPT_ID = "hs-forms-sdk"
const HS_SCRIPT_SRC = "https://js.hsforms.net/forms/v2.js"
const MOUNT_ID = "hs-form-mount"

declare global {
  interface Window {
    hbspt?: {
      forms: { create: (opts: Record<string, unknown>) => void }
    }
  }
}

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const [showButton, setShowButton] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const formCreatedRef = useRef(false)
  const submittedRef = useRef(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)

  // Swallow non-fatal HubSpot internal React errors
  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      if (e.filename?.includes("hsappstatic") || e.filename?.includes("hsforms")) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener("error", handler)
    return () => window.removeEventListener("error", handler)
  }, [])

  // Create the persistent HubSpot mount node on body (outside React tree) once
  useEffect(() => {
    if (document.getElementById(MOUNT_ID)) return
    const node = document.createElement("div")
    node.id = MOUNT_ID
    node.className = "hs-terminal-form"
    document.body.appendChild(node)
  }, [])

  // Single effect that handles: move node, load SDK, watch for submission
  useEffect(() => {
    const mountNode = document.getElementById(MOUNT_ID)
    const wrapper = wrapperRef.current

    if (!open) {
      // Park the node back on body when closed
      if (mountNode && wrapper && mountNode.parentNode === wrapper) {
        document.body.appendChild(mountNode)
      }
      setShowButton(false)
      submittedRef.current = false
      if (pollRef.current) clearInterval(pollRef.current)
      observerRef.current?.disconnect()
      return
    }

    // Move the mount node into the visible wrapper
    if (mountNode && wrapper && mountNode.parentNode !== wrapper) {
      wrapper.appendChild(mountNode)
    }

    const triggerSubmit = () => {
      if (submittedRef.current) return
      console.log("[v0] HubSpot form submitted -- showing button")
      submittedRef.current = true
      if (pollRef.current) clearInterval(pollRef.current)
      observerRef.current?.disconnect()
      setShowButton(true)
    }

    const checkSubmitted = () => {
      const mount = document.getElementById(MOUNT_ID)
      if (!mount) return false
      const text = mount.innerText.toLowerCase()
      const result = !!(
        mount.querySelector(".submitted-message") ||
        mount.querySelector(".hs-form__thank-you") ||
        mount.querySelector("[class*='thank']") ||
        text.includes("thank you") ||
        text.includes("thanks")
      )
      if (result) console.log("[v0] Submission detected via DOM check")
      return result
    }

    // Check immediately (already submitted from previous session)
    if (checkSubmitted()) { triggerSubmit(); return }

    // Watch for submission
    const observer = new MutationObserver(() => {
      if (checkSubmitted()) triggerSubmit()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    observerRef.current = observer

    pollRef.current = setInterval(() => {
      if (checkSubmitted()) triggerSubmit()
    }, 400)

    // Load SDK and create form
    const createForm = () => {
      if (!window.hbspt || formCreatedRef.current) return
      console.log("[v0] Creating HubSpot form")
      formCreatedRef.current = true
      window.hbspt.forms.create({
        region: "na1",
        portalId: HS_PORTAL_ID,
        formId: HS_FORM_ID,
        target: `#${MOUNT_ID}`,
        onFormSubmit: () => { console.log("[v0] onFormSubmit fired"); triggerSubmit() },
        onFormSubmitted: () => { console.log("[v0] onFormSubmitted fired"); triggerSubmit() },
      })
    }

    if (window.hbspt) {
      createForm()
    } else if (!document.getElementById(HS_SCRIPT_ID)) {
      const script = document.createElement("script")
      script.id = HS_SCRIPT_ID
      script.src = HS_SCRIPT_SRC
      script.onload = () => createForm()
      document.body.appendChild(script)
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      observerRef.current?.disconnect()
    }
  }, [open])

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-terminal-bg/90 backdrop-blur-sm transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Email capture"
      aria-hidden={!open}
    >
      <div className="relative mx-4 w-full max-w-md border border-neon-green/40 bg-terminal-bg p-6 glow-border">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-neon-green"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex flex-col gap-2">
          <div className="text-xs tracking-wider text-muted-foreground">
            {"// AUTHENTICATION REQUIRED"}
          </div>
          <h2 className="text-lg font-bold tracking-wider text-neon-green neon-glow-sm">
            ACCESS GRANTED PENDING
          </h2>
          <p className="text-sm text-muted-foreground">
            Drop your email to unlock the full analysis.
          </p>
        </div>

        {/* Wrapper where the out-of-tree HubSpot mount node gets appended */}
        <div ref={wrapperRef} className="min-h-[80px]" />

        {showButton && (
          <button
            onClick={() => onSubmit("")}
            className="mt-4 w-full border border-neon-green bg-neon-green/10 px-4 py-3 text-sm font-bold tracking-widest text-neon-green transition-all hover:bg-neon-green/20 pulse-glow"
          >
            VIEW YOUR ROAST
          </button>
        )}

        <p className="mt-3 text-center text-[10px] tracking-wider text-muted-foreground">
          {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
        </p>
      </div>
    </div>
  )
}
