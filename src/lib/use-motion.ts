"use client"

import * as React from "react"

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"

function subscribeToMotionPreference(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

const readReducedMotion = () => window.matchMedia(reducedMotionQuery).matches
const readServerReducedMotion = () => false

export function useReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToMotionPreference,
    readReducedMotion,
    readServerReducedMotion
  )
}

export function useInView<T extends Element>(ref: React.RefObject<T | null>) {
  const [inView, setInView] = React.useState(true)

  React.useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting)
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return inView
}
