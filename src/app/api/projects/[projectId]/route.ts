"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
  const byUsername = searchParams.get("byUsername") === "true";

  if (!projectId || !businessId || !apiKey) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const project = byUsername
      ? await prisma.project.findFirst({
          where: { username: projectId, businessId },
          include: { users: true },
        })
      : await prisma.project.findUnique({
          where: { id: projectId, businessId },
          include: { users: true },
        });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.apiKey !== apiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!projectId || !businessId || !apiKey) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId, businessId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.apiKey !== apiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const deletedProject = await prisma.project.delete({
      where: { id: projectId, businessId },
      include: { users: true },
    });

    return NextResponse.json({ success: true, project: deletedProject });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}