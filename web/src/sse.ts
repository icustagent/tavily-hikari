export function subscribeToSseOpen(cb: () => void): () => void {
  const timer = window.setTimeout(() => {
    try { cb() } catch {}
  }, 0)
  return () => window.clearTimeout(timer)
}

