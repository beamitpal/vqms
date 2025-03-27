"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { ReactNode } from "react";

interface DataPoint {
  [key: string]: string | number;
}

interface ComparisonBarCardProps {
  // Header props
  title?: string;
  description?: string | ReactNode;

  // Data props
  data: [DataPoint, DataPoint]; // Expecting exactly 2 data points for comparison
  valueKey: string;
  labelKey: string;

  // Formatting props
  valueFormatter?: (value: number) => string;
  unit?: string;

  // Styling props
  cardClassName?: string;
  barHeight?: number;
  barRadius?: number;
  primaryColor?: string;
  secondaryColor?: string;
  labelFontSize?: number;

  // Configuration props
  configLabel: string;
  showValues?: boolean;
  valueClassName?: string;
}

export default function StatsCard2({
  title = "Progress",
  description,
  data,
  valueKey,
  labelKey,
  valueFormatter = (value) => value.toLocaleString(),
  unit = "",
  cardClassName = "max-w-xs",
  barHeight = 32,
  barRadius = 4,
  primaryColor = "hsl(var(--chart-1))",
  secondaryColor = "hsl(var(--muted))",
  labelFontSize = 12,
  configLabel,
  showValues = true,
  valueClassName = "text-2xl font-bold tabular-nums leading-none",
}: ComparisonBarCardProps) {
  if (data.length !== 2) {
    throw new Error("ComparisonBarCard requires exactly 2 data points");
  }

  return (
    <Card className={cardClassName}>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* First Bar */}
        <div className="grid auto-rows-min gap-2">
          {showValues && (
            <div className="flex items-baseline gap-1">
              <span className={valueClassName}>
                {valueFormatter(Number(data[0][valueKey]))}
              </span>
              {unit && (
                <span className="text-sm font-normal text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
          )}
          <ChartContainer
            config={{
              [valueKey]: {
                label: configLabel,
                color: primaryColor,
              },
            }}
            className={`aspect-auto h-[${barHeight}px] w-full`}
          >
            <BarChart
              accessibilityLayer
              layout="vertical"
              margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
              data={[data[0]]}
            >
              <Bar
                dataKey={valueKey}
                fill={`var(--color-${valueKey})`}
                radius={barRadius}
                barSize={barHeight}
              >
                <LabelList
                  position="insideLeft"
                  dataKey={labelKey}
                  offset={8}
                  fontSize={labelFontSize}
                  fill="white"
                />
              </Bar>
              <YAxis dataKey={labelKey} type="category" tickCount={1} hide />
              <XAxis dataKey={valueKey} type="number" hide />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Second Bar */}
        <div className="grid auto-rows-min gap-2">
          {showValues && (
            <div className="flex items-baseline gap-1">
              <span className={valueClassName}>
                {valueFormatter(Number(data[1][valueKey]))}
              </span>
              {unit && (
                <span className="text-sm font-normal text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
          )}
          <ChartContainer
            config={{
              [valueKey]: {
                label: configLabel,
                color: secondaryColor,
              },
            }}
            className={`aspect-auto h-[${barHeight}px] w-full`}
          >
            <BarChart
              accessibilityLayer
              layout="vertical"
              margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
              data={[data[1]]}
            >
              <Bar
                dataKey={valueKey}
                fill={`var(--color-${valueKey})`}
                radius={barRadius}
                barSize={barHeight}
              >
                <LabelList
                  position="insideLeft"
                  dataKey={labelKey}
                  offset={8}
                  fontSize={labelFontSize}
                  fill="hsl(var(--muted-foreground))"
                />
              </Bar>
              <YAxis dataKey={labelKey} type="category" tickCount={1} hide />
              <XAxis dataKey={valueKey} type="number" hide />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
