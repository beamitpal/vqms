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
import { BarChartCardProps } from "@/lib/types"



export default function StatsCard5({
  title,
  description,
  value,
  unit,
  data,
  dataKey,
  xAxisKey,
  configLabel,
  cardClassName = "max-w-xs",
  chartWidth = "72px",
  chartColor = "var(--chart-3)",
  valueFormatter = (value) => String(value),
}: BarChartCardProps) {
  return (
    <Card className={cardClassName}>
      <CardHeader className="p-4 pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
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
              fill={`var(--chart-4)`}
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

