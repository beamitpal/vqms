"use server";

import { prisma } from "@/lib/prisma";
import { ProjectUpdateInput, ProjectTypes } from "@/lib/types";
import { Project, ProjectStatus, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating new API keys

// Define the full Project type with users included
type ProjectWithUsers = Prisma.ProjectGetPayload<{
  include: { users: true };
}>;

// List all projects for a business
export async function listAllProjects({ businessId }: { businessId: string }): Promise<Omit<Project, "users" | "updatedAt">[]> {
  return prisma.project.findMany({
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
}

// Get a project by username
export async function getProjectByUsername(username: string, businessId: string): Promise<ProjectTypes | null> {
  return prisma.project.findFirst({
    where: { username, businessId },
    include: {
      users: true,
    },
  });
}

// Create a new project
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

// Delete a project by ID
export async function deleteProjectById(projectId: string, businessId: string): Promise<ProjectWithUsers> {
  return prisma.project.delete({
    where: { id: projectId, businessId },
    include: {
      users: true,
    },
  });
}

// Update a project by ID (general update)
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

// Specific update for Name and Description
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

// Specific update for Status
export async function updateProjectStatus(
  projectId: string,
  businessId: string,
  status: ProjectStatus
): Promise<ProjectWithUsers> {
  return updateProjectById(projectId, businessId, {
    status,
  });
}

// Specific update for Custom Fields
export async function updateProjectCustomFields(
  projectId: string,
  businessId: string,
  customFields: Record<string, { type: "text" | "textarea"; defaultValue: string }>
): Promise<ProjectWithUsers> {
  return updateProjectById(projectId, businessId, {
    customFields,
  });
}

// Regenerate API Key
export async function regenerateProjectApiKey(projectId: string, businessId: string): Promise<ProjectWithUsers> {
  return updateProjectById(projectId, businessId, {
    apiKey: uuidv4(), // Generate a new UUID for the API key
  });
}