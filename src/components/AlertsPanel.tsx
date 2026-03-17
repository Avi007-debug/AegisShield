import { useState, useEffect } from 'react'
import { AlertTriangle, Bell } from 'lucide-react'

interface Alert {
  id: number
  type: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, type: 'critical', message: 'Superspreader node detected — high centrality score', timestamp: new Date().toISOString() },
    { id: 2, type: 'warning', message: 'Bot cluster Campaign_A activity spike', timestamp: new Date(Date.now() - 60000).toISOString() },
    { id: 3, type: 'info', message: 'Graph topology updated — 50 nodes active', timestamp: new Date(Date.now() - 120000).toISOString() },
  ])

  // Simulate new alerts
  useEffect(() => {
    const msgs = [
      'Anomalous propagation velocity detected',
      'New coordinated cluster forming',
      'Containment recommendation: Node #1',
      'Misinformation confidence > 90%',
    ]
    const interval = setInterval(() => {
      setAlerts((prev) => [
        { id: Date.now(), type: 'warning', message: msgs[Math.floor(Math.random() * msgs.length)], timestamp: new Date().toISOString() },
        ...prev.slice(0, 9),
      ])
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const typeStyles = {
    critical: 'border-l-threat text-threat bg-threat/5',
    warning: 'border-l-warning text-warning bg-warning/5',
    info: 'border-l-info text-info bg-info/5',
  }

  return (
    <div className="card-glass rounded-xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <Bell className="h-4 w-4 text-warning" />
        <span className="font-mono text-xs font-semibold text-foreground">REAL-TIME ALERTS</span>
        <span className="ml-auto rounded bg-threat/20 px-1.5 py-0.5 font-mono text-[10px] text-threat">{alerts.length}</span>
      </div>
      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {alerts.map((a) => (
          <div key={a.id} className={`rounded border-l-2 p-2 font-mono text-[11px] ${typeStyles[a.type]}`}>
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <div>
                <p className="text-foreground">{a.message}</p>
                <p className="mt-0.5 text-muted-foreground">{new Date(a.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
