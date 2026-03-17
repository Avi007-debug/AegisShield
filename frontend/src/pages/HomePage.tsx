import { useRef, useState, useCallback, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Network, BarChart3, AlertTriangle, ScrollText,
  ArrowRight, Zap, Globe, Lock, TrendingUp, Radar, ShieldCheck, Activity, Sparkles,
} from 'lucide-react'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useCountUp } from '@/hooks/useCountUp'
import { useIntersection } from '@/hooks/useIntersection'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { LogoMark } from '@/components/LogoMark'
import { PageBackground } from '@/components/PageBackground'
import { useGraph } from '@/hooks/useApi'

const features = [
  {
    icon: Search, num: '01', title: 'Content Analysis', link: '/detection',
    color: 'text-primary', bg: 'bg-primary/10', ring: 'ring-primary/20',
    description: 'AI-powered detection of coordinated inorganic activity using NLP models and OCR pipelines — real-time confidence scoring on any content.',
  },
  {
    icon: Network, num: '02', title: 'Propagation Analysis', link: '/analytics',
    color: 'text-info', bg: 'bg-info/10', ring: 'ring-info/20',
    description: 'Interactive Barabási–Albert network graph visualises how content spreads across nodes — pinpointing Patient Zero and superspreader clusters.',
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
  { label: 'Source Accuracy',  raw: '97.3%', icon: Zap,      delta: '+2.1%' },
  { label: 'Nodes Monitored',  raw: '50+',   icon: Globe,    delta: 'Active' },
  { label: 'Threat Models',    raw: '3',     icon: LogoMark, delta: 'Deployed' },
  { label: 'Compliance',       raw: '100%',  icon: Lock,     delta: 'Certified' },
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
    step: '03', icon: LogoMark, accent: 'text-safe', title: 'Contain & Report',
    desc: 'Execute surgical graph-edge removal on threat nodes. Full audit trail generated automatically.',
  },
]

