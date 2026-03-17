import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="font-mono text-sm font-bold tracking-wider text-foreground">
                AEGIS<span className="text-primary">SHIELD</span>
              </span>
            </div>
            <p className="max-w-sm font-mono text-xs leading-relaxed text-muted-foreground">
              AI-powered misinformation detection and propagation analysis platform. 
              Protecting information integrity at scale.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-mono text-xs font-semibold uppercase text-foreground">Platform</h4>
            <div className="flex flex-col gap-2">
              {['Detection', 'Analytics', 'Threats', 'Audit'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-mono text-xs font-semibold uppercase text-foreground">Resources</h4>
            <div className="flex flex-col gap-2">
              {['Documentation', 'API Reference', 'Status', 'Support'].map((item) => (
                <span key={item} className="font-mono text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} AegisShield. All rights reserved. Built for regulatory defense.
          </p>
        </div>
      </div>
    </footer>
  )
}
