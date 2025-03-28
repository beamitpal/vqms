"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { VerticalBarChartCardProps } from "@/lib/types"



export default function StatsCard7({
  data,
  metrics,
  config,
  cardClassName = "max-w-xs",
  chartHeight = "140px",
  barSize = 32,
  barGap = 2,
  valueFormatter = (value) => String(value),
}: VerticalBarChartCardProps) {
  return (
    <Card className={cardClassName}>
      <CardContent className="flex gap-4 p-4 pb-2">
        <ChartContainer
          config={config}
          className={`h-[${chartHeight}] w-full`}
        >
          <BarChart
            margin={{ left: 0, right: 0, top: 0, bottom: 10 }}
            data={data}
            
            layout="vertical"
            barSize={barSize}
            barGap={barGap}
          >
            <XAxis type="number" dataKey="value" hide />
            <YAxis
              dataKey="activity"
              type="category"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
              className="capitalize"
            />
            <Bar dataKey="value" radius={5}>
              <LabelList
                position="insideLeft"
                dataKey="label"
                fill="white"
                offset={8}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row border-t p-4">
        <div className="flex w-full items-center gap-2">
          {metrics.map((metric, index) => (
            <div key={metric.label} className="grid flex-1 auto-rows-min gap-0.5">
              <div className="text-xs text-muted-foreground">{metric.label}</div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {valueFormatter(metric.value)}
                <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
              </div>
              {index < metrics.length - 1 && (
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              )}
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

