import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCard {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const mockMetrics: MetricCard[] = [
  { title: 'Usuários', value: 128, color: 'bg-blue-100 text-blue-800' },
  { title: 'Vendas', value: 'R$ 12.340', color: 'bg-green-100 text-green-800' },
  { title: 'Ativos', value: 87, color: 'bg-yellow-100 text-yellow-800' },
  { title: 'Pendências', value: 5, color: 'bg-red-100 text-red-800' },
];

export function DashboardCards() {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);

  useEffect(() => {
    // Simula fetch de métricas
    setTimeout(() => setMetrics(mockMetrics), 400);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader>
            <CardTitle className={metric.color}>{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{metric.value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
