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
import { LineChartCardProps } from "@/lib/types"



export default function StatsCard4({
  metrics,
  data,
  dataKey,
  xAxisKey,
  configLabel,
  cardClassName = "flex flex-col lg:max-w-md",
  chartColor = "var(--chart-1)",
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
                stroke="var(--muted-foreground)"
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
              fill={`var(--chart-1)`}
              stroke={`var(--chart-2)`}
              strokeWidth={2}
              dot={false}
              activeDot={{ fill: `var(--chart-4))`, stroke: `var(--chart-5)`, r: 4 }}
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
