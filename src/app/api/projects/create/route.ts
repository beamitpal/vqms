"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";

export async function POST(request: Request) {
  try {
    const { businessId, businessEmail, data } = await request.json();

    if (!businessId || !businessEmail || !data?.name || !data?.username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.business.upsert({
      where: { id: businessId },
      update: { email: businessEmail },
      create: { id: businessId, email: businessEmail }, 
    });

    const project = await prisma.project.create({
      data: {
        ...data,
        businessId,
        apiKey: uuidv4(),
        customFields: data.customFields || Prisma.JsonNull,
      },
      include: { users: true },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch {
    toast.error("Create project error:");
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}