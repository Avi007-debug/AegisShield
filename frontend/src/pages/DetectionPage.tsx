import { Shield, Crosshair } from 'lucide-react'
import { DetectionPanel } from '@/components/DetectionPanel'
import { PropagationGraph } from '@/components/graph/PropagationGraph'
import { RevealOnScroll } from '@/components/RevealOnScroll'

export function DetectionPage() {
  return (
    <main className="page-content mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 animate-slide-up">
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
          Content Analysis
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Content Detection
          </h1>
        </div>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Classify text or images to detect misinformation. Run full analysis to generate propagation graphs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        <RevealOnScroll delay={50}>
          <div className="card-glass rounded-2xl p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
              <Crosshair className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                Classification Engine
              </span>
            </div>
            <DetectionPanel />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={140} direction="right">
          <div className="h-[550px] lg:h-full lg:min-h-[550px]">
            <PropagationGraph />
          </div>
        </RevealOnScroll>
      </div>
    </main>
  )
}
