import { BarChart3, Network, Shield } from 'lucide-react'
import { TopSpreadersChart } from '@/components/charts/TopSpreadersChart'
import { ClusterDonutChart } from '@/components/charts/ClusterDonutChart'
import { ContainmentChart } from '@/components/charts/ContainmentChart'
import { PropagationGraph } from '@/components/graph/PropagationGraph'
import { RevealOnScroll } from '@/components/RevealOnScroll'

export function AnalyticsPage() {
  return (
    <main className="page-content mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 animate-slide-up">
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-info">
          Network Intelligence
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 ring-1 ring-info/20">
            <BarChart3 className="h-5 w-5 text-info" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Analytics Dashboard
          </h1>
        </div>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Propagation network visualization, cluster analysis, and containment impact metrics.
        </p>
      </div>

      <RevealOnScroll delay={60}>
        <div className="mb-6 h-[450px]">
          <PropagationGraph />
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          { icon: BarChart3, color: 'text-primary', label: 'Top Spreaders',        Chart: TopSpreadersChart },
          { icon: Network,   color: 'text-info',    label: 'Cluster Distribution', Chart: ClusterDonutChart },
          { icon: Shield,    color: 'text-safe',    label: 'Containment Impact',   Chart: ContainmentChart  },
        ].map(({ icon: Icon, color, label, Chart }, i) => (
          <RevealOnScroll key={label} delay={80 + i * 80}>
            <div className="card-glass rounded-2xl p-5">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">{label}</span>
              </div>
              <div className="h-56">
                <Chart />
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </main>
  )
}
