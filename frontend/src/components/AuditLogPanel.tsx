import { useAuditLog } from '@/hooks/useApi'
import { ScrollText, Loader2, CheckCircle, XCircle } from 'lucide-react'

export function AuditLogPanel() {
  const { data, isLoading } = useAuditLog()

  return (
    <div className="card-glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
        <ScrollText className="h-4 w-4 text-safe" />
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
          Audit Log
        </span>
        <span className="ml-auto rounded-full bg-safe/10 px-2 py-0.5 font-mono text-[9px] text-safe">
          {data?.log.length ?? 0} entries
        </span>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="font-mono text-xs text-muted-foreground">Loading audit trail...</span>
        </div>
      )}

      <div className="max-h-[460px] space-y-2 overflow-y-auto pr-1">
        {data?.log.map((entry, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-muted/20 p-3 transition-colors hover:border-border/80 hover:bg-muted/40"
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {new Date(entry.timestamp).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              {entry.approved ? (
                <span className="flex items-center gap-1 rounded-full bg-safe/10 px-2 py-px font-mono text-[9px] font-semibold text-safe">
                  <CheckCircle className="h-2.5 w-2.5" /> Approved
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-threat/10 px-2 py-px font-mono text-[9px] font-semibold text-threat">
                  <XCircle className="h-2.5 w-2.5" /> Denied
                </span>
              )}
            </div>
            <p className="mb-1.5 font-mono text-xs text-foreground">
              {entry.action.replace(/_/g, ' ')}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground">
              <span>Node <span className="text-foreground">#{entry.node_id}</span></span>
              <span>Op <span className="text-foreground">{entry.operator}</span></span>
              <span className="ml-auto">
                Δ reach <span className="font-semibold text-safe">{entry.reach_reduction_pct}%</span>
              </span>
            </div>
          </div>
        ))}

        {data?.log.length === 0 && (
          <div className="py-8 text-center">
            <ScrollText className="mx-auto mb-2 h-6 w-6 text-muted-foreground/30" />
            <p className="font-mono text-xs text-muted-foreground">No audit entries yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
