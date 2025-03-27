"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBusiness } from "@/lib/auth";
import {
  getProjectByUsername,
  updateProjectNameAndDescription,
  updateProjectStatus,
  updateProjectCustomFields,
  regenerateProjectApiKey,
  deleteProjectById, // Import the new function
} from "@/actions/business/projects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronLeft, RefreshCw, Trash2 } from "lucide-react";
import {
  projectfulllnameAndDescriptionUpdateFormSchema,
  ProjectTypes,
  customFieldTemplateSchema,
  projectStatusUpdateFormSchema,
} from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type CustomFieldTemplate = Record<
  string,
  { type: "text" | "textarea"; defaultValue: string }
>;

function Page() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [project, setProject] = useState<ProjectTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;
      try {
        const businessId = await getBusiness();
        const result = await getProjectByUsername(slug, businessId.id);
        setProject(result || null);
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

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <RefreshCw className="animate-spin m-2" />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;
  if (!project) return <div className="text-center">Project not found</div>;

  return (
    <>
      <div className="flex items-center gap-2 min-w-0">
        <Link href="/business/projects">
          <Button variant="outline" className=" bg-background">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-lg sm:text-xl font-semibold tracking-tight truncate">
          Project Details
        </h1>
        <Badge variant="outline" className="shrink-0">
          {project.username}
        </Badge>
        <div className="flex  lg:hidden items-center gap-2 mt-2 sm:mt-0">
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
        </div>
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
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ProjectNameAndDescriptionEditCard
            project={project}
            setProject={setProject}
          />
          <ProjectCustomFieldsEditCard
            project={project}
            setProject={setProject}
          />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <ProjectStatusEditCard project={project} setProject={setProject} />
          <ProjectApiKey project={project} setProject={setProject} />
        </div>
      </div>
    </>
  );
}

