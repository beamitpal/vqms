"use client";
import { useEffect, useState } from "react";
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
} from "@/actions/business/projects"; // Added deleteProjectById
import { getBusiness } from "@/lib/auth";
import { ProjectTypes } from "@/lib/types";
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
} from "@/components/projects/users-table/users-coloumns/coloumns";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter(); // Added router
  const slug = params?.slug as string;
  const [project, setProject] = useState<ProjectTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Added delete loading state

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;
      try {
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
    }
    fetchProject();
  }, [slug]);

  const handleDelete = async () => {
    if (!project) return;
    setIsDeleting(true);
    try {
      const businessId = await getBusiness();
      await deleteProjectById(project.id, businessId.id);
      router.push("/business/projects"); // Redirect after successful deletion
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred while deleting"
      );
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="h-screen flex justify-center items-center"> <RefreshCw className="animate-spin m-2" /></div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;
  if (!project) return <div className="text-center">Project not found</div>;

  return (
    <div className="grid w-full auto-rows-max gap-4">
      <div className="flex sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Link href="/business/projects">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-background"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h1 className=" shrink-0 whitespace-nowrap text-lg sm:text-xl font-semibold tracking-tight truncate">
            Project Details
          </h1>
          <Badge variant="outline" className="shrink-0">
            {project.username}
          </Badge>
        </div>
        {/* Icon Buttons for Small Devices */}
        <div className="flex lg:hidden items-center gap-2 mt-2 sm:mt-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 bg-background"
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
                  This action cannot be undone. This will permanently delete the
                  project and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Link href={`/business/projects/${slug}/edit`}>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-background"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Details</span>
            </Button>
          </Link>
        </div>
        {/* Text Buttons with Icons for Large Devices */}
        <div className="hidden lg:flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Link href={`/business/projects/${slug}/edit`}>
            <Button size="sm" className="flex items-center gap-1">
              <Pencil className="h-4 w-4" />
              Edit Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Details Card */}
      <Card className="w-full bg-background">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight truncate w-full sm:w-auto">
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
        <CardFooter className="grid gap-2">
          <Label htmlFor="apikey" className="text-xs sm:text-sm">
            API Key
          </Label>
          <div className="relative flex items-center w-full">
            <Input
              id="apikey"
              type={showApiKey ? "text" : "password"}
              defaultValue={project.apiKey}
              disabled
              className="w-full text-xs sm:text-sm truncate"
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

      {/* Users Table Card */}
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Project Users
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            A list of users associated with this project
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full max-w-full overflow-hidden">
          <DataTable
            columns={userColumns}
            data={project.users || []}
            filterKey="status"
            filterOptions={userFilterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
