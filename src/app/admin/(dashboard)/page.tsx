"use client";

import { useEffect, useState } from "react";
import StatsCard1 from "@/components/stats/stats-card-1";
import StatsCard2 from "@/components/stats/stats-card-2";
import StatsCard3 from "@/components/stats/stats-card-3";
import StatsCard4 from "@/components/stats/stats-card-4";
import StatsCard6 from "@/components/stats/stats-card-6";
import StatsCard7 from "@/components/stats/stats-card-7";
import { getAdmin } from "@/lib/auth";
import { Admin, SystemStats, TimeSeriesData } from "@/lib/types";
import {
  getSystemStats,
  getBusinessGrowth,
  getProjectGrowth,
  getUserGrowth as getSystemUserGrowth,
} from "@/actions/admin/stats/index";

import { DataPoint } from "@/lib/types";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [businessGrowth, setBusinessGrowth] = useState<TimeSeriesData[]>([]);
  const [projectGrowth, setProjectGrowth] = useState<TimeSeriesData[]>([]);
  const [userGrowth, setUserGrowth] = useState<TimeSeriesData[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const adminData = await getAdmin();
        setAdmin(adminData);

        if (!adminData?.id) {
          throw new Error("No admin ID found");
        }

        const [sysStats, busGrowth, projGrowth, usrGrowth] = await Promise.all([
          getSystemStats(),
          getBusinessGrowth(),
          getProjectGrowth(),
          getSystemUserGrowth(),
        ]);

        setSystemStats(sysStats);
        setBusinessGrowth(busGrowth);
        setProjectGrowth(projGrowth);
        setUserGrowth(usrGrowth);
      } catch {
        toast.error("Error fetching admin dashboard data");
      }
    }

    fetchData();
  }, []);

  if (!systemStats || !admin) {
    return (
      <div className="h-screen flex justify-center items-center">
        <RefreshCw className="animate-spin m-2" />
      </div>
    );
  }

  const dateFormatter = (value: string | number | Date): string => {
    const date =
      typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : value;
    return isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const tooltipDateFormatter = (value: string | number | Date): string => {
    const date =
      typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : value;
    return isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  };
  const businessDistribution: [DataPoint, DataPoint] = [
    {
      label: "Small (<5 projects)",
      value:
        systemStats.avgProjectsPerBusiness < 5
          ? systemStats.totalBusinesses
          : Math.round(systemStats.totalBusinesses * 0.6),
    },
    {
      label: "Large (5+ projects)",
      value:
        systemStats.avgProjectsPerBusiness >= 5
          ? systemStats.totalBusinesses
          : Math.round(systemStats.totalBusinesses * 0.4),
    },
  ];
  return (
    <>
      <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
          <StatsCard1
            title={systemStats.totalBusinesses}
            unit="businesses"
            description="Total Businesses"
            data={businessGrowth}
            dataKey="value"
            xAxisKey="date"
            configLabel="Businesses Created"
            averageValue={systemStats.avgProjectsPerBusiness}
            averageLabel="Avg Projects"
            xAxisFormatter={dateFormatter}
            tooltipLabelFormatter={tooltipDateFormatter}
            cardClassName="w-full sm:max-w-md lg:max-w-md bg-background"
          />

          <StatsCard4
            metrics={[
              {
                label: "Total Projects",
                value: systemStats.totalProjects,
                unit: "projects",
              },
              {
                label: "Total Users",
                value: systemStats.totalUsers,
                unit: "users",
              },
            ]}
            data={userGrowth}
            dataKey="value"
            xAxisKey="date"
            configLabel="Users"
            xAxisFormatter={dateFormatter}
            tooltipLabelFormatter={tooltipDateFormatter}
            cardClassName="w-full flex flex-col sm:max-w-md lg:max-w-md bg-background"
          />
        </div>

        <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
          <StatsCard2
            title="Business Distribution"
            data={businessDistribution}
            valueKey="value"
            labelKey="label"
            configLabel="Businesses"
            cardClassName="w-full sm:max-w-xs bg-background"
          />

          <StatsCard6
            title="Avg Projects/Business"
            value={systemStats.avgProjectsPerBusiness}
            unit="projects"
            data={projectGrowth.slice(-5)}
            dataKey="value"
            xAxisKey="date"
            configLabel="Projects"
            cardClassName="w-full sm:max-w-xs bg-background"
          />

          <StatsCard7
            data={[
              {
                activity: "Businesses",
                value: systemStats.totalBusinesses,
                label: `${systemStats.totalBusinesses}`,
              },
              {
                activity: "Projects",
                value: systemStats.totalProjects,
                label: `${systemStats.totalProjects}`,
              },
              {
                activity: "Users",
                value: systemStats.totalUsers,
                label: `${systemStats.totalUsers}`,
              },
            ]}
            metrics={[
              {
                label: "System Total",
                value:
                  systemStats.totalBusinesses +
                  systemStats.totalProjects +
                  systemStats.totalUsers,
                unit: "entities",
              },
            ]}
            config={{
              value: { label: "Count", color: "hsl(var(--chart-1))" },
            }}
            cardClassName="w-full sm:max-w-xs bg-background"
          />
        </div>

        <div className="grid w-full flex-1 gap-6">
          <StatsCard3
            metrics={[
              {
                label: "Businesses",
                current: systemStats.totalBusinesses,
                goal: systemStats.totalBusinesses + 50,
                unit: "businesses",
                color: "hsl(var(--chart-1))",
              },
              {
                label: "Users",
                current: systemStats.totalUsers,
                goal: systemStats.totalUsers + 1000,
                unit: "users",
                color: "hsl(var(--chart-2))",
              },
            ]}
            cardClassName="w-full sm:max-w-xs bg-background"
          />
        </div>
      </div>
    </>
  );
}
