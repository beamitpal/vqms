"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Missing businessId" }, { status: 400 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        description: true,
        username: true,
        status: true,
        apiKey: true,
        customFields: true,
        createdAt: true,
        businessId: true,
      },
    });
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("List projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}