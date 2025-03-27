import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Add admin authorization logic here if needed

    // Step 1: Get total number of projects
    const projectCount = await prisma.project.aggregate({
      _count: { id: true },
    });

    // Step 2: Get total number of users across all projects
    const userCount = await prisma.user.aggregate({
      _count: { id: true },
    });

    // Step 3: Calculate average users per project
    const totalProjects = projectCount._count.id;
    const totalUsers = userCount._count.id;
    const averageUsersPerProject = totalProjects > 0 ? totalUsers / totalProjects : 0;

    return NextResponse.json({
      totalProjects,
      averageUsersPerProject,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}