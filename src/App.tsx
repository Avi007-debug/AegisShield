import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { DetectionPage } from './pages/DetectionPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ThreatsPage } from './pages/ThreatsPage'
import { AuditPage } from './pages/AuditPage'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detection" element={<DetectionPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/threats" element={<ThreatsPage />} />
        <Route path="/audit" element={<AuditPage />} />
      </Routes>
      <Footer />
    </div>
  )
}
