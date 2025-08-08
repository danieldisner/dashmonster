import { useEffect, useRef } from 'react';

// Exemplo simples usando Chart.js via CDN (pode ser substituído por lib local)
export function DashboardChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
  // @ts-expect-error: dynamic import de Chart.js pode não ser tipado corretamente
    import('chart.js/auto').then(({ default: Chart }) => {
      new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [
            {
              label: 'Vendas',
              data: [1200, 1900, 3000, 500, 2000, 3000],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37,99,235,0.1)',
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
        },
      });
    });
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Vendas nos últimos meses</h2>
      <canvas ref={chartRef} height={180} />
    </div>
  );
}
