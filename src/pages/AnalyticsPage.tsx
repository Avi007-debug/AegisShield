import { BarChart3, Network, Shield } from 'lucide-react'
import { TopSpreadersChart } from '@/components/charts/TopSpreadersChart'
import { ClusterDonutChart } from '@/components/charts/ClusterDonutChart'
import { ContainmentChart } from '@/components/charts/ContainmentChart'
import { PropagationGraph } from '@/components/graph/PropagationGraph'

export function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 ring-1 ring-info/20">
            <BarChart3 className="h-4 w-4 text-info" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Analytics Dashboard</h1>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Propagation network visualization and cluster analysis insights.
        </p>
      </div>

      {/* Graph */}
      <div className="mb-6 h-[450px]">
        <PropagationGraph />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="card-glass rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs font-semibold text-foreground">TOP SPREADERS</span>
          </div>
          <div className="h-56">
            <TopSpreadersChart />
          </div>
        </div>

        <div className="card-glass rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs font-semibold text-foreground">CLUSTER DISTRIBUTION</span>
          </div>
          <div className="h-56">
            <ClusterDonutChart />
          </div>
        </div>

        <div className="card-glass rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-safe" />
            <span className="font-mono text-xs font-semibold text-foreground">CONTAINMENT IMPACT</span>
          </div>
          <div className="h-56">
            <ContainmentChart />
          </div>
        </div>
      </div>
    </main>
  )
}
