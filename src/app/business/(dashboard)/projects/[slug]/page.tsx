"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, EyeOff, Trash2, Pencil, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  getProjectByUsername,
  deleteProjectById,
} from "@/actions/business/projects";
import { getBusiness } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/projects/users-table/data-table";
import {
  userColumns,
  userFilterOptions,
} from "@/components/projects/users-table/users-columns/columns";
import { CustomField, ProjectTypes } from "@/lib/types";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [project, setProject] = useState<ProjectTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProject = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const businessId = await getBusiness();
      const result = await getProjectByUsername(slug, businessId.id);
      setProject(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleDelete = async () => {
    if (!project) return;
    setIsDeleting(true);
    try {
      const businessId = await getBusiness();
      await deleteProjectById(project.id, businessId.id);
      router.push("/business/projects");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred while deleting"
      );
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    await fetchProject();
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <RefreshCw className="animate-spin m-2" />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;
  if (!project) return <div className="text-center">Project not found</div>;

  const customFields = project.customFields
    ? (project.customFields as Record<string, CustomField>)
    : {};

  return (
    <div className="w-full min-w-[320px] px-4 py-6 mx-auto overflow-x-hidden">
      <div className="flex flex-col gap-4 w-full">

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-wrap w-full">
          <Link href="/business/projects">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-background flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h1 className="shrink-0 whitespace-nowrap text-lg sm:text-xl font-semibold tracking-tight truncate">
              Project Details
            </h1>
            <Badge variant="outline" className="shrink-0">
              @{project.username}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-background flex-shrink-0"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-background flex-shrink-0"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the project and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Continue"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Link href={`/business/projects/${slug}/edit`}>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 bg-background flex-shrink-0"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Details</span>
              </Button>
            </Link>
          </div>
        </div>


        <Card className="w-full bg-background">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 w-full">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight truncate flex-1">
                {project.name ?? "Untitled Project"}
              </CardTitle>
              <Badge variant="outline" className="shrink-0">
                {project.status}
              </Badge>
            </div>
            <CardDescription className="leading-6 mt-2 text-xs sm:text-sm truncate">
              {project.createdAt.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CardDescription className="leading-6 text-xs sm:text-sm break-words">
              {project.description ?? "No description available"}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 w-full">
            <Label htmlFor="apikey" className="text-xs sm:text-sm w-full">
              API Key
            </Label>
            <div className="relative flex items-center w-full">
              <Input
                id="apikey"
                type={showApiKey ? "text" : "password"}
                defaultValue={project.apiKey}
                disabled
                className="w-full text-xs sm:text-sm truncate pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 p-1"
                onClick={() => setShowApiKey((prev) => !prev)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>


        <Card className="w-full bg-background">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl md:text-2xl">
              Project Users
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              A list of users associated with this project
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <div className="w-full overflow-x-auto sm:overflow-x-hidden">
              <DataTable
                columns={userColumns({ customFields })}
                data={project.users || []}
                filterKey="status"
                filterOptions={userFilterOptions}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}