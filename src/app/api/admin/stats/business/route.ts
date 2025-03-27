import {  NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Add admin authorization logic here if needed

    // Step 1: Get total number of businesses
    const businessCount = await prisma.business.aggregate({
      _count: { id: true },
    });

    // Step 2: Get total number of projects across all businesses
    const projectCount = await prisma.project.aggregate({
      _count: { id: true },
    });

    // Step 3: Calculate average projects per business
    const totalBusinesses = businessCount._count.id;
    const totalProjects = projectCount._count.id;
    const averageProjectsPerBusiness = totalBusinesses > 0 ? totalProjects / totalBusinesses : 0;

    return NextResponse.json({
      totalBusinesses,
      averageProjectsPerBusiness,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}