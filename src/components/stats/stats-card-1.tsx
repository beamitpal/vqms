"use client";

import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ReactNode } from "react";

interface DataPoint {
  [key: string]: string | number | boolean | null | undefined;
}

interface ChartCardProps {
  // Header props
  title: string | number;
  unit?: string;
  description?: string;
  titleClassName?: string;

  // Chart props
  data: DataPoint[];
  dataKey: string;
  xAxisKey: string;
  configLabel: string;
  chartColor?: string;
  averageValue?: number;
  averageLabel?: string;

  // Formatting props
  valueFormatter?: (value: number) => string;
  xAxisFormatter?: (value: string | number | Date) => string;
  tooltipLabelFormatter?: (value: string | number | Date) => string;

  // Footer props
  footerContent?: ReactNode;
  showFooter?: boolean;

  // Styling props
  cardClassName?: string;
  barRadius?: number;
  showTooltip?: boolean;
  showReferenceLine?: boolean;

  // Optional calculations
  calculateTotal?: (data: DataPoint[]) => number;
  calculateTarget?: (data: DataPoint[], current: number | string) => number;
}

export default function StatsCard1({
  title,
  unit = "",
  description = "",
  titleClassName = "text-4xl tabular-nums",
  data,
  dataKey,
  xAxisKey,
  configLabel,
  chartColor = "hsl(var(--chart-1))",
  averageValue,
  averageLabel,
  valueFormatter = (value) => value.toLocaleString(),
  xAxisFormatter = (value) =>
    new Date(value).toLocaleDateString("en-US", { weekday: "short" }),
  tooltipLabelFormatter = (value) =>
    new Date(value).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  footerContent,
  showFooter = true,
  cardClassName = "lg:max-w-md",
  barRadius = 5,
  showTooltip = true,
  showReferenceLine = true,
  calculateTotal,
  calculateTarget,
}: ChartCardProps) {
  const formattedTitle =
    typeof title === "number" ? valueFormatter(title) : title;

  return (
    <Card className={cardClassName}>
      <CardHeader className="space-y-0 pb-2">
        {description && <CardDescription>{description}</CardDescription>}
        <CardTitle className={titleClassName}>
          {formattedTitle}{" "}
          {unit && (
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            [dataKey]: {
              label: configLabel,
              color: chartColor,
            },
          }}
        >
          <BarChart
            accessibilityLayer
            margin={{ left: -4, right: -4 }}
            data={data}
          >
            <Bar
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
              radius={barRadius}
              fillOpacity={0.6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={xAxisFormatter}
            />
            {showTooltip && (
              <ChartTooltip
                defaultIndex={2}
                content={
                  <ChartTooltipContent
                    hideIndicator
                    labelFormatter={tooltipLabelFormatter}
                  />
                }
                cursor={false}
              />
            )}
            {showReferenceLine && averageValue && (
              <ReferenceLine
                y={averageValue}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={1}
              >
                {averageLabel && (
                  <Label
                    position="insideBottomLeft"
                    value={averageLabel}
                    offset={10}
                    fill="hsl(var(--foreground))"
                  />
                )}
                <Label
                  position="insideTopLeft"
                  value={valueFormatter(averageValue)}
                  className="text-lg"
                  fill="hsl(var(--foreground))"
                  offset={10}
                  startOffset={100}
                />
              </ReferenceLine>
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
      {showFooter && (
        <CardFooter className="flex-col items-start gap-1">
          {footerContent || (
            <>
              {calculateTotal && (
                <CardDescription>
                  Total:
                  <span className="font-medium text-foreground">
                    {valueFormatter(calculateTotal(data))}
                  </span>
                  {unit}
                </CardDescription>
              )}
              {calculateTarget && (
                <CardDescription>
                  Remaining:
                  <span className="font-medium text-foreground">
                    {valueFormatter(calculateTarget(data, title))}
                  </span>
                  {unit}
                </CardDescription>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
