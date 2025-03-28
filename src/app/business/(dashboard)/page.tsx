
"use client";

import { useEffect, useState } from "react";
import StatsCard1 from "@/components/stats/stats-card-1";
import StatsCard2 from "@/components/stats/stats-card-2";
import StatsCard3 from "@/components/stats/stats-card-3";
import StatsCard4 from "@/components/stats/stats-card-4";
import StatsCard5 from "@/components/stats/stats-card-5";
import StatsCard6 from "@/components/stats/stats-card-6";
import StatsCard7 from "@/components/stats/stats-card-7";
import StatsCard8 from "@/components/stats/stats-card-8";
import {
  getProjectStats,
  getUserStats,
  getUserGrowth,
  getProjectActivity,
} from "@/actions/business/stats/index";
import { getBusiness } from "@/lib/auth";
import { toast } from "sonner";
import { ProjectStats, TimeSeriesData, UserStats } from "@/lib/types";
import { Business } from "@prisma/client";


export default function DashboardPage() {
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userGrowth, setUserGrowth] = useState<TimeSeriesData[]>([]);
  const [projectActivity, setProjectActivity] = useState<TimeSeriesData[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const businessData = await getBusiness();
        setBusiness(businessData);

        if (!businessData?.id) {
          throw new Error("No business ID found");
        }

        const [projStats, usrStats, usrGrowth, projActivity] =
          await Promise.all([
            getProjectStats(businessData.id),
            getUserStats(businessData.id),
            getUserGrowth(businessData.id),
            getProjectActivity(businessData.id),
          ]);

        setProjectStats(projStats);
        setUserStats(usrStats);
        setUserGrowth(usrGrowth);
        setProjectActivity(projActivity);
      } catch {
        toast.error("Error fetching dashboard data");
      }
    }

    fetchData();
  }, []);

  if (!projectStats || !userStats || !business) {
    return <div className="p-4">Loading...</div>;
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

  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
  
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <StatsCard1
          title={projectStats.totalProjects}
          unit="projects"
          description="Total Projects"
          data={projectActivity}
          dataKey="value"
          xAxisKey="date"
          configLabel="Projects Created"
          averageValue={projectStats.avgUsersPerProject}
          averageLabel="Avg Users"
          xAxisFormatter={dateFormatter}
          tooltipLabelFormatter={tooltipDateFormatter}
          cardClassName="w-full sm:max-w-md lg:max-w-md bg-background"
        />

        <StatsCard4
          metrics={[
            {
              label: "Total Users",
              value: userStats.totalUsers,
              unit: "users",
            },
            { label: "Active", value: userStats.activeUsers, unit: "users" },
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
          title="Project Status"
          data={[
            { label: "Public", value: projectStats.publicProjects },
            { label: "Private", value: projectStats.privateProjects },
          ]}
          valueKey="value"
          labelKey="label"
          configLabel="Projects"
          cardClassName="w-full sm:max-w-xs bg-background"
        />

        <StatsCard5
          title="Total Projects"
          value={projectStats.totalProjects}
          unit="projects"
          data={projectActivity.slice(-5)}
          dataKey="value"
          xAxisKey="date"
          configLabel="Projects"
          cardClassName="w-full sm:max-w-xs bg-background"
        />

        <StatsCard7
          data={userStats.usersByProject
            .sort((a, b) => b.userCount - a.userCount)
            .slice(0, 3)
            .map((p) => ({
              activity: p.projectName,
              value: p.userCount,
              label: `${p.userCount}`,
            }))}
          metrics={[
            {
              label: "Top Project",
              value: userStats.usersByProject[0]?.userCount || 0,
              unit: "users",
            },
          ]}
          config={{
            value: { label: "Users", color: "hsl(var(--chart-1))" },
          }}
          cardClassName="w-full sm:max-w-xs bg-background"
        />
      </div>

    
      <div className="grid w-full flex-1 gap-6">
        <StatsCard3
          metrics={[
            {
              label: "Total Users",
              current: userStats.totalUsers,
              goal: userStats.totalUsers + 100,
              unit: "users",
              color: "hsl(var(--chart-1))",
            },
            {
              label: "Active Users",
              current: userStats.activeUsers,
              goal: userStats.totalUsers,
              unit: "users",
              color: "hsl(var(--chart-2))",
            },
          ]}
          cardClassName="w-full sm:max-w-xs bg-background"
        />

        <StatsCard6
          title="Avg Users/Project"
          value={projectStats.avgUsersPerProject}
          unit="users"
          data={projectActivity.slice(-5)}
          dataKey="value"
          xAxisKey="date"
          configLabel="Users"
          cardClassName="w-full sm:max-w-xs bg-background"
        />

        <StatsCard8
          description="User Stats"
          value={userStats.totalUsers}
          unit="users"
          secondaryValue={userStats.activeUsers}
          secondaryUnit="active"
          data={userGrowth}
          dataKey="value"
          xAxisKey="date"
          configLabel="Users"
          tooltipFormatter={(value) => (
            <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
              Users
              <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                {value}
                <span className="font-normal text-muted-foreground">users</span>
              </div>
            </div>
          )}
          cardClassName="w-full sm:max-w-xs bg-background"
        />
      </div>
    </div>
  );
}
