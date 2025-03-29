"use client";
import ProjectCard from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { createProjectSchema, ProjectListItem } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { createProject, listAllProjects } from "@/actions/business/projects";
import { getBusiness } from "@/lib/auth";

export default function Page() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      fullname: "",
      description: "",
      username: "",
    },
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const businessId = await getBusiness();
      const fetchedProjects = await listAllProjects({
        businessId: businessId.id,
      });
      setProjects(fetchedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof createProjectSchema>) {
    setIsCreating(true);
    setFormError(null);

    try {
      const businessId = await getBusiness();
      const projectData = {
        name: values.fullname,
        description: values.description,
        username: values.username,
        status: "PRIVATE" as const,
        businessId: businessId.id,
        customFields: null,
        apiKey: uuidv4(),
      };

      const createProjectArr = {
        businessId: businessId.id,
        businessEmail: businessId.email,
        data: projectData,
      };

      await createProject(
        createProjectArr.businessId,
        createProjectArr.businessEmail,
        createProjectArr.data
      );
      await fetchProjects();
      form.reset();
      setIsDialogOpen(false);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Unique constraint failed on the fields: (`username`)")) {
        setFormError("This username is already taken. Please choose a different one.");
      } else {
        setFormError(err instanceof Error ? err.message : "Failed to create project");
      }
    } finally {
      setIsCreating(false);
    }
  }


  const CreateProjectDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="mt-4">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Create a project to get started</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., google (for https://example.com/google)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your unique project URL.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your project description here."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Describe your project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <Button className="w-full" type="submit" disabled={isCreating}>
              {isCreating ? (
                <RefreshCw className="animate-spin mr-2" />
              ) : (
                <PlusIcon className="mr-2" />
              )}
              Create Project
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Projects</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="max-w-sm">
              <PlusIcon className="mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Project</DialogTitle>
              <DialogDescription>Create a new project to get started</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC" {...field} />
                      </FormControl>
                      <FormDescription>This is your public display name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., google (for https://example.com/google)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>This is your unique project URL.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your project description here."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Describe your project.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {formError && <p className="text-red-500 text-sm">{formError}</p>}
                <Button className="w-full" type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <RefreshCw className="animate-spin mr-2" />
                  ) : (
                    <PlusIcon className="mr-2" />
                  )}
                  Create Project
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
          {Array(6).fill(0).map((_, index) => (
            <Skeleton key={index} className="max-w-sm bg-background h-56 border-1" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 mt-4">{error}</div>
      ) : projects.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.username}
              name={project.name}
              description={project.description}
              link={project.username}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no projects</h3>
            <p className="text-sm text-muted-foreground">
              You can save time as soon as you add a project.
            </p>
            <CreateProjectDialog />
          </div>
        </div>
      )}
    </>
  );
}