"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  if (!apiKey || !businessId) {
    return NextResponse.json({ error: "Missing API key or businessId" }, { status: 400 });
  }

  try {
    const project = await prisma.project.findFirst({
      where: { apiKey, businessId },
    });

    if (!project) {
      return NextResponse.json({ error: "Invalid API key or businessId" }, { status: 401 });
    }

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