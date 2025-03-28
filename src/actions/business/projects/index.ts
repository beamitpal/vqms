"use server";

import { prisma } from "@/lib/prisma";
import { ProjectUpdateInput, ProjectTypes, ProjectWithUsers } from "@/lib/types";
import { Project, ProjectStatus, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"; 





export async function listAllProjects({ 
  businessId, 
  status 
}: { 
  businessId: string;
  status?: ProjectStatus;
}): Promise<Omit<ProjectWithUsers, "users" | "updatedAt">[]> {
  return prisma.project.findMany({
    where: { 
      businessId,
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




export async function getProjectByUsername(username: string, businessId: string): Promise<ProjectTypes | null> {
  return prisma.project.findFirst({
    where: { username, businessId },
    include: {
      users: true,
    },
  });
}



export async function createProject(businessId: string, businessEmail: string, data: Omit<Project, "id" | "createdAt" | "updatedAt" | "users">): Promise<ProjectWithUsers> {
  await prisma.business.upsert({
    where: { id: businessId },
    update: { email: businessEmail },
    create: {
      id: businessId,
      email: businessEmail,
    },
  });
  return prisma.project.create({
    data: {
      ...data,
      businessId,
      customFields: data.customFields || Prisma.JsonNull,
    },
    include: {
      users: true,
    },
  });
}


export async function deleteProjectById(projectId: string, businessId: string): Promise<ProjectWithUsers> {
  return prisma.project.delete({
    where: { id: projectId, businessId },
    include: {
      users: true,
    },
  });
}


export async function updateProjectById(projectId: string, businessId: string, data: ProjectUpdateInput): Promise<ProjectWithUsers> {
  return prisma.project.update({
    where: { id: projectId, businessId },
    data: {
      ...data,
      customFields: data.customFields !== undefined ? (data.customFields as Prisma.InputJsonValue) : undefined,
      updatedAt: new Date(),
    },
    include: {
      users: true,
    },
  });
}

export async function updateProjectNameAndDescription(
  projectId: string,
  businessId: string,
  data: { fullname: string; description: string }
): Promise<ProjectWithUsers> {
  return updateProjectById(projectId, businessId, {
    name: data.fullname,
    description: data.description,
  });
}


export async function updateProjectStatus(
  projectId: string,
  businessId: string,
  status: ProjectStatus
): Promise<ProjectWithUsers> {
  return updateProjectById(projectId, businessId, {
    status,
  });
}


export async function updateProjectCustomFields(
  projectId: string,
  businessId: string,
  customFields: Record<string, { type: "text" | "textarea"; defaultValue: string }>
): Promise<ProjectWithUsers> {
  return updateProjectById(projectId, businessId, {
    customFields,
  });
}


export async function regenerateProjectApiKey(projectId: string, businessId: string): Promise<ProjectWithUsers> {
  return updateProjectById(projectId, businessId, {
    apiKey: uuidv4(), 
  });
}

export async function fetchProjectCustomFields(username: string) {
  const project = await prisma.project.findUnique({
    where: { username },
    select: {
      id: true,
      customFields: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }


  return {
    projectId: project.id,
    customFields: project.customFields
      ? (project.customFields as Record<string, { type: string; defaultValue: string }>)
      : {},
  };
}



