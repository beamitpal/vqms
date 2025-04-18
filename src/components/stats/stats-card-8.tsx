"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChartCardProps } from "@/lib/types";

export default function StatsCard8({
  description,
  value,
  unit,
  secondaryValue,
  secondaryUnit,
  data,
  dataKey,
  xAxisKey,
  configLabel,
  cardClassName = "max-w-xs",
  chartColor = "var(--chart-3)",
  valueFormatter = (value) => String(value),
  tooltipFormatter = (value) => (
    <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
      {configLabel}
      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
        {value}
        <span className="font-normal text-muted-foreground">{unit}</span>
      </div>
    </div>
  ),
}: AreaChartCardProps) {
  return (
    <Card className={cardClassName}>
      <CardHeader className="space-y-0 pb-0">
        {description && <CardDescription>{description}</CardDescription>}
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          {valueFormatter(value)}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            {unit}
          </span>
          {secondaryValue && (
            <>
              {valueFormatter(secondaryValue)}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                {secondaryUnit}
              </span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            [dataKey]: {
              label: configLabel,
              color: chartColor,
            },
          }}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <XAxis dataKey={xAxisKey} hide />
            <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
            <defs>
              <linearGradient id={`fill${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--chart-4)`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--chart-5)`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey={dataKey}
              type="natural"
              fill={`url(#fill${dataKey})`}
              fillOpacity={0.4}
              stroke={`var(--chart-1)`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={tooltipFormatter}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
