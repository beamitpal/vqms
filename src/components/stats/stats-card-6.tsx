"use client"

import { Bar, BarChart, Rectangle, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

interface DataPoint {
  [key: string]: string | number
}

interface EnergyBarChartCardProps {
  title: string
  description?: string
  value: number | string
  unit: string
  data: DataPoint[]
  dataKey: string
  xAxisKey: string
  configLabel: string
  cardClassName?: string
  chartWidth?: string
  chartColor?: string
  valueFormatter?: (value: number | string) => string
}

export default function StatsCard6({
  title,
  description,
  value,
  unit,
  data,
  dataKey,
  xAxisKey,
  configLabel,
  cardClassName = "max-w-xs",
  chartWidth = "64px",
  chartColor = "hsl(var(--chart-1))",
  valueFormatter = (value) => String(value),
}: EnergyBarChartCardProps) {
  return (
    <Card className={cardClassName}>
      <CardHeader className="p-4 pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
        <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
          {valueFormatter(value)}
          <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </div>
        <ChartContainer
          config={{
            [dataKey]: {
              label: configLabel,
              color: chartColor,
            },
          }}
          className={`ml-auto w-[${chartWidth}]`}
        >
          <BarChart
            accessibilityLayer
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            data={data}
          >
            <Bar
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
              radius={2}
              fillOpacity={0.2}
              activeIndex={data.length - 1}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={4} hide />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
