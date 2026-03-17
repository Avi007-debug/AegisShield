import { Link } from 'react-router-dom'
import {
  Shield,
  Search,
  Network,
  BarChart3,
  AlertTriangle,
  ScrollText,
  ArrowRight,
  Zap,
  Globe,
  Lock,
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Content Detection',
    description: 'AI-powered classification of misinformation with NLP and OCR capabilities.',
    link: '/detection',
    color: 'text-primary',
    bg: 'bg-primary/10',
    ring: 'ring-primary/20',
  },
  {
    icon: Network,
    title: 'Propagation Analysis',
    description: 'Interactive network graph visualization of information spread patterns.',
    link: '/analytics',
    color: 'text-info',
    bg: 'bg-info/10',
    ring: 'ring-info/20',
  },
  {
    icon: BarChart3,
    title: 'Threat Intelligence',
    description: 'Real-time threat scoring and super-spreader identification rankings.',
    link: '/threats',
    color: 'text-threat',
    bg: 'bg-threat/10',
    ring: 'ring-threat/20',
  },
  {
    icon: ScrollText,
    title: 'Audit & Compliance',
    description: 'Complete regulatory audit trail with containment action logging.',
    link: '/audit',
    color: 'text-safe',
    bg: 'bg-safe/10',
    ring: 'ring-safe/20',
  },
]

const stats = [
  { label: 'Detection Accuracy', value: '97.3%', icon: Zap },
  { label: 'Nodes Monitored', value: '50+', icon: Globe },
  { label: 'Threat Models', value: '3', icon: Shield },
  { label: 'Compliance', value: '100%', icon: Lock },
]

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        {/* Radial glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 ring-1 ring-primary/20">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[11px] font-semibold text-primary">REGULATORY DEFENSE PLATFORM</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              Detect & Contain{' '}
              <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                Misinformation
              </span>{' '}
              at Scale
            </h1>

            <p className="mx-auto mb-10 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground md:text-base">
              AI-powered propagation analysis, real-time threat scoring, and surgical containment 
              for protecting information integrity.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/detection"
                className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-mono text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/analytics"
                className="flex items-center gap-2 rounded-xl bg-secondary px-8 py-3.5 font-mono text-sm font-semibold text-secondary-foreground ring-1 ring-border transition-all hover:bg-muted"
              >
                <Network className="h-4 w-4" />
                View Network
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center">
              <stat.icon className="mx-auto mb-3 h-5 w-5 text-primary" />
              <p className="mb-1 font-mono text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Platform Capabilities</h2>
          <p className="mx-auto max-w-lg font-mono text-sm text-muted-foreground">
            End-to-end misinformation defense from detection to containment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group card-glass rounded-2xl p-6 transition-all hover:ring-1 hover:ring-primary/20"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} ring-1 ${f.ring}`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-mono text-sm font-semibold text-foreground">{f.title}</h3>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card/20 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">How It Works</h2>
            <p className="mx-auto max-w-lg font-mono text-sm text-muted-foreground">
              From content ingestion to surgical containment in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Ingest & Classify',
                desc: 'Submit text or images. AI models classify content as real or fake with confidence scores.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Map Propagation',
                desc: 'Analyze information spread through network graph. Identify super-spreaders and bot clusters.',
                icon: Network,
              },
              {
                step: '03',
                title: 'Contain & Report',
                desc: 'Execute surgical containment on threat nodes. Full audit trail for regulatory compliance.',
                icon: Shield,
              },
            ].map((s) => (
              <div key={s.step} className="card-glass rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-2xl font-bold text-primary/30">{s.step}</span>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-mono text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="card-glass relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-info/5" />
          <div className="relative">
            <AlertTriangle className="mx-auto mb-5 h-8 w-8 text-warning" />
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              Ready to Defend Against Misinformation?
            </h2>
            <p className="mx-auto mb-8 max-w-lg font-mono text-sm text-muted-foreground">
              Start analyzing suspicious content and mapping propagation networks now.
            </p>
            <Link
              to="/detection"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-mono text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              Launch Platform
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
