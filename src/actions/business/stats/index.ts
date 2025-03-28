
"use server";

import { prisma } from "@/lib/prisma";
import { ProjectStats, TimeSeriesData, UserStats } from "@/lib/types";
import { ProjectStatus } from "@prisma/client";


export async function getProjectStats(businessId: string): Promise<ProjectStats> {
  const [projectCount, publicCount, privateCount, unlistedCount, users] = await Promise.all([
    prisma.project.count({ where: { businessId } }),
    prisma.project.count({ where: { businessId, status: ProjectStatus.PUBLIC } }),
    prisma.project.count({ where: { businessId, status: ProjectStatus.PRIVATE } }),
    prisma.project.count({ where: { businessId, status: ProjectStatus.UNLISTED } }),
    prisma.user.groupBy({
      by: ["projectId"],
      where: { project: { businessId } },
      _count: { id: true },
    }),
  ]);

  const avgUsersPerProject = projectCount > 0
    ? users.reduce((sum, curr) => sum + curr._count.id, 0) / projectCount
    : 0;

  return {
    totalProjects: projectCount,
    publicProjects: publicCount,
    privateProjects: privateCount,
    unlistedProjects: unlistedCount,
    avgUsersPerProject: Math.round(avgUsersPerProject * 100) / 100,
  };
}

export async function getUserStats(businessId: string): Promise<UserStats> {
  const [totalUsers, activeUsers, projectUsers] = await Promise.all([
    prisma.user.count({ where: { project: { businessId } } }),
    prisma.user.count({ where: { project: { businessId }, status: "ACTIVE" } }),
    prisma.project.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        users: { select: { id: true } },
      },
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    usersByProject: projectUsers.map(p => ({
      projectId: p.id,
      projectName: p.name,
      userCount: p.users.length,
    })),
  };
}

export async function getUserGrowth(businessId: string): Promise<TimeSeriesData[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const userGrowth = await prisma.user.groupBy({
    by: ["createdAt"],
    where: {
      project: { businessId },
      createdAt: { gte: thirtyDaysAgo },
    },
    _count: { id: true },
  });

  const dailyData: { [key: string]: number } = {};
  userGrowth.forEach(entry => {
    const date = entry.createdAt.toISOString().split("T")[0];
    dailyData[date] = (dailyData[date] || 0) + entry._count.id;
  });

  return Object.entries(dailyData).map(([date, value]) => ({
    date,
    value,
  })).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getProjectActivity(businessId: string): Promise<TimeSeriesData[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const projectActivity = await prisma.project.groupBy({
    by: ["createdAt"],
    where: {
      businessId,
      createdAt: { gte: thirtyDaysAgo },
    },
    _count: { id: true },
  });

  const dailyData: { [key: string]: number } = {};
  projectActivity.forEach(entry => {
    const date = entry.createdAt.toISOString().split("T")[0];
    dailyData[date] = (dailyData[date] || 0) + entry._count.id;
  });

  return Object.entries(dailyData).map(([date, value]) => ({
    date,
    value,
  })).sort((a, b) => a.date.localeCompare(b.date));
}