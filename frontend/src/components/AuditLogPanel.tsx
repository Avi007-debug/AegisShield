import { useAuditLog } from '@/hooks/useApi'
import { ScrollText, Loader2, AlertTriangle, CheckCircle } from 'lucide-react'

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
        {data?.log.map((entry, i) => {
          const isFlagged = entry.status === 'FLAGGED'
          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-muted/20 p-3 transition-colors hover:border-border/80 hover:bg-muted/40"
            >
              {/* Row 1: timestamp + status badge */}
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
                {isFlagged ? (
                  <span className="flex items-center gap-1 rounded-full bg-threat/10 px-2 py-px font-mono text-[9px] font-semibold text-threat">
                    <AlertTriangle className="h-2.5 w-2.5" /> FLAGGED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-safe/10 px-2 py-px font-mono text-[9px] font-semibold text-safe">
                    <CheckCircle className="h-2.5 w-2.5" /> COMPLIANT
                  </span>
                )}
              </div>

              {/* Row 2: action description */}
              <p className="mb-1.5 font-mono text-xs text-foreground">
                {entry.action}
              </p>

              {/* Row 3: regulatory metadata */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground">
                <span>
                  Order&nbsp;<span className="text-foreground">{entry.regulatory_order_id}</span>
                </span>
                <span className="ml-auto">
                  Ref&nbsp;<span className="text-foreground">{entry.compliance_ref}</span>
                </span>
              </div>
            </div>
          )
        })}

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
