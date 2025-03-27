import {  NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Add admin authorization logic here
    const businesses = await prisma.business.findMany({
      include: { projects: true },
    });
    return NextResponse.json(businesses);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}