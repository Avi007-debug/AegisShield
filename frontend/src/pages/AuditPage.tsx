import { ScrollText } from 'lucide-react'
import { AuditLogPanel } from '@/components/AuditLogPanel'
import { AlertsPanel } from '@/components/AlertsPanel'
import { RevealOnScroll } from '@/components/RevealOnScroll'

export function AuditPage() {
  return (
    <main className="page-content mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 animate-slide-up">
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-safe">
          Regulatory Compliance
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-safe/10 ring-1 ring-safe/20">
            <ScrollText className="h-5 w-5 text-safe" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Audit &amp; Compliance
          </h1>
        </div>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Complete audit trail for all containment actions and regulatory compliance reporting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <RevealOnScroll delay={60}>
          <AuditLogPanel />
        </RevealOnScroll>
        <RevealOnScroll delay={150} direction="right">
          <AlertsPanel />
        </RevealOnScroll>
      </div>
    </main>
  )
}
