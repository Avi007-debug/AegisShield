import { useEffect, useRef, useState } from 'react'
import Cytoscape from 'cytoscape'
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent'
import { useGraph, useContain } from '@/hooks/useApi'
import { Loader2, Crosshair, Info } from 'lucide-react'
import type { GraphNode } from '@/types'

Cytoscape.use(COSEBilkent)

export function PropagationGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Cytoscape.Core | null>(null)
  const { data, isLoading, error } = useGraph()
  const contain = useContain()
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  useEffect(() => {
    if (!data || !containerRef.current) return

    const cy = Cytoscape({
      container: containerRef.current,
      elements: [
        ...data.nodes.map((n) => ({
          data: { id: String(n.id), label: n.label, nodeType: n.type },
          classes: n.type,
        })),
        ...data.edges.map((e) => ({
          data: { id: e.id, source: String(e.source), target: String(e.target) },
        })),
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#3b82f6',
            label: 'data(label)',
            'font-size': '8px',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 22,
            height: 22,
            'border-width': 2,
            'border-color': '#1e3a5f',
            color: '#e2e8f0',
            'text-outline-width': 1.5,
            'text-outline-color': '#0a0f1a',
          },
        },
        {
          selector: 'node.patient_zero',
          style: { 'background-color': '#22c55e', 'border-color': '#15803d', 'border-width': 3 },
        },
        {
          selector: 'node.bot',
          style: { 'background-color': '#f97316', 'border-color': '#c2410c' },
        },
        {
          selector: 'node.genuine',
          style: { 'background-color': '#3b82f6', 'border-color': '#1d4ed8' },
        },
        {
          selector: 'node.superspreader',
          style: { 'background-color': '#ef4444', 'border-color': '#991b1b', 'border-width': 3, width: 30, height: 30 },
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#1e293b',
            'target-arrow-color': '#334155',
            'target-arrow-shape': 'triangle',
            width: 1,
            'curve-style': 'bezier',
            opacity: 0.6,
          },
        },
        {
          selector: ':selected',
          style: { 'border-color': '#06b6d4', 'border-width': 4 },
        },
      ],
      layout: {
        name: 'cose-bilkent',
        animate: true,
        animationDuration: 800,
        randomize: true,
        nodeRepulsion: 6000,
        idealEdgeLength: 60,
        nodeSpacing: 10,
        fit: true,
        padding: 20,
      } as any,
    })

    cy.on('tap', 'node', (e) => {
      const n = e.target.data()
      setSelectedNode({ id: Number(n.id), type: n.nodeType, label: n.label })
    })

    cyRef.current = cy
    return () => { cy.destroy() }
  }, [data])

  const handleContain = async (nodeId: number) => {
    await contain.mutateAsync(nodeId)
    setSelectedNode(null)
  }

  return (
    <div id="graph" className="card-glass relative flex h-full flex-col overflow-hidden rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Crosshair className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-semibold text-foreground">PROPAGATION NETWORK</span>
        </div>
        {data && (
          <div className="flex gap-3 font-mono text-[10px] text-muted-foreground">
            <span>N:{data.node_count}</span>
            <span>E:{data.edge_count}</span>
            <span className="text-threat">SS:#{data.superspreader_id}</span>
          </div>
        )}
      </div>

      {/* Graph Canvas */}
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <p className="font-mono text-xs text-threat">Failed to load graph data</p>
          </div>
        )}
        <div ref={containerRef} className="h-full w-full" style={{ background: 'hsl(220 22% 5%)' }} />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-border px-4 py-2">
        {[
          { color: '#22c55e', label: 'Patient Zero' },
          { color: '#ef4444', label: 'Superspreader' },
          { color: '#3b82f6', label: 'Normal' },
          { color: '#f97316', label: 'Bot' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: l.color }} />
            <span className="font-mono text-[10px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Node Info Popup */}
      {selectedNode && (
        <div className="absolute bottom-14 right-4 z-20 w-56 rounded-lg border border-border bg-card p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Info className="h-3 w-3 text-primary" />
              <span className="font-mono text-xs font-semibold">Node #{selectedNode.id}</span>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>
          <div className="space-y-1 font-mono text-[10px] text-muted-foreground">
            <p>Type: <span className="text-foreground">{selectedNode.type}</span></p>
            <p>Label: <span className="text-foreground">{selectedNode.label}</span></p>
          </div>
          {selectedNode.type === 'superspreader' && (
            <button
              onClick={() => handleContain(selectedNode.id)}
              disabled={contain.isPending}
              className="mt-2 w-full rounded bg-threat py-1.5 font-mono text-[10px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {contain.isPending ? 'Containing...' : 'Contain Node'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
