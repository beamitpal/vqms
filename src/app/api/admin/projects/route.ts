import {  NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Add admin authorization logic here (e.g., check admin role)
    const projects = await prisma.project.findMany({
      include: { business: true },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}