import React, { useState } from 'react'
import { Search, AlertTriangle, CheckCircle, Loader2, Sparkles } from 'lucide-react'
import { useAnalyze } from '@/hooks/useApi'
import type { AnalyzeResult } from '@/types'

export function DetectionPanel() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<AnalyzeResult | null>(null)

  const analyze = useAnalyze()
  const loading = analyze.isPending

  const handleAnalyze = async () => {
    if (!text.trim()) return
    const res = await analyze.mutateAsync({ text })
    setResult(res)
  }

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste suspicious content for analysis..."
          rows={5}
          className="w-full resize-none rounded-xl border border-border bg-muted/30 p-3.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors leading-relaxed"
        />
        {text && (
          <div className="absolute bottom-2.5 right-3 font-mono text-[9px] text-muted-foreground">
            {text.length} chars
          </div>
        )}
      </div>

      {/* Analysis Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-mono text-xs font-semibold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-accent/30 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        Analyze Content
      </button>

      {/* Result */}
      {result && <DetectionResult result={result} />}
    </div>
  )
}

function DetectionResult({ result }: { result: AnalyzeResult }) {
  const isFake = result.propagation.verdict === 'coordinated'
  const coordinationProb = result.propagation.coordination_prob ?? 0

  return (
    <div
      className={`rounded-xl border p-4 animate-slide-up ${
        isFake ? 'border-threat/30 bg-threat/5' : 'border-safe/30 bg-safe/5'
      }`}
    >
      <div className="mb-4 flex items-center gap-2.5">
        {isFake ? (
          <AlertTriangle className="h-5 w-5 text-threat" />
        ) : (
          <CheckCircle className="h-5 w-5 text-safe" />
        )}
        <span className={`font-display text-base font-bold uppercase ${isFake ? 'text-threat' : 'text-safe'}`}>
          {result.propagation.verdict}
        </span>
        <span className="ml-auto rounded-lg border border-border bg-secondary px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {result.propagation.confidence} confidence
        </span>
      </div>

      <div className="space-y-2.5">
        <ProbBar label="Coordination Prob" value={coordinationProb} color="bg-threat" />
        <ProbBar label="Organic Prob" value={1 - coordinationProb} color="bg-safe" />
      </div>

      <div className="mt-4 space-y-1 border-t border-border pt-3">
        <p className="font-mono text-[10px] text-muted-foreground">Patient Zero: Node {result.patient_zero}</p>
        <p className="font-mono text-[10px] text-muted-foreground">Content Hash: {result.content_hash.slice(0, 16)}...</p>
      </div>
    </div>
  )
}

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  )
}
