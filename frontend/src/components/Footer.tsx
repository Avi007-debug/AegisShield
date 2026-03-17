import { Shield, Github, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-mono text-sm font-bold tracking-widest text-foreground">
                  AEGIS<span className="text-primary">SHIELD</span>
                </span>
                <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60">DEFENSE PLATFORM</span>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered misinformation detection and propagation analysis platform.
              Protecting information integrity at scale.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-safe" />
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">All systems operational</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground">
              Platform
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Detection', path: '/detection' },
                { label: 'Analytics', path: '/analytics' },
                { label: 'Threats',   path: '/threats'   },
                { label: 'Audit',     path: '/audit'     },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground">
              Resources
            </h4>
            <div className="flex flex-col gap-2.5">
              {['Documentation', 'API Reference', 'Status', 'Support'].map((item) => (
                <span key={item} className="text-sm text-muted-foreground/60">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} AegisShield. Built for regulatory defense.
          </p>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-secondary px-2.5 py-1 font-mono text-[9px] text-muted-foreground">
              v2.1.0
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">BA Graph Engine</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
