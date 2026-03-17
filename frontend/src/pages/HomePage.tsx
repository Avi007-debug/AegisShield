import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Search, Network, BarChart3, AlertTriangle, ScrollText,
  ArrowRight, Zap, Globe, Lock, TrendingUp,
} from 'lucide-react'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useCountUp } from '@/hooks/useCountUp'
import { useIntersection } from '@/hooks/useIntersection'
import { RevealOnScroll } from '@/components/RevealOnScroll'

const features = [
  {
    icon: Search, num: '01', title: 'Content Detection', link: '/detection',
    color: 'text-primary', bg: 'bg-primary/10', ring: 'ring-primary/20',
    description: 'AI-powered classification of misinformation using NLP models and OCR pipelines — real-time confidence scoring on any media.',
  },
  {
    icon: Network, num: '02', title: 'Propagation Analysis', link: '/analytics',
    color: 'text-info', bg: 'bg-info/10', ring: 'ring-info/20',
    description: 'Interactive Barabási–Albert network graph visualises how false information cascades across nodes and clusters.',
  },
  {
    icon: BarChart3, num: '03', title: 'Threat Intelligence', link: '/threats',
    color: 'text-threat', bg: 'bg-threat/10', ring: 'ring-threat/20',
    description: 'PageRank and betweenness-centrality scores surface the highest-risk super-spreaders before they reach critical mass.',
  },
  {
    icon: ScrollText, num: '04', title: 'Audit & Compliance', link: '/audit',
    color: 'text-safe', bg: 'bg-safe/10', ring: 'ring-safe/20',
    description: 'Every containment action is logged with operator, timestamp, and reach-reduction metrics — fully exportable.',
  },
]

const rawStats = [
  { label: 'Detection Accuracy', raw: '97.3%', icon: Zap,   delta: '+2.1%' },
  { label: 'Nodes Monitored',    raw: '50+',   icon: Globe,  delta: 'Active' },
  { label: 'Threat Models',      raw: '3',     icon: Shield, delta: 'Deployed' },
  { label: 'Compliance',         raw: '100%',  icon: Lock,   delta: 'Certified' },
]

const steps = [
  {
    step: '01', icon: Search, accent: 'text-primary', title: 'Ingest & Classify',
    desc: 'Submit text or images. NLP models classify content with confidence scores in under 200 ms.',
  },
  {
    step: '02', icon: Network, accent: 'text-info', title: 'Map Propagation',
    desc: 'Visualise information spread across the BA network. Identify super-spreader nodes and coordinated bot clusters.',
  },
  {
    step: '03', icon: Shield, accent: 'text-safe', title: 'Contain & Report',
    desc: 'Execute surgical graph-edge removal on threat nodes. Full audit trail generated automatically.',
  },
]

/* Parses "97.3%" → { target: 97.3, suffix: '%', decimal: true } */
function parseStatValue(raw: string) {
  const m = raw.match(/^([\d.]+)(.*)$/)
  if (!m) return { target: 0, suffix: raw, decimal: false }
  return { target: parseFloat(m[1]), suffix: m[2], decimal: m[1].includes('.') }
}

function StatNumber({ raw, active }: { raw: string; active: boolean }) {
  const { target, suffix, decimal } = parseStatValue(raw)
  const val = useCountUp(target, 1400, active)
  return (
    <>{active ? (decimal ? val.toFixed(1) : Math.round(val)) : (decimal ? target.toFixed(1) : target)}{suffix}</>
  )
}

export function HomePage() {
  const { displayed: typedWord, done: typingDone } = useTypewriter('Misinformation', 52, 650)
  const { ref: statsRef, isVisible: statsVisible } = useIntersection()

  return (
    <div className="page-content">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-primary/6 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-[400px] w-[500px] rounded-full bg-info/4 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-24 md:pb-36 md:pt-32">
          <div className="mx-auto max-w-3xl text-center animate-slide-up">

            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[10px] font-semibold tracking-widest text-primary">
                REGULATORY DEFENSE PLATFORM
              </span>
            </div>

            <h1 className="font-display mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl">
              Detect &amp; Contain{' '}
              <span className="text-gradient">
                {typedWord}
                {!typingDone && (
                  <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-primary align-bottom">&nbsp;</span>
                )}
              </span>{' '}
              at Scale
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              AI-powered propagation analysis, real-time threat scoring, and surgical
              containment — built for information integrity.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/detection"
                className="group flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 font-mono text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-200 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/analytics"
                className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/60 px-8 py-3.5 font-mono text-sm font-semibold text-secondary-foreground transition-all duration-200 hover:border-primary/30 hover:bg-secondary active:scale-[0.97]"
              >
                <Network className="h-4 w-4" />
                View Network
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div
        ref={statsRef as React.RefObject<HTMLDivElement>}
        className="border-y border-border bg-card/40"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {rawStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center px-6 py-10 text-center transition-all duration-300 hover:bg-primary/3 ${
                i < rawStats.length - 1 ? 'border-r border-border' : ''
              }`}
              style={{
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'none' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`,
              }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="font-display mb-0.5 text-3xl font-bold tabular-nums text-foreground">
                <StatNumber raw={stat.raw} active={statsVisible} />
              </p>
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-safe/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-safe">
                <TrendingUp className="h-2.5 w-2.5" />
                {stat.delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <RevealOnScroll className="mb-16 text-center">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">Capabilities</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">Platform Overview</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            End-to-end misinformation defense from detection through containment.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map((f, i) => (
            <RevealOnScroll key={f.title} delay={i * 90}>
              <Link to={f.link} className="card-glass-hover group relative overflow-hidden rounded-2xl p-7 block">
                <span className="pointer-events-none absolute right-5 top-4 font-display text-7xl font-bold text-foreground/[0.03] select-none">
                  {f.num}
                </span>
                <div className="relative">
                  <div className="mb-5 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} ring-1 ${f.ring}`}>
                      <f.icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground">{f.title}</h3>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground/40 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section className="border-t border-border bg-gradient-to-b from-card/30 to-transparent px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll className="mb-16 text-center">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">Workflow</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">How It Works</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
              From content ingestion to surgical containment in seconds.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <RevealOnScroll key={s.step} delay={i * 100}>
                <div className="card-glass rounded-2xl p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <span className={`rounded-lg border border-current/25 px-2 py-1 font-mono text-xs font-bold ${s.accent}`}>
                      {s.step}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background ring-1 ring-border">
                      <s.icon className={`h-4 w-4 ${s.accent}`} />
                    </div>
                  </div>
                  <h3 className="font-display mb-2 text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-card/50 p-12 text-center md:p-20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-info/4" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 ring-1 ring-warning/30">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <h2 className="font-display mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Ready to Defend Against Misinformation?
              </h2>
              <p className="mx-auto mb-10 max-w-lg text-sm text-muted-foreground md:text-base">
                Analyze suspicious content and map propagation networks in real time.
              </p>
              <Link
                to="/detection"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-primary px-9 py-4 font-mono text-sm font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary/50 active:scale-[0.97]"
              >
                Launch Platform
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  )
}
