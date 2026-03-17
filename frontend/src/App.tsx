import { useState, useEffect } from 'react'
import { NetworkGraph } from './components/NetworkGraph'
import type { GraphData } from './components/NetworkGraph'
import { AuditLog } from './components/AuditLog'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('Bill Gates controls COVID vaccines')
  const [result, setResult] = useState<null | {
    label: string
    fake_probability: number
    true_probability: number
    confidence: string
  }>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Graph Data State
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [graphLoading, setGraphLoading] = useState(true)
  const [graphError, setGraphError] = useState('')
  const [containLoading, setContainLoading] = useState(false)

  // Fetch graph data
  const fetchGraph = async () => {
    setGraphLoading(true)
    try {
      const response = await fetch('http://localhost:8001/graph')
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const data = await response.json()
      setGraphData(data)
      setGraphError('')
    } catch (err) {
      setGraphError(`Failed to load graph: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setGraphLoading(false)
    }
  }

  // Fetch graph on mount
  useEffect(() => {
    fetchGraph()
  }, [])

  const classifyText = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:8001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      const data = await response.json()
      // Transform propagation analysis to classification format
      setResult({
        label: data.propagation?.verdict || 'unknown',
        fake_probability: data.propagation?.coordination_prob || 0,
        true_probability: 1 - (data.propagation?.coordination_prob || 0),
        confidence: data.propagation?.confidence || 0
      })
      // Update graph with new data from analysis
      if (data.graph) {
        setGraphData(data.graph)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleContain = async () => {
    if (!graphData?.superspreader_id) return
    setContainLoading(true)
    try {
      const response = await fetch(`http://localhost:8001/contain/${graphData.superspreader_id}`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Containment failed')
      // Refresh graph to show cut edges
      await fetchGraph()
    } catch (e) {
      console.error(e)
      alert("Containment action failed")
    } finally {
      setContainLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Aegis Shield</h1>
        <div className="badge">Regulatory Defense Platform</div>
      </header>

      <main className="dashboard-grid">
        {/* Left Column: Visualization */}
        <section className="viz-section">
          <NetworkGraph 
            data={graphData} 
            loading={graphLoading} 
            error={graphError} 
          />
        </section>

        {/* Right Column: Controls & Audit */}
        <aside className="control-section">
          {/* Analysis Panel */}
          <div className="panel analysis-panel">
            <h3>Content Analysis</h3>
            <textarea
              className="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              placeholder="Paste suspicious content here..."
            />
            <button className="primary-btn" onClick={classifyText} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Content'}
            </button>
            
            {result && (
              <div className="result-container">
                <div className={`verdict-badge ${result.label}`}>
                  VERDICT: {result.label.toUpperCase()}
                </div>
                
                <div className="probability-matrix">
                  <div className="prob-row">
                    <span className="prob-label">Real</span>
                    <div className="prob-bar-bg">
                      <div 
                        className="prob-bar-fill real" 
                        style={{width: `${result.true_probability * 100}%`}}
                      />
                    </div>
                    <span className="prob-val">{(result.true_probability * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="prob-row">
                    <span className="prob-label">Fake</span>
                    <div className="prob-bar-bg">
                      <div 
                        className="prob-bar-fill fake" 
                        style={{width: `${result.fake_probability * 100}%`}}
                      />
                    </div>
                    <span className="prob-val">{(result.fake_probability * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
            {error && <p className="error">{error}</p>}
          </div>

          {/* Containment Panel */}
          <div className="panel containment-panel">
            <h3>Active Response</h3>
            <p style={{fontSize: '0.8rem', color: '#aaa', margin: '0 0 1rem 0'}}>
              Apply surgical edge removal for identified superspreaders.
            </p>
            <button 
              className="primary-btn" 
              onClick={handleContain} 
              disabled={containLoading || !graphData?.superspreader_id}
              style={{ background: '#ef4444' }}
            >
              {containLoading ? 'Deploying...' : `Contain Superspreader #${graphData?.superspreader_id || '?'}`}
            </button>
          </div>

          {/* Audit Log Component */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
             <AuditLog />
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
