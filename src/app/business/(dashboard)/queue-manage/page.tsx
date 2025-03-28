
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectWithUsers, UserData } from "@/lib/types";
import {
  listAllProjects,

} from "@/actions/business/projects/index";

import { useFormStatus } from "react-dom";
import { getBusiness } from "@/lib/auth";
import { deactivateUser, getFirstActiveUser } from "@/actions/users/business";

export default function QueueManagePage() {
  const [projects, setProjects] = useState<
    Omit<ProjectWithUsers, "users" | "updatedAt">[]
  >([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchProjects = async () => {
    try {
      const business = await getBusiness();
      const businessId = business?.id;
      const fetchProjectsAction = async () => {
        return await listAllProjects({ businessId, status: "PUBLIC" });
      };
      const projectData = await fetchProjectsAction();
      setProjects(projectData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    }
  };


  const fetchFirstActiveUser = async (projectId: string) => {
    try {
      setLoading(true);
      const fetchUserAction = async () => {
        return await getFirstActiveUser(projectId);
      };
      const userData = await fetchUserAction();

      setUser(
        userData
          ? {
              ...userData,
              createdAt: userData.createdAt.toISOString(),
              updatedAt: userData.updatedAt?.toISOString(), 
              data:
                typeof userData.data === "string"
                  ? JSON.parse(userData.data)
                  : userData.data,
            }
          : null
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchFirstActiveUser(selectedProjectId);
    }
  }, [selectedProjectId]);

  const onDeactivate = async (formData: FormData) => {
    try {
      await handleDeactivate(formData); 
      if (selectedProjectId) {
        await fetchFirstActiveUser(selectedProjectId); 
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to deactivate user"
      );
    }
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">{error}</div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center space-y-8">
   
      <Card className="w-full max-w-md bg-background overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">
            Select Project
          </CardTitle>
          <CardDescription>Choose Project From The List</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {projects.length > 0 ? (
            <Select
              onValueChange={(value) => setSelectedProjectId(value)}
              value={selectedProjectId || ""}
            >
              <SelectTrigger className="w-full border rounded-md py-2 px-3">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="bg-background border rounded-md shadow-md">
                {projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id}
                    className="py-2 px-4 hover:bg-gray-100"
                  >
                    {project.name} (@{project.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-muted-foreground text-center">
              No projects found
            </p>
          )}
        </CardContent>
      </Card>

 
      {selectedProjectId && (
        <Card className="w-full max-w-md bg-background overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">
              User Details
            </CardTitle>
            <CardDescription>Check The Users Details Here</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : user ? (
              <>
               
                {user.data && typeof user.data === "object" && (
                  <div className="grid gap-4">
                    {Object.entries(user.data).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col p-3 rounded-md border"
                      >
                        <p className="text-sm capitalize font-medium">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="font-medium mt-1">
                          {value !== null && value !== undefined
                            ? String(value)
                            : "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-3 rounded-md border">
                  <p className="text-sm text-muted-foreground capitalize font-medium">
                    Created At
                  </p>
                  <p className="font-medium mt-1">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <form action={onDeactivate}>
                  <input type="hidden" name="userId" value={user.id} />
                  {user.id && <DeactivateButton />}
                </form>
              </>
            ) : (
              <p className="text-muted-foreground text-center">
                No active users found
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

async function handleDeactivate(formData: FormData) {
  const userId = formData.get("userId") as string;
  if (!userId) return;

  await deactivateUser(userId);
}

function DeactivateButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full py-2 mt-4"
      variant="default"
      disabled={pending}
    >
      {pending ? "Processing..." : "Done"}
    </Button>
  );
}
