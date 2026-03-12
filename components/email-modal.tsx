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

  // Swallow the non-fatal HubSpot internal React errors so they don't
  // interrupt the page. The errors come from HubSpot's own bundled React
  // instance conflicting with Next.js -- the form still works correctly.
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

  // On first render (client only), create the persistent HubSpot mount node
  // directly on document.body -- completely outside React's managed tree.
  useEffect(() => {
    if (document.getElementById(MOUNT_ID)) return
    const node = document.createElement("div")
    node.id = MOUNT_ID
    node.className = "hs-terminal-form"
    document.body.appendChild(node)
  }, [])

  // Move the mount node into the visible modal wrapper when open,
  // park it back on body (hidden) when closed.
  useEffect(() => {
    const mountNode = document.getElementById(MOUNT_ID)
    const wrapper = wrapperRef.current
    if (!mountNode || !wrapper) return

    if (open) {
      wrapper.appendChild(mountNode)
    } else {
      if (mountNode.parentNode === wrapper) {
        document.body.appendChild(mountNode)
      }
      setShowButton(false)
      submittedRef.current = false
      observerRef.current?.disconnect()
    }
  }, [open])

  // Load SDK and create form once
  useEffect(() => {
    if (!open || formCreatedRef.current) return

    const triggerSubmit = () => {
      if (submittedRef.current) return
      submittedRef.current = true
      if (pollRef.current) clearInterval(pollRef.current)
      observerRef.current?.disconnect()
      setShowButton(true)
    }

    const startObserver = () => {
      const mountNode = document.getElementById(MOUNT_ID)
      if (!mountNode) return
      const observer = new MutationObserver(() => {
        if (mountNode.querySelector(".submitted-message")) triggerSubmit()
      })
      observer.observe(mountNode, { childList: true, subtree: true })
      observerRef.current = observer
    }

    const createForm = () => {
      if (!window.hbspt || formCreatedRef.current) return
      formCreatedRef.current = true
      startObserver()
      window.hbspt.forms.create({
        region: "na1",
        portalId: HS_PORTAL_ID,
        formId: HS_FORM_ID,
        target: `#${MOUNT_ID}`,
        onFormSubmit: () => triggerSubmit(),
        onFormSubmitted: () => triggerSubmit(),
      })
    }

    if (window.hbspt) {
      createForm()
      return
    }

    if (!document.getElementById(HS_SCRIPT_ID)) {
      const script = document.createElement("script")
      script.id = HS_SCRIPT_ID
      script.src = HS_SCRIPT_SRC
      script.onload = () => {
        pollRef.current = setInterval(() => {
          if (window.hbspt) {
            clearInterval(pollRef.current!)
            createForm()
          }
        }, 100)
      }
      document.body.appendChild(script)
    } else {
      pollRef.current = setInterval(() => {
        if (window.hbspt) {
          clearInterval(pollRef.current!)
          createForm()
        }
      }, 100)
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
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
