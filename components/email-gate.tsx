"use client";

import { useState, useRef, useEffect } from "react";
import { X, Zap } from "lucide-react";
import { submitForm } from "./email-gate.actions";

interface EmailGateProps {
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export function EmailGate({ open, onSubmit, onClose }: EmailGateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    // Honeypots
    country: "",
    phone: "01189998819991197253",
  });
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when modal opens
  useEffect(() => {
    if (open) {
      setFormData({ email: "", country: "", phone: "01189998819991197253" });
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const validate = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { email } = formData;
    if (!validate(email)) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      await submitForm(formData);
      onSubmit();
    } catch (e: unknown) {
      setError("Error submitting form. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-terminal-bg/90 backdrop-blur-sm transition-opacity duration-200 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Email to unlock results"
      aria-hidden={!open}
      onKeyDown={handleKeyDown}
    >
      <div className="relative mx-4 w-full max-w-md border border-neon-green/40 bg-terminal-bg glow-border">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="text-[10px] tracking-widest text-muted-foreground">
            {"// AUTHENTICATION REQUIRED"}
          </span>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-neon-green"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold tracking-wider text-neon-green neon-glow-sm">
              ACCESS GRANTED PENDING
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your roast is ready. Drop your email to unlock the full analysis.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email-gate-input"
                className="text-[10px] tracking-widest text-muted-foreground"
              >
                EMAIL ADDRESS
              </label>
              <input
                ref={inputRef}
                id="email-gate-input"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((current) => {
                    const newFormData = { ...current };
                    newFormData.email = e.target.value;
                    return newFormData;
                  });
                  setError("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full border border-border bg-terminal-bg px-3 py-2.5 text-sm text-neon-green placeholder:text-muted-foreground/30 outline-none transition-colors focus:border-neon-green/50 focus:shadow-[0_0_8px_rgba(0,255,65,0.15)] font-mono"
              />
              {error && (
                <p className="text-[10px] tracking-wide text-red-400">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 !hidden">
              <label
                htmlFor="email-gate-input-country"
                className="text-[10px] tracking-widest text-muted-foreground"
              >
                COUNTRY
              </label>
              <input
                id="email-gate-input-country"
                type="text"
                value={formData.country}
                onChange={(e) => {
                  setFormData((current) => {
                    const newFormData = { ...current };
                    newFormData.country = e.target.value;
                    return newFormData;
                  });
                  setError("");
                }}
                placeholder="USA"
                autoComplete="country"
                className="w-full border border-border bg-terminal-bg px-3 py-2.5 text-sm text-neon-green placeholder:text-muted-foreground/30 outline-none transition-colors focus:border-neon-green/50 focus:shadow-[0_0_8px_rgba(0,255,65,0.15)] font-mono"
              />
              {error && (
                <p className="text-[10px] tracking-wide text-red-400">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 !hidden">
              <label
                htmlFor="email-gate-input-phone"
                className="text-[10px] tracking-widest text-muted-foreground"
              >
                PHONE NUMBER
              </label>
              <input
                id="email-gate-input-phone"
                type="phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData((current) => {
                    const newFormData = { ...current };
                    newFormData.phone = e.target.value;
                    return newFormData;
                  });
                  setError("");
                }}
                placeholder=""
                autoComplete="phone"
                className="w-full border border-border bg-terminal-bg px-3 py-2.5 text-sm text-neon-green placeholder:text-muted-foreground/30 outline-none transition-colors focus:border-neon-green/50 focus:shadow-[0_0_8px_rgba(0,255,65,0.15)] font-mono"
              />
              {error && (
                <p className="text-[10px] tracking-wide text-red-400">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 border border-neon-green bg-neon-green/10 px-4 py-3 text-sm font-bold tracking-widest text-neon-green transition-all hover:bg-neon-green/20 pulse-glow"
            >
              <Zap className="h-4 w-4" />
              VIEW MY ROAST
            </button>
          </form>

          <p className="text-center text-[10px] tracking-wider text-muted-foreground/50">
            NO SPAM. JUST COMMITS AND CONSEQUENCES.
          </p>
        </div>
      </div>
    </div>
  );
}
