import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";

  import React from "react";
  
  export function ReusableBreadCrumb({ path = "" }) {
    // Split the path into segments, filter out empty strings (e.g., from leading/trailing slashes)
    const segments = path.split("/").filter((segment) => segment.length > 0);
  
    return (
      <Breadcrumb>
        <BreadcrumbList>
         
  
          {segments.map((segment, index) => {
            // Build the URL up to this segment
            const url = `/${segments.slice(0, index + 1).join("/")}`;
            const isLast = index === segments.length - 1;
  
            return (
              <React.Fragment key={segment}>
                <BreadcrumbItem>
                  {isLast ? (
                    // Last segment is the current page (no link)
                    <BreadcrumbPage>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbPage>
                  ) : (
                    // Earlier segments are links
                    <BreadcrumbLink href={url}>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }