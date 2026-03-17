import React, { useState, useRef } from 'react'
import { Upload, FileText, Search, AlertTriangle, CheckCircle, Loader2, Sparkles } from 'lucide-react'
import { useClassify, useExtractText, useAnalyze } from '@/hooks/useApi'
import type { ClassifyResult } from '@/types'

export function DetectionPanel() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'text' | 'image'>('text')
  const [result, setResult] = useState<ClassifyResult | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const classify = useClassify()
  const extractText = useExtractText()
  const analyze = useAnalyze()

  const loading = classify.isPending || extractText.isPending || analyze.isPending

  const handleClassify = async () => {
    if (!text.trim()) return
    const res = await classify.mutateAsync({ text })
    setResult(res)
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return
    const res = await analyze.mutateAsync({ text })
    setResult(res.nlp)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const extracted = await extractText.mutateAsync(file)
    setText(extracted.extracted_text)
    const res = await classify.mutateAsync({ text: extracted.extracted_text })
    setResult(res)
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-1.5 rounded-lg bg-muted/50 p-1">
        <button
          onClick={() => setMode('text')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 font-mono text-xs font-medium transition-all ${
            mode === 'text'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="h-3 w-3" />
          Text
        </button>
        <button
          onClick={() => setMode('image')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 font-mono text-xs font-medium transition-all ${
            mode === 'image'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="h-3 w-3" />
          Image OCR
        </button>
      </div>

      {/* Input */}
      {mode === 'text' ? (
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
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 p-10 transition-all hover:border-primary/40 hover:bg-primary/3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="mb-0.5 text-sm font-medium text-foreground">Drop image or click to upload</p>
            <p className="font-mono text-xs text-muted-foreground">PNG, JPG, WEBP supported</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>
      )}

      {/* Actions */}
      {mode === 'text' && (
        <div className="flex gap-2">
          <button
            onClick={handleClassify}
            disabled={loading || !text.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-mono text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            Classify
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-mono text-xs font-semibold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-accent/30 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Full Analysis
          </button>
        </div>
      )}

      {/* Result */}
      {result && <DetectionResult result={result} />}
    </div>
  )
}

function DetectionResult({ result }: { result: ClassifyResult }) {
  const isFake = result.label === 'fake'
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
          {result.label}
        </span>
        <span className="ml-auto rounded-lg border border-border bg-secondary px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {result.confidence} confidence
        </span>
      </div>

      <div className="space-y-2.5">
        <ProbBar label="Fake Probability"  value={result.fake_probability} color="bg-threat" />
        <ProbBar label="Real Probability"  value={result.true_probability} color="bg-safe"  />
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
