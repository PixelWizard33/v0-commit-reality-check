'use client'

import { useEffect } from 'react'

export function PostHogInitializer() {
  useEffect(() => {
    // Initialize PostHog when component mounts
    if (typeof window !== 'undefined' && window.posthog) {
      console.log("[v0] PostHog library loaded, initializing...")
      window.posthog.init('phc_qYaMZaXZnrZbNL2J9c5sjyrBsVi8zcdk9wf9R9D74UfG', {
        api_host: 'https://us.posthog.com',
        person_profiles: 'always',
      })
      console.log("[v0] PostHog initialized successfully")
    } else {
      console.log("[v0] PostHog not loaded yet or window.posthog not found")
    }
  }, [])

  return null
}
