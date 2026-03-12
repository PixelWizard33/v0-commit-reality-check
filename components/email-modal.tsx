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
const HS_SCRIPT_SRC = "https://js.hsforms.net/forms/embed/v2.js"
const FORM_DIV_ID = "hs-form-mount"

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (opts: Record<string, unknown>) => void
      }
    }
  }
}

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const formCreatedRef = useRef(false)
  const submittedRef = useRef(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setIsMounted(true) }, [])

  // Load the HubSpot forms v2 script and call hbspt.forms.create()
  // targeting a plain div by ID -- imperative, no auto-discovery conflict.
  useEffect(() => {
    if (!open || !isMounted || formCreatedRef.current) return

    const createForm = () => {
      if (!window.hbspt || formCreatedRef.current) return
      formCreatedRef.current = true
      window.hbspt.forms.create({
        region: "na1",
        portalId: HS_PORTAL_ID,
        formId: HS_FORM_ID,
        target: `#${FORM_DIV_ID}`,
        onFormSubmitted: () => {
          if (submittedRef.current) return
          submittedRef.current = true
          setTimeout(() => onSubmit(""), 1500)
        },
      })
    }

    if (window.hbspt) {
      createForm()
      return
    }

    // Script not yet loaded -- inject it then wait
    if (!document.getElementById(HS_SCRIPT_ID)) {
      const script = document.createElement("script")
      script.id = HS_SCRIPT_ID
      script.src = HS_SCRIPT_SRC
      script.onload = () => {
        // Poll for hbspt to be ready after script load
        pollRef.current = setInterval(() => {
          if (window.hbspt) {
            if (pollRef.current) clearInterval(pollRef.current)
            createForm()
          }
        }, 100)
      }
      document.body.appendChild(script)
    } else {
      // Script tag exists but may still be loading
      pollRef.current = setInterval(() => {
        if (window.hbspt) {
          if (pollRef.current) clearInterval(pollRef.current)
          createForm()
        }
      }, 100)
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [open, isMounted, onSubmit])

  // Reset on close so re-opening works
  useEffect(() => {
    if (!open) {
      submittedRef.current = false
      formCreatedRef.current = false
      // Clear the mount div so HubSpot can re-render into it next open
      const el = document.getElementById(FORM_DIV_ID)
      if (el) el.innerHTML = ""
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

        {/* Plain div targeted by hbspt.forms.create() -- React never renders
            children here so there is no hydration conflict with HubSpot's SDK */}
        {isMounted && (
          <div id={FORM_DIV_ID} className="hs-terminal-form min-h-[80px]" />
        )}

        <p className="mt-3 text-center text-[10px] tracking-wider text-muted-foreground">
          {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
        </p>
      </div>
    </div>
  )
}
