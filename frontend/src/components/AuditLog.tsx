import { useEffect, useState } from 'react'
import './AuditLog.css'

interface AuditEntry {
  timestamp: string
  signature_id: string
  regulatory_order_id: string
  action: string
  status: string
  compliance_ref: string
}

export function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://localhost:8000/audit-log')
        if (res.ok) {
          const data = await res.json()
          // API returns { log: [...] }, extract array
          setLogs(data.log || [])
        }
      } catch (e) {
        console.error("Audit log poll failed", e)
      }
    }

    fetchLogs()
    // Poll every 2 seconds
    const interval = setInterval(fetchLogs, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="audit-panel">
      <h3>
        <span className="icon">🛡️</span> Regulatory Audit Log
      </h3>
      <div className="log-scroller">
        {logs.length === 0 && (
          <div className="empty-state">System monitoring active...</div>
        )}
        
        {logs.slice().reverse().map((entry, idx) => (
          <div key={idx} className={`log-entry ${entry.status.toLowerCase()}`}>
            <div className="log-meta">
              <span className="time">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
              <span className={`status-badge ${entry.status.toLowerCase()}`}>
                {entry.status}
              </span>
            </div>
            <div className="log-action">
              {entry.action}
            </div>
            <div className="log-ref">
              {entry.compliance_ref}
            </div>
            <div className="log-id">
              SIG: {entry.signature_id}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
