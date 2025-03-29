"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");

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
      data: { apiKey: uuidv4(), updatedAt: new Date() },
      include: { users: true },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Regenerate API key error:", error);
    return NextResponse.json({ error: "Failed to regenerate API key" }, { status: 500 });
  }
}