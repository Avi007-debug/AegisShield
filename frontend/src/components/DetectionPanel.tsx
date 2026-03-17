import React, { useState, useRef } from 'react'
import { Search, AlertTriangle, CheckCircle, Loader2, Sparkles, ImageIcon, Type, Upload, X } from 'lucide-react'
import { useAnalyze } from '@/hooks/useApi'
import { endpoints } from '@/api/endpoints'
import type { AnalyzeResult } from '@/types'

type Mode = 'text' | 'image'

export function DetectionPanel() {
  const [mode, setMode] = useState<Mode>('text')
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrError, setOcrError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResult | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const analyze = useAnalyze()
  const loading = analyze.isPending || ocrLoading

  const handleImageSelect = (file: File) => {
    setImage(file)
    setExtractedText(null)
    setOcrError(null)
    setResult(null)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleImageSelect(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageSelect(file)
  }

  const clearImage = () => {
    setImage(null)
    setImagePreview(null)
    setExtractedText(null)
    setOcrError(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setResult(null)
    setOcrError(null)
  }

  const handleAnalyze = async () => {
    if (mode === 'text') {
      if (!text.trim()) return
      try {
        const res = await analyze.mutateAsync({ text })
        setResult(res)
      } catch (err) {
        console.error(err)
      }
    } else {
      if (!image) return
      setOcrLoading(true)
      setOcrError(null)
      try {
        const { extracted_text } = await endpoints.extractText(image)
        setExtractedText(extracted_text)
        const res = await analyze.mutateAsync({ text: extracted_text })
        setResult(res)
      } catch (err) {
        setOcrError('OCR failed — ensure the image contains readable text.')
        console.error(err)
      } finally {
        setOcrLoading(false)
      }
    }
  }

  const canAnalyze = mode === 'text' ? !!text.trim() : !!image

  return (
    <div className="space-y-4">

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border bg-muted/20 p-0.5 gap-0.5">
        {([['text', Type, 'Text'], ['image', ImageIcon, 'Image']] as const).map(([m, Icon, label]) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-mono text-[11px] font-semibold transition-all ${
              mode === m
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Text mode */}
      {mode === 'text' && (
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
      )}

      {/* Image mode */}
      {mode === 'image' && (
        <div className="space-y-2">
          {!image ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-colors ${
                dragOver
                  ? 'border-primary/60 bg-primary/5'
                  : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/30'
              }`}
            >
              <Upload className="h-7 w-7 text-muted-foreground" />
              <div className="text-center">
                <p className="font-mono text-xs font-semibold text-foreground">Drop image or click to upload</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">PNG, JPG, WEBP</p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl border border-border overflow-hidden">
              <img src={imagePreview!} alt="Selected" className="h-44 w-full object-contain bg-muted/20" />
              <button
                onClick={clearImage}
                className="absolute right-2 top-2 rounded-lg bg-background/80 p-1 backdrop-blur-sm hover:bg-background"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <div className="border-t border-border bg-muted/10 px-3 py-1.5 font-mono text-[10px] text-muted-foreground truncate">
                {image.name}
              </div>
            </div>
          )}

          {extractedText && (
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-primary">Extracted Text</p>
              <p className="font-mono text-[11px] text-muted-foreground line-clamp-3">{extractedText}</p>
            </div>
          )}

          {ocrError && (
            <p className="font-mono text-[11px] text-threat">{ocrError}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading || !canAnalyze}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-mono text-xs font-semibold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-accent/30 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
      >
        {loading
          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> {ocrLoading ? 'Extracting Text...' : 'Analyzing...'}</>
          : <><Sparkles className="h-3.5 w-3.5" /> Analyze Content</>
        }
      </button>

      {result && <DetectionResult result={result} />}

    </div>
  )
}



function DetectionResult({ result }: { result: AnalyzeResult }) {

  const isFake = result.propagation?.verdict === 'coordinated'

  const coordinationProb =
    result.propagation?.coordination_prob ?? 0

  return (

    <div className={`rounded-xl border p-4 animate-slide-up ${
      isFake ? 'border-threat/30 bg-threat/5' : 'border-safe/30 bg-safe/5'
    }`}>

      <div className="mb-4 flex items-center gap-2.5">

        {isFake
          ? <AlertTriangle className="h-5 w-5 text-threat" />
          : <CheckCircle className="h-5 w-5 text-safe" />
        }

        <span className={`font-display text-base font-bold uppercase ${
          isFake ? 'text-threat' : 'text-safe'
        }`}>
          {result.propagation?.verdict}
        </span>

        <span className="ml-auto rounded-lg border border-border bg-secondary px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {result.propagation?.confidence}
        </span>

      </div>


      <div className="space-y-2.5">

        <ProbBar
          label="Coordination Prob"
          value={coordinationProb}
          color="bg-threat"
        />

        <ProbBar
          label="Organic Prob"
          value={1 - coordinationProb}
          color="bg-safe"
        />

      </div>


      <div className="mt-4 space-y-1 border-t border-border pt-3">

        <p className="font-mono text-[10px] text-muted-foreground">
          Patient Zero: Node {result.patient_zero}
        </p>

        <p className="font-mono text-[10px] text-muted-foreground">
          Content Hash: {result.content_hash?.slice(0,16)}...
        </p>

      </div>

    </div>

  )
}



function ProbBar({
  label,
  value,
  color
}: {
  label: string
  value: number
  color: string
}) {

  return (

    <div className="space-y-1">

      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">
          {(value * 100).toFixed(1)}%
        </span>
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
