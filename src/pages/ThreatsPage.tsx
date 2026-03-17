import { BarChart3, ShieldAlert } from 'lucide-react'
import { SuperSpreaderTable } from '@/components/SuperSpreaderTable'
import { ContainmentPanel } from '@/components/ContainmentPanel'
import { AlertsPanel } from '@/components/AlertsPanel'

export function ThreatsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-threat/10 ring-1 ring-threat/20">
            <ShieldAlert className="h-4 w-4 text-threat" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Threat Intelligence</h1>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Real-time threat scoring, super-spreader rankings, and containment controls.
        </p>
      </div>

      {/* Threat Table */}
      <div className="card-glass mb-6 rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-threat" />
          <span className="font-mono text-xs font-semibold text-foreground">THREAT RANKING</span>
        </div>
        <SuperSpreaderTable />
      </div>

      {/* Containment + Alerts */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <ContainmentPanel />
        <AlertsPanel />
      </div>
    </main>
  )
}
