import { useEffect, useRef } from 'react'
import Cytoscape from 'cytoscape'
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent'

Cytoscape.use(COSEBilkent)

export interface GraphData {
  nodes: { id: number; type: string; label: string }[]
  edges: { source: number; target: number; id: string }[]
  superspreader_id: number
  cluster_nodes: number[]
  node_count: number
  edge_count: number
}

interface NetworkGraphProps {
  data: GraphData | null
  loading: boolean
  error: string
}

export function NetworkGraph({ data, loading, error }: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Cytoscape.Core | null>(null)

  // Initialize Cytoscape
  useEffect(() => {
    if (!data || !containerRef.current) return

    // Map node data to Cytoscape format
    const cyNodes = data.nodes.map((node) => ({
      data: { id: String(node.id), label: node.label },
      classes: node.type,
    }))

    // Map edge data to Cytoscape format
    const cyEdges = data.edges.map((edge) => ({
      data: { id: edge.id, source: String(edge.source), target: String(edge.target) },
    }))

    // Create Cytoscape instance
    const cy = Cytoscape({
      container: containerRef.current,
      elements: [...cyNodes, ...cyEdges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#888',
            label: 'data(label)',
            'font-size': '10px',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 25,
            height: 25,
            'border-width': 2,
            'border-color': '#333',
            'color': '#fff',
            'text-outline-width': 2,
            'text-outline-color': '#000',
          },
        },
        // Patient Zero - Red
        {
          selector: 'node.patient_zero',
          style: {
            'background-color': '#ef4444',
            'border-width': 3,
            'border-color': '#991b1b',
          },
        },
        // Bot nodes - Orange
        {
          selector: 'node.bot',
          style: {
            'background-color': '#f97316',
            'border-color': '#ea580c',
          },
        },
        // Genuine - Green (default)
        {
          selector: 'node.genuine',
          style: {
            'background-color': '#10b981',
            'border-color': '#047857',
            'color': '#fff',
          },
        },
        // Superspreader - Purple
        {
          selector: 'node.superspreader',
          style: {
            'background-color': '#8b5cf6',
            'border-width': 3,
            'border-color': '#6d28d9',
          },
        },
        // Edge styling
        {
          selector: 'edge',
          style: {
            'line-color': '#555',
            'target-arrow-color': '#555',
            'target-arrow-shape': 'triangle',
            width: 1,
            'curve-style': 'bezier',
          },
        },
      ],
      layout: {
        name: 'cose-bilkent',
        animate: true,
        animationDuration: 1000,
        randomize: true,
        nodeRepulsion: 7500, // Increased for better layout
        idealEdgeLength: 50,
        nodeSpacing: 10,
        fit: true,
        padding: 30,
      } as any,
    })

    cyRef.current = cy

    console.log(`Graph loaded: ${data.node_count} nodes, ${data.edge_count} edges`)

    return () => {
      cy.destroy()
    }
  }, [data])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Stats Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontSize: '0.8rem',
        border: '1px solid #333',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Network Topology</div>
        {loading && <div>Loading graph data...</div>}
        {error && <div style={{ color: '#ef4444' }}>{error}</div>}
        {data && (
          <div style={{ display: 'grid', gap: '4px', color: '#ccc' }}>
            <div>Nodes: <span style={{ color: '#fff' }}>{data.node_count}</span></div>
            <div>Edges: <span style={{ color: '#fff' }}>{data.edge_count}</span></div>
            <div>Superspreader: <span style={{ color: '#8b5cf6' }}>#{data.superspreader_id}</span></div>
          </div>
        )}
      </div>

      {/* Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#ccc',
        padding: '0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        display: 'flex',
        gap: '1rem',
        border: '1px solid #333',
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
          Patient Zero
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
          Bot Cluster
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6' }} />
          Superspreader
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
          Genuine
        </div>
      </div>

      {/* Graph Container */}
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', background: '#050505' }} 
      />
    </div>
  )
}
