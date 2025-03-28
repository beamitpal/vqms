
"use server";

import { prisma } from "@/lib/prisma";
import { SystemStats, TimeSeriesData } from "@/lib/types"; 



export async function getSystemStats(): Promise<SystemStats> {
    const [businessCount, projectCount, userCount] = await Promise.all([
        prisma.business.count(),
        prisma.project.count(),
        prisma.user.count(),
    ]);

    const avgProjectsPerBusiness = businessCount > 0 ? projectCount / businessCount : 0;
    const avgUsersPerBusiness = businessCount > 0 ? userCount / businessCount : 0;

    return {
        totalBusinesses: businessCount,
        totalProjects: projectCount,
        totalUsers: userCount,
        avgProjectsPerBusiness: Math.round(avgProjectsPerBusiness * 100) / 100,
        avgUsersPerBusiness: Math.round(avgUsersPerBusiness * 100) / 100,
    };
}

export async function getBusinessGrowth(): Promise<TimeSeriesData[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const businessGrowth = await prisma.business.groupBy({
        by: "createdAt",
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
    });

    const dailyData: { [key: string]: number } = {};
    businessGrowth.forEach(entry => {
        const date = entry.createdAt.toISOString().split("T")[0];
        dailyData[date] = (dailyData[date] || 0) + (entry._count?.id ?? 0);
    });

    return Object.entries(dailyData)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getProjectGrowth(): Promise<TimeSeriesData[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const projectGrowth = await prisma.project.groupBy({
        by: "createdAt",
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
    });

    const dailyData: { [key: string]: number } = {};
    projectGrowth.forEach(entry => {
        const date = entry.createdAt.toISOString().split("T")[0];
        dailyData[date] = (dailyData[date] || 0) + (entry._count?.id ?? 0);
    });

    return Object.entries(dailyData)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getUserGrowth(): Promise<TimeSeriesData[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await prisma.user.groupBy({
        by: "createdAt",
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
    });

    const dailyData: { [key: string]: number } = {};
    userGrowth.forEach(entry => {
        const date = entry.createdAt.toISOString().split("T")[0];
        dailyData[date] = (dailyData[date] || 0) + (entry._count?.id ?? 0);
    });

    return Object.entries(dailyData)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));
}