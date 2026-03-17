import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, Bell, AlertCircle, Info } from 'lucide-react'

interface Alert {
  id: number
  type: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
  isNew?: boolean
}

const typeConfig = {
  critical: {
    icon: AlertCircle,
    border: 'border-l-threat',
    bg: 'bg-threat/5',
    text: 'text-threat',
    badge: 'bg-threat/15 text-threat',
    label: 'CRITICAL',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-l-warning',
    bg: 'bg-warning/5',
    text: 'text-warning',
    badge: 'bg-warning/15 text-warning',
    label: 'WARN',
  },
  info: {
    icon: Info,
    border: 'border-l-info',
    bg: 'bg-info/5',
    text: 'text-info',
    badge: 'bg-info/15 text-info',
    label: 'INFO',
  },
}

export function AlertsPanel() {
  const isFirstMount = useRef(true)

  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, type: 'critical', message: 'Superspreader node detected — high centrality score', timestamp: new Date().toISOString() },
    { id: 2, type: 'warning',  message: 'Bot cluster Campaign_A activity spike',              timestamp: new Date(Date.now() - 60000).toISOString() },
    { id: 3, type: 'info',     message: 'Graph topology updated — 50 nodes active',           timestamp: new Date(Date.now() - 120000).toISOString() },
  ])

  useEffect(() => {
    // Mark initial alerts as slide-in too (on first mount)
    setAlerts((prev) => prev.map((a) => ({ ...a, isNew: true })))
    const clearTimer = setTimeout(() => {
      setAlerts((prev) => prev.map((a) => ({ ...a, isNew: false })))
      isFirstMount.current = false
    }, 800)

    const msgs = [
      'Anomalous propagation velocity detected',
      'New coordinated cluster forming',
      'Containment recommendation: Node #1',
      'Misinformation confidence > 90%',
    ]
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now(),
        type: 'warning',
        message: msgs[Math.floor(Math.random() * msgs.length)],
        timestamp: new Date().toISOString(),
        isNew: true,
      }
      setAlerts((prev) => [newAlert, ...prev.slice(0, 9)])
      // Clear isNew after animation
      setTimeout(() => {
        setAlerts((prev) => prev.map((a) => a.id === newAlert.id ? { ...a, isNew: false } : a))
      }, 600)
    }, 15000)

    return () => {
      clearTimeout(clearTimer)
      clearInterval(interval)
    }
  }, [])

  const criticalCount = alerts.filter((a) => a.type === 'critical').length

  return (
    <div className="card-glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
        <Bell className="h-4 w-4 text-warning" />
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
          Real-Time Alerts
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {criticalCount > 0 && (
            <span className="rounded-full bg-threat/15 px-2 py-0.5 font-mono text-[9px] font-bold text-threat">
              {criticalCount} CRITICAL
            </span>
          )}
          <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
            {alerts.length}
          </span>
        </div>
      </div>

      <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
        {alerts.map((a) => {
          const cfg = typeConfig[a.type]
          const Icon = cfg.icon
          return (
            <div
              key={a.id}
              className={`rounded-lg border-l-2 p-2.5 ${cfg.border} ${cfg.bg} ${a.isNew ? 'animate-alert-new' : ''}`}
            >
              <div className="flex items-start gap-2">
                <Icon className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${cfg.text}`} />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className={`rounded px-1 py-px font-mono text-[9px] font-bold ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90">{a.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
