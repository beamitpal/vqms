import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ProjectCardProps } from "@/lib/types";

function ProjectCard({ name, link, description }: ProjectCardProps) {
  return (
    <Link href={"/business/projects/" + link}>
      <Card className="max-w-sm bg-background ">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {name}
          </CardTitle>
          <Button variant="outline" className="rounded-full" size="icon">
            <ChevronRight />
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
       
      </Card>
    </Link>
  );
}

export default ProjectCard;
