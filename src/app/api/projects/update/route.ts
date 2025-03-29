"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProjectUpdateInput } from "@/lib/types";
import { Prisma } from "@prisma/client";

export async function PATCH(request: Request) {
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
  const data: ProjectUpdateInput = await request.json();

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 400 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { apiKey },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updatedProject = await prisma.project.update({
      where: { apiKey },
      data: {
        ...data,
        customFields:
          data.customFields !== undefined
            ? (data.customFields as Prisma.InputJsonValue)
            : undefined,
        updatedAt: new Date(),
      },
      include: { users: true },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}