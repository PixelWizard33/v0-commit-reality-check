"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface EmailModalProps {
  open: boolean
  onSubmit: (email: string) => void
  onClose: () => void
}

// HubSpot developer embed config
const HS_PORTAL_ID = "544893"
const HS_FORM_ID = "95a33a0a-1c17-40e2-a0d4-9f70ecaeb5ab"
const HS_REGION = "na1"

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const formRendered = useRef(false)

  useEffect(() => {
    if (!open || formRendered.current) return

    // Poll until the HubSpot SDK is ready, then render the form
    const tryRender = () => {
      const win = window as typeof window & {
        HubSpotForms?: {
          create: (opts: Record<string, unknown>) => void
        }
      }

      if (win.HubSpotForms) {
        win.HubSpotForms.create({
          region: HS_REGION,
          portalId: HS_PORTAL_ID,
          formId: HS_FORM_ID,
          target: "#hs-form-target",
          onFormSubmitted: () => {
            // Give HubSpot a brief moment to flush the submission, then close
            setTimeout(() => {
              onSubmit("")
            }, 600)
          },
        })
        formRendered.current = true
      } else {
        setTimeout(tryRender, 150)
      }
    }

    tryRender()
  }, [open, onSubmit])

  // Reset so re-opens (rare) re-render cleanly
  useEffect(() => {
    if (!open) {
      formRendered.current = false
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-terminal-bg/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Email capture"
    >
      <div className="relative mx-4 w-full max-w-md border border-neon-green/40 bg-terminal-bg p-6 glow-border">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-neon-green"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex flex-col gap-2">
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

        {/* HubSpot form mount point */}
        <div id="hs-form-target" ref={containerRef} className="hs-terminal-form" />

        <p className="mt-4 text-center text-[10px] tracking-wider text-muted-foreground">
          {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
        </p>
      </div>
    </div>
  )
}
