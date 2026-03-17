import { useState } from 'react'
import { useContain, useGraph } from '@/hooks/useApi'
import { ShieldAlert, Loader2, CheckCircle } from 'lucide-react'
import type { ContainmentResult } from '@/types'

export function ContainmentPanel() {
  const { data: graph } = useGraph()
  const contain = useContain()
  const [nodeId, setNodeId] = useState('')
  const [lastResult, setLastResult] = useState<ContainmentResult | null>(null)

  const handleContain = async () => {
    const id = nodeId ? Number(nodeId) : graph?.superspreader_id
    if (!id) return
    const res = await contain.mutateAsync(id)
    setLastResult(res)
  }

  return (
    <div className="card-glass space-y-3 rounded-xl p-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-threat" />
        <span className="font-mono text-xs font-semibold text-foreground">CONTAINMENT</span>
      </div>

      <div className="flex gap-2">
        <input
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          placeholder={`Node ID (default: ${graph?.superspreader_id || '?'})`}
          className="flex-1 rounded border border-border bg-muted px-2 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleContain}
          disabled={contain.isPending}
          className="flex items-center gap-1.5 rounded bg-threat px-3 py-1.5 font-mono text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {contain.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldAlert className="h-3 w-3" />}
          Execute
        </button>
      </div>

      {lastResult && (
        <div className="rounded border border-safe/30 bg-safe/5 p-3 font-mono text-[10px]">
          <div className="mb-1 flex items-center gap-1 text-safe">
            <CheckCircle className="h-3 w-3" /> Containment Successful
          </div>
          <div className="grid grid-cols-2 gap-1 text-muted-foreground">
            <span>Edges removed: <span className="text-foreground">{lastResult.edges_removed}</span></span>
            <span>Reach reduction: <span className="text-safe">{lastResult.reduction_pct?.toFixed(1)}%</span></span>
          </div>
        </div>
      )}
    </div>
  )
}
