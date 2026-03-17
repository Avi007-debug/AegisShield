import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useClusterInfo } from '@/hooks/useApi'
import { Loader2 } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend)

export function ClusterDonutChart() {
  const { data, isLoading } = useClusterInfo()

  if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
  if (!data) return null

  const chartData = {
    labels: [...data.clusters.map((c) => c.cluster_id), 'Unclustered'],
    datasets: [
      {
        data: [...data.clusters.map((c) => c.node_count), data.unclustered_nodes],
        backgroundColor: [
          'hsla(0, 72%, 51%, 0.7)',
          'hsla(38, 92%, 50%, 0.7)',
          'hsla(185, 80%, 50%, 0.7)',
          'hsla(220, 15%, 25%, 0.7)',
        ],
        borderColor: [
          'hsl(0, 72%, 51%)',
          'hsl(38, 92%, 50%)',
          'hsl(185, 80%, 50%)',
          'hsl(220, 15%, 25%)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Doughnut
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: 'JetBrains Mono', size: 10 }, color: '#94a3b8', padding: 12 },
          },
        },
      }}
    />
  )
}