const liveSignals = [
  {
    title: 'Realtime Threat Pulse',
    value: '92.4',
    unit: 'Trust Score',
    trend: '+4.2%',
    icon: Activity,
    color: 'text-primary',
    glow: 'shadow-primary/20',
  },
  {
    title: 'Cross-Platform Reach',
    value: '1.8M',
    unit: 'Nodes / day',
    trend: 'Live',
    icon: Globe,
    color: 'text-info',
    glow: 'shadow-info/20',
  },
  {
    title: 'Containment Effect',
    value: '73%',
    unit: 'Spread Reduced',
    trend: '+11%',
    icon: ShieldCheck,
    color: 'text-safe',
    glow: 'shadow-safe/20',
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

/* ── 3D tilt card ─────────────────────────────────────────────── */
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5   // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    setStyle({
      transform: `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale3d(1.015,1.015,1.015)`,
    })
  }, [])

  const handleLeave = useCallback(() => {
    setStyle({ transform: 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)' })
  }, [])

  return (
    <div
      ref={ref}
      className={`tilt-card ${className ?? ''}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}

function SpotlightSurface({
  children,
  className = '',
  glow = 'primary',
}: {
  children: ReactNode
  className?: string
  glow?: 'primary' | 'info' | 'warning'
}) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false })

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const finePointer = window.matchMedia('(pointer:fine)').matches
    if (!finePointer || window.innerWidth < 1024) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x, y, active: true })
  }, [])

  const handleLeave = useCallback(() => {
    setSpotlight((prev) => ({ ...prev, active: false }))
  }, [])

  const backgroundByGlow = {
    primary: `radial-gradient(300px circle at ${spotlight.x}% ${spotlight.y}%, hsl(var(--primary) / 0.2) 0%, hsl(var(--info) / 0.1) 22%, transparent 62%), radial-gradient(80px circle at ${spotlight.x}% ${spotlight.y}%, hsl(var(--foreground) / 0.08) 0%, transparent 72%)`,
    info: `radial-gradient(300px circle at ${spotlight.x}% ${spotlight.y}%, hsl(var(--info) / 0.2) 0%, hsl(var(--primary) / 0.09) 22%, transparent 62%), radial-gradient(80px circle at ${spotlight.x}% ${spotlight.y}%, hsl(var(--foreground) / 0.08) 0%, transparent 72%)`,
    warning: `radial-gradient(300px circle at ${spotlight.x}% ${spotlight.y}%, hsl(var(--warning) / 0.18) 0%, hsl(var(--primary) / 0.08) 22%, transparent 62%), radial-gradient(80px circle at ${spotlight.x}% ${spotlight.y}%, hsl(var(--foreground) / 0.07) 0%, transparent 72%)`,
  } as const

  const ambientByGlow = {
    primary: 'radial-gradient(60% 60% at 8% 18%, hsl(var(--primary) / 0.12) 0%, transparent 70%), radial-gradient(48% 42% at 92% 84%, hsl(var(--info) / 0.1) 0%, transparent 74%), linear-gradient(180deg, hsl(var(--card) / 0.3) 0%, hsl(var(--background) / 0.18) 100%)',
    info: 'radial-gradient(56% 56% at 12% 20%, hsl(var(--info) / 0.13) 0%, transparent 70%), radial-gradient(50% 40% at 92% 82%, hsl(var(--primary) / 0.1) 0%, transparent 74%), linear-gradient(180deg, hsl(var(--card) / 0.28) 0%, hsl(var(--background) / 0.18) 100%)',
    warning: 'radial-gradient(56% 56% at 10% 16%, hsl(var(--warning) / 0.1) 0%, transparent 68%), radial-gradient(48% 40% at 92% 84%, hsl(var(--primary) / 0.09) 0%, transparent 74%), linear-gradient(180deg, hsl(var(--card) / 0.32) 0%, hsl(var(--background) / 0.2) 100%)',
  } as const

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: ambientByGlow[glow] }}
      />
      <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-6 h-36 w-36 rounded-full bg-info/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          opacity: spotlight.active ? 0.88 : 0,
          transition: 'opacity 260ms ease',
          background: backgroundByGlow[glow],
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function HomePage() {
  const { data: graph } = useGraph()
  const { displayed: typedWord, done: typingDone } = useTypewriter('Superspreaders', 72, 650)
  const { ref: statsRef, isVisible: statsVisible } = useIntersection()

  const stats = [
    { label: 'Detection Accuracy', raw: '97.3%', icon: Zap, delta: '+2.1%' },
    { label: 'Nodes Monitored', raw: `${graph?.node_count ?? 0}+`, icon: Globe, delta: 'Active' },
    { label: 'Network Edges', raw: `${graph?.edge_count ?? 0}`, icon: Network, delta: 'Mapped' },
    { label: 'Compliance', raw: '100%', icon: Lock, delta: 'Certified' },
  ]

  return (
    <PageBackground image="/home.jpg" tone="primary" imageMode="hybrid" imageFixed animateImage={false} imagePosition="center top">
      <div className="page-content">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="section-mask-bottom relative overflow-hidden">
        {/* Hex grid overlay */}
        <div
          className="absolute inset-0 bg-hex-grid opacity-[0.03]"
        />
        {/* Square grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-primary/12 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-[400px] w-[500px] rounded-full bg-info/8 blur-[120px]" />
        {/* Floating accent orbs */}
        <div className="pointer-events-none absolute right-[10%] top-[20%] h-2 w-2 rounded-full bg-primary/40"
          style={{ animation: 'particle-drift 6s ease-in-out infinite' }} />
        <div className="pointer-events-none absolute left-[15%] top-[40%] h-1.5 w-1.5 rounded-full bg-info/40"
          style={{ animation: 'particle-drift 8s ease-in-out infinite 1.5s' }} />
        <div className="pointer-events-none absolute right-[22%] bottom-[20%] h-1 w-1 rounded-full bg-safe/50"
          style={{ animation: 'particle-drift 7s ease-in-out infinite 3s' }} />

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

            {/* Heading — typed word is forced to its own line */}
            <h1 className="font-display mb-6 text-[clamp(2.2rem,6vw,4.7rem)] font-bold leading-[1.04] tracking-[-0.02em] text-foreground">
              Track &amp; Contain
              <br />
              <span className="text-gradient">
                {typedWord}
                {!typingDone && (
                  <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-primary align-bottom">&nbsp;</span>
                )}
              </span>
              <br />
              <span className="text-foreground/80">at Scale</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-[clamp(0.95rem,1.6vw,1.15rem)] leading-relaxed text-muted-foreground">
              AI-powered propagation analysis, real-time threat scoring, and surgical
              containment — built for information integrity.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/detection"
                className="focus-glow interactive-cta group flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 font-mono text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-200 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/analytics"
                className="focus-glow interactive-cta flex items-center gap-2.5 rounded-xl border border-border bg-secondary/60 px-8 py-3.5 font-mono text-sm font-semibold text-secondary-foreground transition-all duration-200 hover:border-primary/30 hover:bg-secondary active:scale-[0.97]"
              >
                <Network className="h-4 w-4" />
                View Network
              </Link>
            </div>

            <RevealOnScroll delay={140} distance={16}>
              <div className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/35 px-4 py-2 backdrop-blur-sm">
                <Radar className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/70">
                  Live Monitoring Across 50+ High-Risk Nodes
                </span>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div
        ref={statsRef as RefObject<HTMLDivElement>}
        className="section-mask-top section-mask-bottom border-y border-border bg-gradient-to-b from-card/60 via-card/36 to-background/20"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center px-6 py-10 text-center transition-all duration-300 hover:bg-primary/3 ${i < stats.length - 1 ? 'border-r border-border' : ''
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
      <section className="section-mask-top mx-auto max-w-7xl px-6 py-20 md:py-28">
        <SpotlightSurface className="rounded-[2rem] border border-border/70 bg-card/[0.18] shadow-[0_0_0_1px_hsl(var(--primary)/0.06),0_30px_80px_-45px_hsl(var(--primary)/0.45)] px-5 py-8 md:px-7 md:py-10" glow="primary">
          <RevealOnScroll className="mb-16 text-center">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">Capabilities</p>
            <h2 className="font-display text-[clamp(1.9rem,3.6vw,2.7rem)] font-bold tracking-[-0.015em] text-foreground">Platform Overview</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
              End-to-end superspreader detection — from Patient Zero identification through surgical network containment.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {features.map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 90}>
                <TiltCard>
                  <Link to={f.link} className="focus-glow interactive-card card-glass-hover group relative block overflow-hidden rounded-2xl p-7">
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
                </TiltCard>
              </RevealOnScroll>
            ))}
          </div>
        </SpotlightSurface>
      </section>

      <div className="section-divider" />

      {/* ── Live Operations Strip ─────────────────────────────────── */}
      <section className="section-mask-top section-mask-bottom border-y border-border bg-gradient-to-b from-background/20 to-card/25 px-6 py-18 md:py-22">
        <SpotlightSurface className="mx-auto max-w-7xl rounded-[2rem] border border-border/60 bg-card/[0.12] shadow-[0_30px_80px_-48px_hsl(var(--info)/0.42)] px-4 py-5 md:px-5 md:py-6" glow="info">
          <RevealOnScroll className="mb-10 text-center">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-info">Realtime Command Surface</p>
            <h2 className="font-display text-[clamp(1.9rem,3.5vw,2.7rem)] font-bold tracking-[-0.015em] text-foreground">Live Operations Pulse</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
              Persistent telemetry cards show trust movement, network pressure, and containment performance as incidents unfold.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {liveSignals.map((signal, i) => (
              <RevealOnScroll key={signal.title} delay={i * 90} direction={i % 2 ? 'right' : 'up'} distance={20}>
                <div className={`interactive-card relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 shadow-2xl ${signal.glow}`}>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-info/5" />
                  <div className="relative">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 ring-1 ring-border">
                        <signal.icon className={`h-5 w-5 ${signal.color}`} />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {signal.trend}
                      </span>
                    </div>
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{signal.title}</p>
                    <p className="font-display text-4xl font-bold leading-none text-foreground">{signal.value}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{signal.unit}</p>
                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-background/70 ring-1 ring-border">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary via-info to-safe animate-signal-flow" style={{ width: `${65 + i * 12}%` }} />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </SpotlightSurface>
      </section>

      <div className="section-divider" />

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section className="section-mask-top section-mask-bottom border-t border-border bg-gradient-to-b from-card/30 to-transparent px-6 py-20 md:py-28">
        <SpotlightSurface className="mx-auto max-w-7xl rounded-[2rem] border border-border/55 bg-card/[0.1] shadow-[0_28px_72px_-50px_hsl(var(--safe)/0.35)] px-5 py-8 md:px-7 md:py-10" glow="primary">
          <RevealOnScroll className="mb-16 text-center">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary">Workflow</p>
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.7rem)] font-bold tracking-[-0.015em] text-foreground">How It Works</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
              From content ingestion to surgical containment in seconds.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <RevealOnScroll key={s.step} delay={i * 100}>
                <div className="interactive-card card-glass rounded-2xl p-7">
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
        </SpotlightSurface>
      </section>

      <div className="section-divider" />

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="section-mask-top mx-auto max-w-7xl px-6 py-20 md:py-24">
        <RevealOnScroll>
          <SpotlightSurface className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-card/50 shadow-[0_34px_90px_-54px_hsl(var(--warning)/0.46)]" glow="warning">
            <div className="relative overflow-hidden p-12 text-center md:p-20">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-info/4" />
              <div className="pointer-events-none absolute left-8 top-8 opacity-35">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
              <div
                className="absolute inset-0 bg-hex-grid opacity-[0.025]"
              />
              <div className="relative">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 ring-1 ring-warning/30">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <h2 className="font-display mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Ready to Detect Superspreaders and Patient Zero?
                </h2>
                <p className="mx-auto mb-10 max-w-lg text-sm text-muted-foreground md:text-base">
                  Trace content back to its origin, surface superspreader nodes, and contain threats in real time.
                </p>
                <Link
                  to="/detection"
                  className="focus-glow interactive-cta group inline-flex items-center gap-2.5 rounded-xl bg-primary px-9 py-4 font-mono text-sm font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary/50 active:scale-[0.97]"
                >
                  Launch Platform
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </SpotlightSurface>
        </RevealOnScroll>
      </section>
      </div>
    </PageBackground>
  )
}
