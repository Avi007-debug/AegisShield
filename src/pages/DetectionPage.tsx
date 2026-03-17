import { Shield, Crosshair } from 'lucide-react'
import { DetectionPanel } from '@/components/DetectionPanel'
import { PropagationGraph } from '@/components/graph/PropagationGraph'

export function DetectionPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Content Detection</h1>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Classify text or images to detect misinformation. Run full analysis to generate propagation graphs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        {/* Detection Panel */}
        <div className="card-glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs font-semibold text-foreground">CONTENT ANALYSIS</span>
          </div>
          <DetectionPanel />
        </div>

        {/* Propagation Graph */}
        <div className="h-[550px] lg:h-auto lg:min-h-[550px]">
          <PropagationGraph />
        </div>
      </div>
    </main>
  )
}
