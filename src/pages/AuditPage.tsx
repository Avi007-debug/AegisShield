import { ScrollText } from 'lucide-react'
import { AuditLogPanel } from '@/components/AuditLogPanel'
import { AlertsPanel } from '@/components/AlertsPanel'

export function AuditPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-safe/10 ring-1 ring-safe/20">
            <ScrollText className="h-4 w-4 text-safe" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Audit & Compliance</h1>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Complete audit trail for all containment actions and regulatory compliance reporting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* Audit Log - expanded */}
        <AuditLogPanel />

        {/* Alerts sidebar */}
        <AlertsPanel />
      </div>
    </main>
  )
}
