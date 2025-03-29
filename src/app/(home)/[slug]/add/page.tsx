"use client";

import { fetchProjectCustomFields } from "@/actions/business/projects";
import Logo from "@/components/brand/logo";
import DynamicUserForm from "@/components/user/form";
import { CustomFieldsType } from "@/lib/types";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function Page() {
  const params = useParams();
  const slug = params?.slug as string;

  const [projectId, setProjectId] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<CustomFieldsType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { projectId, customFields } = await fetchProjectCustomFields(
          slug
        );

        if (customFields && typeof customFields === "object") {
          setCustomFields(customFields as CustomFieldsType);
        } else {
          setCustomFields({});
        }

        setProjectId(projectId);
      } catch {
        toast.error("Failed to get the project");
        setError("Project not found");
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!projectId || !customFields) {
    return (
      <div className="h-screen flex justify-center items-center">
        <RefreshCw className="animate-spin m-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 sm:p-6 md:p-8 space-y-6">
      <Link
        href="/business"
        className="flex items-center gap-2 self-center font-medium text-lg"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Logo className="size-6" />
        </div>
        VQMS
      </Link>

      <DynamicUserForm
        projectId={projectId}
        customFields={customFields}
        toLink={slug}
      />
    </div>
  );
}

export default Page;
