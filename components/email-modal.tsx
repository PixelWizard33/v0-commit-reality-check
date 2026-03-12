"use client"

import { useEffect, useRef, useState, type MutableRefObject } from "react"
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
const MOUNT_ID = "hs-form-mount"

declare global {
  interface Window {
    hbspt?: {
      forms: { create: (opts: Record<string, unknown>) => void }
    }
  }
}

export function EmailModal({ open, onSubmit, onClose }: EmailModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const formCreatedRef = useRef(false)
  const submittedRef = useRef(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setIsMounted(true) }, [])

  // Create a bare div outside React's tree and move it into the modal wrapper.
  // HubSpot renders into this node -- React never diffs its children.
  useEffect(() => {
    if (!isMounted) return

    // Create the mount node once and keep it alive for the page lifetime
    if (!document.getElementById(MOUNT_ID)) {
      const node = document.createElement("div")
      node.id = MOUNT_ID
      node.className = "hs-terminal-form"
      document.body.appendChild(node)
    }

    return () => {
      // Do NOT remove on unmount -- HubSpot may still be using it
    }
  }, [isMounted])

  // Move the mount node in/out of the modal wrapper when open changes
  useEffect(() => {
    if (!isMounted) return
    const mountNode = document.getElementById(MOUNT_ID)
    const wrapper = wrapperRef.current
    if (!mountNode || !wrapper) return

    if (open) {
      wrapper.appendChild(mountNode)
    } else {
      if (mountNode.parentNode === wrapper) {
        document.body.appendChild(mountNode)
      }
    }
  }, [open, isMounted])

  // Load SDK and call hbspt.forms.create() once
  useEffect(() => {
    if (!open || !isMounted || formCreatedRef.current) return

    const triggerSubmit = () => {
      if (submittedRef.current) return
      submittedRef.current = true
      if (pollRef.current) clearInterval(pollRef.current)
      // Show "Thank you" state briefly, then close and reveal results
      setTimeout(() => onSubmit(""), 1500)
    }

    // MutationObserver on the mount node -- since hbspt renders HTML directly
    // into our div, we can watch for .submitted-message appearing
    const mountNode = document.getElementById(MOUNT_ID)
    if (mountNode) {
      const observer = new MutationObserver(() => {
        if (mountNode.querySelector(".submitted-message")) {
          observer.disconnect()
          triggerSubmit()
        }
      })
      observer.observe(mountNode, { childList: true, subtree: true })
      // Store cleanup on the ref so we can disconnect on unmount
      ;(submittedRef as MutableRefObject<unknown>).__observer = observer
    }

    const createForm = () => {
      if (!window.hbspt || formCreatedRef.current) return
      formCreatedRef.current = true
      window.hbspt.forms.create({
        region: "na1",
        portalId: HS_PORTAL_ID,
        formId: HS_FORM_ID,
        target: `#${MOUNT_ID}`,
        // onFormSubmit fires before redirect (v2 API)
        onFormSubmit: () => triggerSubmit(),
        // onFormSubmitted fires after (some versions)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obs = (submittedRef as any).__observer as MutationObserver | undefined
      obs?.disconnect()
    }
  }, [open, isMounted, onSubmit])

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

        {/* wrapperRef receives the HubSpot mount node via DOM appendChild.
            React never renders children here -- no hydration conflict. */}
        <div ref={wrapperRef} className="min-h-[80px]" />

        <p className="mt-3 text-center text-[10px] tracking-wider text-muted-foreground">
          {"NO SPAM. JUST COMMITS AND CONSEQUENCES."}
        </p>
      </div>
    </div>
  )
}
