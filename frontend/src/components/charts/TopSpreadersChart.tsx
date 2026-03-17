import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js'
import { useThreatScores } from '@/hooks/useApi'
import { Loader2 } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

export function TopSpreadersChart() {
  const { data, isLoading } = useThreatScores()

  if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
  if (!data) return null

  const top10 = data.scores.slice(0, 10)

  const chartData = {
    labels: top10.map((s) => `#${s.node_id}`),
    datasets: [
      {
        label: 'Threat Score',
        data: top10.map((s) => s.threat_score),
        backgroundColor: top10.map((s) =>
          s.type === 'superspreader' ? 'hsla(0, 72%, 51%, 0.8)' : 'hsla(185, 80%, 50%, 0.6)'
        ),
        borderColor: top10.map((s) =>
          s.type === 'superspreader' ? 'hsl(0, 72%, 51%)' : 'hsl(185, 80%, 50%)'
        ),
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  }

  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { titleFont: { family: 'JetBrains Mono', size: 10 } } },
        scales: {
          x: { ticks: { font: { family: 'JetBrains Mono', size: 9 }, color: '#64748b' }, grid: { display: false } },
          y: { ticks: { font: { family: 'JetBrains Mono', size: 9 }, color: '#64748b' }, grid: { color: 'hsla(220,15%,18%,0.5)' } },
        },
      }}
    />
  )
}
