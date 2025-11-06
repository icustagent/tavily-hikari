import { useEffect, useState } from 'react'
import { fetchPublicMetrics, type PublicMetrics } from './api'

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

function PublicHome(): JSX.Element {
  const [metrics, setMetrics] = useState<PublicMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    fetchPublicMetrics(controller.signal)
      .then((data) => {
        setMetrics(data)
        setError(null)
      })
      .catch((err) => {
        if ((err as Error).name === 'AbortError') {
          return
        }
        setError(err instanceof Error ? err.message : 'Unable to load metrics right now')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [])

  return (
    <main className="app-shell public-home">
      <section className="surface public-home-hero">
        <h1>Tavily Hikari Proxy</h1>
        <p className="public-home-tagline">Transparent request visibility for your Tavily integration.</p>
        <div className="public-home-actions">
          <button type="button" className="button button-primary" onClick={() => { window.location.href = '/admin' }}>
            Go to Admin Dashboard
          </button>
        </div>
      </section>
      <section className="surface panel public-home-metrics">
        <header className="public-home-metrics-header">
          <h2>Successful Requests</h2>
          <p className="panel-description">Live counters across the entire proxy deployment.</p>
        </header>
        {error && <div className="surface error-banner" role="status">{error}</div>}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>This Month</h3>
            <div className="metric-value">
              {loading ? '—' : formatNumber(metrics?.monthlySuccess ?? 0)}
            </div>
            <div className="metric-subtitle">Completed since the start of the month</div>
          </div>
          <div className="metric-card">
            <h3>Today</h3>
            <div className="metric-value">{loading ? '—' : formatNumber(metrics?.dailySuccess ?? 0)}</div>
            <div className="metric-subtitle">Completed since midnight (UTC)</div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PublicHome
