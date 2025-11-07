import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleLineChartProps {
  data: Array<{
    date: string;
    orders_count: number;
    revenue: number;
    items_sold: number;
  }>;
  title: string;
  description?: string;
  dataKey: 'orders_count' | 'revenue' | 'items_sold';
  labelKey?: string;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  title,
  description,
  dataKey,
  labelKey,
}) => {
  const maxValue = Math.max(...data.map(d => d[dataKey]), 1);
  const formatValue = (value: number) => {
    if (dataKey === 'revenue') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={`${ratio * 100}%`}
                x2="100%"
                y2={`${ratio * 100}%`}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Data line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={data
                .map((d, i) => {
                  const x = ((i + 0.5) / data.length) * 100;
                  const y = 100 - (d[dataKey] / maxValue) * 90;
                  return `${x}%,${y}%`;
                })
                .join(' ')}
            />

            {/* Data points */}
            {data.map((d, i) => {
              const x = ((i + 0.5) / data.length) * 100;
              const y = 100 - (d[dataKey] / maxValue) * 90;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="#3b82f6"
                  className="hover:r-6 transition-all"
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
            {data
              .filter((_, i) => i % Math.ceil(data.length / 10) === 0 || i === data.length - 1)
              .map((d, i) => (
                <span key={i}>{formatDate(d.date)}</span>
              ))}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pl-1">
            {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
              <span key={ratio}>{formatValue(maxValue * ratio)}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleLineChart;

