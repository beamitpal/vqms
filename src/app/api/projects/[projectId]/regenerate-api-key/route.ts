"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
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

    const updatedProject = await prisma.project.update({
      where: { id: projectId, businessId },
      data: { apiKey: uuidv4(), updatedAt: new Date() },
      include: { users: true },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch  {
    toast.error("Regenerate API key error");
    return NextResponse.json({ error: "Failed to regenerate API key" }, { status: 500 });
  }
}