function ProjectNameAndDescriptionEditCard({
  project,
  setProject,
}: {
  project: ProjectTypes;
  setProject: React.Dispatch<React.SetStateAction<ProjectTypes | null>>;
}) {
  const form = useForm<
    z.infer<typeof projectfulllnameAndDescriptionUpdateFormSchema>
  >({
    resolver: zodResolver(projectfulllnameAndDescriptionUpdateFormSchema),
    defaultValues: {
      fullname: project.name || "",
      description: project.description || "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof projectfulllnameAndDescriptionUpdateFormSchema>
  ) {
    try {
      const businessId = await getBusiness();
      const updatedProject = await updateProjectNameAndDescription(
        project.id,
        businessId.id,
        values
      );
      setProject(updatedProject);
      console.log("Project name and description updated:", values);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Project Name</CardTitle>
        <CardDescription>
          Update Your Project Name and Description Here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC PVT. LTD." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your project&apos;s full name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write description about your project"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your project&apos;s description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

function ProjectStatusEditCard({
  project,
  setProject,
}: {
  project: ProjectTypes;
  setProject: React.Dispatch<React.SetStateAction<ProjectTypes | null>>;
}) {
  const form = useForm<z.infer<typeof projectStatusUpdateFormSchema>>({
    resolver: zodResolver(projectStatusUpdateFormSchema),
    defaultValues: {
      status: project.status || "PRIVATE",
    },
  });

  async function onSubmit(
    values: z.infer<typeof projectStatusUpdateFormSchema>
  ) {
    try {
      const businessId = await getBusiness();
      const updatedProject = await updateProjectStatus(
        project.id,
        businessId.id,
        values.status
      );
      setProject(updatedProject);
      console.log("Project status updated:", values.status);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
        <CardDescription>Update Your Project Status Here</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="UNLISTED">Unlisted</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This is the current status of your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

function ProjectCustomFieldsEditCard({
  project,
  setProject,
}: {
  project: ProjectTypes;
  setProject: React.Dispatch<React.SetStateAction<ProjectTypes | null>>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // Loading state for adding
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Loading state for deleting, tracks fieldName
  const [customFieldsTemplate, setCustomFieldsTemplate] =
    useState<CustomFieldTemplate>(
      (project.customFields as CustomFieldTemplate) || {}
    );

  const form = useForm<z.infer<typeof customFieldTemplateSchema>>({
    resolver: zodResolver(customFieldTemplateSchema),
    defaultValues: {
      fieldName: "",
      fieldType: "text",
    },
  });

  async function onSubmit(values: z.infer<typeof customFieldTemplateSchema>) {
    setIsAdding(true); // Start loading
    const updatedTemplate: CustomFieldTemplate = {
      ...customFieldsTemplate,
      [values.fieldName]: {
        type: values.fieldType,
        defaultValue: "",
      },
    };
    try {
      const businessId = await getBusiness();
      const updatedProject = await updateProjectCustomFields(
        project.id,
        businessId.id,
        updatedTemplate
      );
      setCustomFieldsTemplate(updatedTemplate);
      setProject(updatedProject);
      console.log("Custom fields updated:", updatedTemplate);
    } catch (error) {
      console.error("Failed to update custom fields:", error);
    } finally {
      setIsAdding(false); // Stop loading
      setIsDialogOpen(false);
      form.reset();
    }
  }

  async function handleDelete(fieldName: string) {
    setIsDeleting(fieldName); // Start loading for this specific field
    const updatedTemplate = { ...customFieldsTemplate };
    delete updatedTemplate[fieldName];
    try {
      const businessId = await getBusiness();
      const updatedProject = await updateProjectCustomFields(
        project.id,
        businessId.id,
        updatedTemplate
      );
      setCustomFieldsTemplate(updatedTemplate);
      setProject(updatedProject);
      console.log("Custom field deleted:", fieldName);
    } catch (error) {
      console.error("Failed to delete custom field:", error);
    } finally {
      setIsDeleting(null); // Stop loading
    }
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Custom Fields Template</CardTitle>
        <CardDescription>
          Define custom fields for users in this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(customFieldsTemplate).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(customFieldsTemplate).map(
              ([fieldName, fieldInfo]) => (
                <div key={fieldName} className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      {fieldName} ({fieldInfo.type})
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(fieldName)}
                      disabled={isDeleting === fieldName} // Disable while deleting this field
                    >
                      {isDeleting === fieldName ? (
                        <RefreshCw className="animate-spin mr-2" />
                      ) : (
                        <Trash2 className="mr-2" />
                      )}
                      Delete
                    </Button>
                  </div>
                  {fieldInfo.type === "textarea" ? (
                    <Textarea
                      value={fieldInfo.defaultValue}
                      disabled
                      placeholder="Field value will be filled by users"
                    />
                  ) : (
                    <Input
                      value={fieldInfo.defaultValue}
                      disabled
                      placeholder="Field value will be filled by users"
                    />
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No custom fields defined yet.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Add Custom Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a Custom Field</DialogTitle>
              <DialogDescription>
                Add a new field that users will fill in the portal.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fieldName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Reason" {...field} />
                      </FormControl>
                      <FormDescription>
                        This field will be shown to users to fill out.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fieldType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how users will input this field.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAdding} // Disable while adding
                >
                  {isAdding ? (
                    <RefreshCw className="animate-spin mr-2" />
                  ) : null}
                  Add Field
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

function ProjectApiKey({
  project,
  setProject,
}: {
  project: ProjectTypes;
  setProject: React.Dispatch<React.SetStateAction<ProjectTypes | null>>;
}) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  async function handleRegenerateApiKey() {
    setIsRegenerating(true);
    try {
      const businessId = await getBusiness();
      const updatedProject = await regenerateProjectApiKey(
        project.id,
        businessId.id
      );
      setProject(updatedProject);
      console.log("API key regenerated:", updatedProject.apiKey);
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>API Key</CardTitle>
        <CardDescription>Change Your API key here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>API Key</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateApiKey}
              disabled={isRegenerating}
            >
              <RefreshCw className={isRegenerating ? "animate-spin" : ""} />{" "}
              Change
            </Button>
          </div>
          <Input value={project.apiKey} disabled placeholder="API Key" />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default Page;
