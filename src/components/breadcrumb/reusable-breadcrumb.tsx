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

    const segments = path.split("/").filter((segment) => segment.length > 0);
  
    return (
      <Breadcrumb>
        <BreadcrumbList>
         
  
          {segments.map((segment, index) => {

            const url = `/${segments.slice(0, index + 1).join("/")}`;
            const isLast = index === segments.length - 1;
  
            return (
              <React.Fragment key={segment}>
                <BreadcrumbItem>
                  {isLast ? (
                  
                    <BreadcrumbPage>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbPage>
                  ) : (
                  
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