"use server";

import { prisma } from "@/lib/prisma";
import { ProjectTypes, ProjectWithUsers } from "@/lib/types";

import { ProjectStatus, User, } from "@prisma/client";
import { toast } from "sonner";




export async function listAllProjectsForUser({
    status
}: {
    status?: ProjectStatus;
}): Promise<Omit<ProjectWithUsers, "users" | "updatedAt">[]> {
    return prisma.project.findMany({
        where: {
            ...(status && { status }) 
        },
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
}
export async function getProjectByUsernameForUser(username: string): Promise<ProjectTypes | null> {
  return prisma.project.findFirst({
    where: { username },
    include: {
      users: true,
    },
  });
}

export async function createUserFromForm(projectId: string, formData: Record<string, string>) {
  try {
    const user = await prisma.user.create({
      data: {
        projectId,
        status: "ACTIVE",
        data: formData, 
      },
    });
    return { success: true, user };
  } catch  {
  toast.error("Failed to submit the form")
    return { success: false, error: "Failed to create user" };
  }
}

export async function deleteUserById(userId: string): Promise<User> {
  return prisma.user.delete({
    where: { id: userId },
  });
}


export async function getFirstActiveUser(projectId: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      projectId,
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}




export async function deactivateUser(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        status: "INACTIVE",
        updatedAt: new Date(), 
      },
    });
  }