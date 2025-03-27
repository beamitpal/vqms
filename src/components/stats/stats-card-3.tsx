"use client"

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"


interface Metric {
  label: string
  current: number
  goal: number
  unit: string
  color: string
}

interface RadialProgressCardProps {
  // Data props
  metrics: Metric[]
  
  // Styling props
  cardClassName?: string
  chartClassName?: string
  barSize?: number
  innerRadius?: string
  cornerRadius?: number
  
  // Display props
  valueFormatter?: (current: number, goal: number) => string
  showTextValues?: boolean
  textClassName?: string
  
  // Chart configuration
  startAngle?: number
  endAngle?: number
  domain?: [number, number]
}

export default function StatsCard3({
  metrics,
  cardClassName = "max-w-xs",
  chartClassName = "mx-auto aspect-square w-full max-w-[80%]",
  barSize = 24,
  innerRadius = "20%",
  cornerRadius = 5,
  valueFormatter = (current, goal) => `${current}/${goal}`,
  showTextValues = true,
  textClassName = "text-xl font-bold tabular-nums leading-none",
  startAngle = 90,
  endAngle = 450,
  domain = [0, 100],
}: RadialProgressCardProps) {
  // Prepare chart config and data
  const chartConfig = metrics.reduce((acc, metric) => ({
    ...acc,
    [metric.label.toLowerCase()]: {
      label: metric.label,
      color: metric.color,
    },
  }), {})

  const chartData = metrics.map(metric => ({
    activity: metric.label.toLowerCase(),
    value: (metric.current / metric.goal) * 100,
    fill: `var(--color-${metric.label.toLowerCase()})`,
  }))

  return (
    <Card className={cardClassName}>
      <CardContent className="flex gap-4 p-4">
        {showTextValues && (
          <div className="grid items-center gap-2">
            {metrics.map((metric) => (
              <div key={metric.label} className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className={textClassName}>
                    {valueFormatter(metric.current, metric.goal)}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {metric.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <ChartContainer
          config={chartConfig}
          className={chartClassName}
        >
          <RadialBarChart
            margin={{
              left: -10,
              right: -10,
              top: -10,
              bottom: -10,
            }}
            data={chartData}
            innerRadius={innerRadius}
            barSize={barSize}
            startAngle={startAngle}
            endAngle={endAngle}
          >
            <PolarAngleAxis
              type="number"
              domain={domain}
              dataKey="value"
              tick={false}
            />
            <RadialBar 
              dataKey="value" 
              background 
              cornerRadius={cornerRadius} 
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


