import React, { useState, useRef } from 'react'
import { Upload, FileText, Search, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
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
    <div id="detection" className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('text')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-all ${
            mode === 'text'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          <FileText className="h-3 w-3" /> Text
        </button>
        <button
          onClick={() => setMode('image')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-all ${
            mode === 'image'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          <Upload className="h-3 w-3" /> Image OCR
        </button>
      </div>

      {/* Input */}
      {mode === 'text' ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste suspicious content for analysis..."
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-muted p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted p-8 transition-colors hover:border-primary"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="font-mono text-xs text-muted-foreground">
            Drop image or click to upload
          </p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>
      )}

      {/* Actions */}
      {mode === 'text' && (
        <div className="flex gap-2">
          <button
            onClick={handleClassify}
            disabled={loading || !text.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-mono text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            Classify
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-mono text-xs font-semibold text-accent-foreground transition-all hover:opacity-90 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
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
    <div className={`rounded-lg border p-4 ${isFake ? 'border-threat/30 bg-threat/5' : 'border-safe/30 bg-safe/5'}`}>
      <div className="mb-3 flex items-center gap-2">
        {isFake ? (
          <AlertTriangle className="h-5 w-5 text-threat" />
        ) : (
          <CheckCircle className="h-5 w-5 text-safe" />
        )}
        <span className={`font-mono text-sm font-bold uppercase ${isFake ? 'text-threat' : 'text-safe'}`}>
          {result.label}
        </span>
        <span className="ml-auto rounded bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {result.confidence}
        </span>
      </div>

      {/* Probability Bars */}
      <div className="space-y-2">
        <ProbBar label="Fake" value={result.fake_probability} color="bg-threat" />
        <ProbBar label="Real" value={result.true_probability} color="bg-safe" />
      </div>
    </div>
  )
}

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  )
}
