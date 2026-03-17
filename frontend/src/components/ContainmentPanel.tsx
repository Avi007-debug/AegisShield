import { useState } from 'react'
import { useContain, useGraph, useContainmentResult, useHealth } from '@/hooks/useApi'
import { ShieldAlert, Loader2, CheckCircle, Zap, Wifi, WifiOff } from 'lucide-react'

export function ContainmentPanel() {
  const { data: graph } = useGraph()
  const { data: lastResult } = useContainmentResult()
  const { data: health } = useHealth()
  const contain = useContain()
  const [nodeId, setNodeId] = useState('')

  const handleContain = async () => {
    const id = nodeId ? Number(nodeId) : graph?.superspreader_id
    if (!id) return
    try {
      await contain.mutateAsync(id)
      setNodeId('') // Clear input on success
    } catch (err) {
      console.error('Containment failed:', err)
    }
  }

  const isExecuting = contain.isPending
  const isError = contain.isError

  return (
    <div className="card-glass rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
        <ShieldAlert className="h-4 w-4 text-threat" />
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
          Containment Control
        </span>
        <div className="ml-auto flex items-center gap-2">
          {health ? (
            <span title="API Connected">
              <Wifi className="h-3 w-3 text-safe opacity-50" />
            </span>
          ) : (
            <span title="API Disconnected">
              <WifiOff className="h-3 w-3 text-threat animate-pulse" />
            </span>
          )}
          {graph?.superspreader_id && (
            <span className="rounded-full border border-threat/25 bg-threat/10 px-2 py-0.5 font-mono text-[9px] text-threat">
              SS #{graph.superspreader_id}
            </span>
          )}
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <input
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          placeholder={`Node ID (default: ${graph?.superspreader_id ?? '?'})`}
          className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <button
          onClick={handleContain}
          disabled={isExecuting}
          className="flex items-center gap-1.5 rounded-lg bg-threat px-4 py-2 font-mono text-xs font-semibold text-white shadow-lg shadow-threat/20 transition-all hover:-translate-y-0.5 hover:shadow-threat/40 active:scale-[0.97] disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
        >
          {isExecuting
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Zap className="h-3.5 w-3.5" />
          }
          Execute
        </button>
      </div>

      {isError && (
        <p className="mb-4 font-mono text-[10px] text-threat animate-shake">
          Error: Connection failed. Ensure backend is running.
        </p>
      )}

      {!lastResult && !isExecuting && !isError && (
        <p className="mb-4 text-xs text-muted-foreground">
          Identify a threat node and execute containment to isolate it from the network.
        </p>
      )}

      {lastResult && (
        <div className="relative overflow-hidden rounded-xl border border-safe/25 bg-safe/5 p-3 animate-slide-up">
          {/* Ripple rings */}
          <div className="pointer-events-none absolute inset-0 rounded-xl border border-safe/50 animate-ripple-ring" />
          <div
            className="pointer-events-none absolute inset-0 rounded-xl border border-safe/30 animate-ripple-ring"
            style={{ animationDelay: '0.18s' }}
          />

          <div className="relative">
            <div className="mb-3 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-safe" />
              <span className="font-mono text-xs font-semibold text-safe">Containment Successful</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-background/50 px-3 py-2.5 text-center">
                <p className="font-display text-xl font-bold text-foreground">{lastResult.cut_edges?.length ?? 0}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Edges Severed</p>
              </div>
              <div className="rounded-lg bg-background/50 px-3 py-2.5 text-center">
                <p className="font-display text-xl font-bold text-safe">{lastResult.reach_reduction_pct?.toFixed(1)}%</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Reach Reduction</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
