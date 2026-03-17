import { useThreatScores, useContain } from '@/hooks/useApi'
import { Loader2, Zap, Shield } from 'lucide-react'

export function SuperSpreaderTable() {
  const { data, isLoading } = useThreatScores()
  const contain = useContain()

  if (isLoading) return <div className="flex h-32 items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
  if (!data) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-mono text-xs">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="px-3 py-2">Rank</th>
            <th className="px-3 py-2">Node</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Threat</th>
            <th className="px-3 py-2">BC</th>
            <th className="px-3 py-2">PR</th>
            <th className="px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.scores.slice(0, 15).map((s) => (
            <tr key={s.node_id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
              <td className="px-3 py-2 text-muted-foreground">#{s.rank}</td>
              <td className="px-3 py-2 font-semibold text-foreground">{s.node_id}</td>
              <td className="px-3 py-2">
                <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ${
                  s.type === 'superspreader' ? 'bg-threat/20 text-threat' :
                  s.type === 'bot' ? 'bg-warning/20 text-warning' :
                  'bg-info/20 text-info'
                }`}>
                  {s.type === 'superspreader' && <Zap className="h-2.5 w-2.5" />}
                  {s.type}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-16 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-threat" style={{ width: `${s.threat_score * 100}%` }} />
                  </div>
                  <span className="text-threat">{(s.threat_score * 100).toFixed(0)}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-muted-foreground">{s.bc_score.toFixed(3)}</td>
              <td className="px-3 py-2 text-muted-foreground">{s.pr_score.toFixed(4)}</td>
              <td className="px-3 py-2">
                {s.type === 'superspreader' && (
                  <button
                    onClick={() => contain.mutate(s.node_id)}
                    disabled={contain.isPending}
                    className="flex items-center gap-1 rounded bg-threat/20 px-2 py-1 text-[10px] text-threat transition-colors hover:bg-threat/30"
                  >
                    <Shield className="h-2.5 w-2.5" /> Contain
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
