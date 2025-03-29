
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectWithUsers, UserData } from "@/lib/types"; // Import UserData
import Link from "next/link";
import { ExternalLink, RefreshCw } from "lucide-react";
import Logo from "@/components/brand/logo";
import { getProjectByUsernameForUser } from "@/actions/users/business";


export default function ProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [project, setProject] = useState<ProjectWithUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectData() {
      try {
        setLoading(true);
        const projectData = await getProjectByUsernameForUser(slug);
        setProject(projectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProjectData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
      <RefreshCw className="animate-spin m-2" />
    </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-screen flex items-center justify-center">
        {error || "Project not found"}
      </div>
    );
  }

  if (project.status !== "PUBLIC") {
    return (
      <div className="h-screen flex items-center justify-center">
        This project is not public
      </div>
    );
  }

  const sortedActiveUsers = [...project.users]
    .filter((user) => user.status === "ACTIVE")
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
       <div className="flex justify-center items-center gap-2">
       <Link
          href="/business"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Logo className="size-16" />
          </div>
          VQMS
        </Link>
       </div>
       
        <Card className="bg-background">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{project.name}</CardTitle>
              <Badge>{project.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">@{project.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{project.description}</p>
            </div>
          </CardContent>
        </Card>

       
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Users in the Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedActiveUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActiveUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {(user.data as UserData)?.data?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {(user.data as UserData)?.data?.email || "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No active users found</p>
            )}
          </CardContent>
        </Card>

        
        <div className="flex justify-center items-center">
          <Link href={`/${slug}/add`}>
            <Button className="w-full">
              <ExternalLink />
              Add Yourself to Business Queue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
