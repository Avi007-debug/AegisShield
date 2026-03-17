import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

interface Props {
  reachBefore?: number
  reachAfter?: number
  reductionPct?: number
}

export function ContainmentChart({ reachBefore = 48, reachAfter = 12, reductionPct = 75 }: Props) {
  const chartData = {
    labels: ['Before', 'After'],
    datasets: [
      {
        label: 'Reach',
        data: [reachBefore, reachAfter],
        backgroundColor: ['hsla(0, 72%, 51%, 0.6)', 'hsla(142, 71%, 45%, 0.6)'],
        borderColor: ['hsl(0, 72%, 51%)', 'hsl(142, 71%, 45%)'],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  return (
    <div className="relative">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#64748b' }, grid: { display: false } },
            y: { ticks: { font: { family: 'JetBrains Mono', size: 9 }, color: '#64748b' }, grid: { color: 'hsla(220,15%,18%,0.5)' } },
          },
        }}
      />
      <div className="absolute right-2 top-0 rounded bg-safe/20 px-2 py-0.5 font-mono text-[10px] text-safe">
        -{reductionPct}% reach
      </div>
    </div>
  )
}
