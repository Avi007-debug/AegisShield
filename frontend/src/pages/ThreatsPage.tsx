import { BarChart3, ShieldAlert } from 'lucide-react'
import { SuperSpreaderTable } from '@/components/SuperSpreaderTable'
import { ContainmentPanel } from '@/components/ContainmentPanel'
import { AlertsPanel } from '@/components/AlertsPanel'
import { RevealOnScroll } from '@/components/RevealOnScroll'

export function ThreatsPage() {
  return (
    <main className="page-content mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 animate-slide-up">
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-threat">
          Threat Operations
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-threat/10 ring-1 ring-threat/20">
            <ShieldAlert className="h-5 w-5 text-threat" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Threat Intelligence
          </h1>
        </div>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Real-time threat scoring, super-spreader rankings, and containment controls.
        </p>
      </div>

      <RevealOnScroll delay={60}>
        <div className="card-glass mb-6 rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <BarChart3 className="h-4 w-4 text-threat" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Threat Ranking
            </span>
          </div>
          <SuperSpreaderTable />
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <RevealOnScroll delay={80}>
          <ContainmentPanel />
        </RevealOnScroll>
        <RevealOnScroll delay={160}>
          <AlertsPanel />
        </RevealOnScroll>
      </div>
    </main>
  )
}
