"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DataPoint {
  [key: string]: string | number | boolean | null | undefined
}

interface Metric {
  label: string
  value: number | string
  unit: string
}

interface LineChartCardProps {
  metrics: Metric[]
  data: DataPoint[]
  dataKey: string
  xAxisKey: string
  configLabel: string
  cardClassName?: string
  chartColor?: string
  valueFormatter?: (value: number | string) => string
  xAxisFormatter?: (value: string | number | Date) => string
  tooltipLabelFormatter?: (value: string | number | Date) => string
  showGrid?: boolean
}

export default function StatsCard4({
  metrics,
  data,
  dataKey,
  xAxisKey,
  configLabel,
  cardClassName = "flex flex-col lg:max-w-md",
  chartColor = "hsl(var(--chart-1))",
  valueFormatter = (value) => String(value),
  xAxisFormatter = (value) => new Date(value).toLocaleDateString("en-US", { weekday: "short" }),
  tooltipLabelFormatter = (value) => new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
  showGrid = true,
}: LineChartCardProps) {
  return (
    <Card className={cardClassName}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 [&>div]:flex-1">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <CardDescription>{metric.label}</CardDescription>
            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
              {valueFormatter(metric.value)}
              <span className="text-sm font-normal tracking-normal text-muted-foreground">
                {metric.unit}
              </span>
            </CardTitle>
          </div>
        ))}
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <ChartContainer
          config={{
            [dataKey]: {
              label: configLabel,
              color: chartColor,
            },
          }}
          className="w-full"
        >
          <LineChart
            accessibilityLayer
            margin={{ left: 14, right: 14, top: 10 }}
            data={data}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="hsl(var(--muted-foreground))"
                strokeOpacity={0.5}
              />
            )}
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={xAxisFormatter}
            />
            <Line
              dataKey={dataKey}
              type="natural"
              fill={`var(--color-${dataKey})`}
              stroke={`var(--color-${dataKey})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ fill: `var(--color-${dataKey})`, stroke: `var(--color-${dataKey})`, r: 4 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={tooltipLabelFormatter}
                />
              }
              cursor={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
