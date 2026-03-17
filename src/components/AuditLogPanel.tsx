import { useAuditLog } from '@/hooks/useApi'
import { ScrollText, Loader2, CheckCircle, XCircle } from 'lucide-react'

export function AuditLogPanel() {
  const { data, isLoading } = useAuditLog()

  return (
    <div className="card-glass rounded-xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <ScrollText className="h-4 w-4 text-primary" />
        <span className="font-mono text-xs font-semibold text-foreground">AUDIT LOG</span>
      </div>

      {isLoading && <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>}

      <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
        {data?.log.map((entry, i) => (
          <div key={i} className="rounded border border-border bg-muted/30 p-2.5 font-mono text-[11px]">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</span>
              {entry.approved ? (
                <span className="flex items-center gap-1 text-safe"><CheckCircle className="h-3 w-3" /> Approved</span>
              ) : (
                <span className="flex items-center gap-1 text-threat"><XCircle className="h-3 w-3" /> Denied</span>
              )}
            </div>
            <p className="text-foreground">{entry.action.replace(/_/g, ' ')}</p>
            <div className="mt-1 flex gap-3 text-muted-foreground">
              <span>Node: #{entry.node_id}</span>
              <span>Operator: {entry.operator}</span>
              <span>Reduction: <span className="text-safe">{entry.reach_reduction_pct}%</span></span>
            </div>
          </div>
        ))}
        {data?.log.length === 0 && (
          <p className="py-4 text-center font-mono text-xs text-muted-foreground">No audit entries</p>
        )}
      </div>
    </div>
  )
}
