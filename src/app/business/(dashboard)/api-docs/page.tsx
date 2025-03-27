"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ApiDocsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
  };

  const endpoints = [
    {
      name: "List All Projects",
      method: "GET",
      path: "/api/projects/list",
      description: "Retrieve a list of all projects for a given business.",
      params: [
        {
          name: "businessId",
          type: "string",
          description: "The ID of the business (query parameter)",
        },
      ],
      headers: [],
      body: null,
      response: `{ "success": true, "projects": [{ "id": "...", "name": "...", "description": "...", "username": "...", "status": "PUBLIC", "apiKey": "...", "customFields": {}, "createdAt": "...", "businessId": "..." }] }`,
      examples: {
        javascript: `fetch('/api/projects/list?businessId=<businessId>', {
  method: 'GET',
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
        python: `import requests

response = requests.get('http://localhost:3000/api/projects/list', params={'businessId': '<businessId>'})
print(response.json())`,
        curl: `curl -X GET "http://localhost:3000/api/projects/list?businessId=<businessId>"`,
      },
    },
    {
      name: "Get Project",
      method: "GET",
      path: "/api/projects/[projectId]",
      description: "Retrieve a specific project by its ID or username.",
      params: [
        {
          name: "projectId",
          type: "string",
          description: "The ID or username of the project (path parameter)",
        },
        {
          name: "businessId",
          type: "string",
          description: "The ID of the business (query parameter)",
        },
        {
          name: "byUsername",
          type: "boolean",
          description:
            "Set to true to lookup by username (query parameter, optional)",
        },
      ],
      headers: [
        {
          name: "Authorization",
          value: "Bearer <apiKey>",
          description: "Project API key",
        },
      ],
      body: null,
      response: `{ "success": true, "project": { "id": "...", "name": "...", "description": "...", "username": "...", "status": "PUBLIC", "apiKey": "...", "customFields": {}, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `// By ID
fetch('/api/projects/<projectId>?businessId=<businessId>', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer <apiKey>' }
})
  .then(response => response.json())
  .then(data => console.log(data));

// By Username
fetch('/api/projects/<username>?businessId=<businessId>&byUsername=true', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer <apiKey>' }
})
  .then(response => response.json())
  .then(data => console.log(data));`,
        python: `# By ID
import requests
response = requests.get('http://localhost:3000/api/projects/<projectId>', 
  params={'businessId': '<businessId>'}, 
  headers={'Authorization': 'Bearer <apiKey>'}
)
print(response.json())

# By Username
response = requests.get('http://localhost:3000/api/projects/<username>', 
  params={'businessId': '<businessId>', 'byUsername': 'true'}, 
  headers={'Authorization': 'Bearer <apiKey>'}
)
print(response.json())`,
        curl: `# By ID
curl -X GET "http://localhost:3000/api/projects/<projectId>?businessId=<businessId>" -H "Authorization: Bearer <apiKey>"

# By Username
curl -X GET "http://localhost:3000/api/projects/<username>?businessId=<businessId>&byUsername=true" -H "Authorization: Bearer <apiKey>"`,
      },
    },
    {
      name: "Create a Project",
      method: "POST",
      path: "/api/projects/create",
      description: "Create a new project for a business.",
      params: [],
      headers: [],
      body: `{ "businessId": "<businessId>", "businessEmail": "<email>", "data": { "name": "<name>", "username": "<username>", "description": "<description>", "status": "PRIVATE" } }`,
      response: `{ "success": true, "project": { "id": "...", "name": "...", "description": "...", "username": "...", "status": "PRIVATE", "apiKey": "...", "customFields": null, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `fetch('/api/projects/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    businessId: '<businessId>',
    businessEmail: '<email>',
    data: { name: '<name>', username: '<username>', description: '<description>', status: 'PRIVATE' }
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
        python: `import requests

response = requests.post('http://localhost:3000/api/projects/create', 
  json={
    'businessId': '<businessId>',
    'businessEmail': '<email>',
    'data': {'name': '<name>', 'username': '<username>', 'description': '<description>', 'status': 'PRIVATE'}
  }
)
print(response.json())`,
        curl: `curl -X POST "http://localhost:3000/api/projects/create" -H "Content-Type: application/json" -d '{"businessId": "<businessId>", "businessEmail": "<email>", "data": {"name": "<name>", "username": "<username>", "description": "<description>", "status": "PRIVATE"}}'`,
      },
    },
    {
      name: "Delete a Project",
      method: "DELETE",
      path: "/api/projects/[projectId]",
      description: "Delete a project by its ID.",
      params: [
        {
          name: "projectId",
          type: "string",
          description: "The ID of the project (path parameter)",
        },
        {
          name: "businessId",
          type: "string",
          description: "The ID of the business (query parameter)",
        },
      ],
      headers: [
        {
          name: "Authorization",
          value: "Bearer <apiKey>",
          description: "Project API key",
        },
      ],
      body: null,
      response: `{ "success": true, "project": { "id": "...", "name": "...", "description": "...", "username": "...", "status": "PUBLIC", "apiKey": "...", "customFields": {}, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `fetch('/api/projects/<projectId>?businessId=<businessId>', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer <apiKey>' }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
        python: `import requests

response = requests.delete('http://localhost:3000/api/projects/<projectId>', 
  params={'businessId': '<businessId>'}, 
  headers={'Authorization': 'Bearer <apiKey>'}
)
print(response.json())`,
        curl: `curl -X DELETE "http://localhost:3000/api/projects/<projectId>?businessId=<businessId>" -H "Authorization: Bearer <apiKey>"`,
      },
    },
    {
      name: "Update a Project",
      method: "PATCH",
      path: "/api/projects/[projectId]/update",
      description:
        "Update project details (name, description, status, custom fields).",
      params: [
        {
          name: "projectId",
          type: "string",
          description: "The ID of the project (path parameter)",
        },
        {
          name: "businessId",
          type: "string",
          description: "The ID of the business (query parameter)",
        },
      ],
      headers: [
        {
          name: "Authorization",
          value: "Bearer <apiKey>",
          description: "Project API key",
        },
      ],
      body: `{ "name": "<newName>", "description": "<newDescription>", "status": "PUBLIC", "customFields": { "field1": { "type": "text", "defaultValue": "value" } } }`,
      response: `{ "success": true, "project": { "id": "...", "name": "<newName>", "description": "<newDescription>", "username": "...", "status": "PUBLIC", "apiKey": "...", "customFields": {...}, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `fetch('/api/projects/<projectId>/update?businessId=<businessId>', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <apiKey>'
  },
  body: JSON.stringify({
    name: '<newName>',
    description: '<newDescription>',
    status: 'PUBLIC',
    customFields: { field1: { type: 'text', defaultValue: 'value' } }
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
        python: `import requests

response = requests.patch('http://localhost:3000/api/projects/<projectId>/update', 
  params={'businessId': '<businessId>'}, 
  headers={'Authorization': 'Bearer <apiKey>', 'Content-Type': 'application/json'},
  json={
    'name': '<newName>',
    'description': '<newDescription>',
    'status': 'PUBLIC',
    'customFields': {'field1': {'type': 'text', 'defaultValue': 'value'}}
  }
)
print(response.json())`,
        curl: `curl -X PATCH "http://localhost:3000/api/projects/<projectId>/update?businessId=<businessId>" -H "Authorization: Bearer <apiKey>" -H "Content-Type: application/json" -d '{"name": "<newName>", "description": "<newDescription>", "status": "PUBLIC", "customFields": {"field1": {"type": "text", "defaultValue": "value"}}}'`,
      },
    },
    {
      name: "Regenerate API Key",
      method: "POST",
      path: "/api/projects/[projectId]/regenerate-api-key",
      description: "Regenerate the API key for a project.",
      params: [
        {
          name: "projectId",
          type: "string",
          description: "The ID of the project (path parameter)",
        },
        {
          name: "businessId",
          type: "string",
          description: "The ID of the business (query parameter)",
        },
      ],
      headers: [
        {
          name: "Authorization",
          value: "Bearer <apiKey>",
          description: "Current project API key",
        },
      ],
      body: null,
      response: `{ "success": true, "project": { "id": "...", "name": "...", "description": "...", "username": "...", "status": "PUBLIC", "apiKey": "<newApiKey>", "customFields": {}, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `fetch('/api/projects/<projectId>/regenerate-api-key?businessId=<businessId>', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <apiKey>' }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
        python: `import requests

response = requests.post('http://localhost:3000/api/projects/<projectId>/regenerate-api-key', 
  params={'businessId': '<businessId>'}, 
  headers={'Authorization': 'Bearer <apiKey>'}
)
print(response.json())`,
        curl: `curl -X POST "http://localhost:3000/api/projects/<projectId>/regenerate-api-key?businessId=<businessId>" -H "Authorization: Bearer <apiKey>"`,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-6 sm:text-3xl lg:text-4xl">
        API Documentation
      </h1>
      <p className="text-base text-muted-foreground mb-6">
        The following API endpoints are available for managing projects within a
        business.
      </p>
      <Tabs defaultValue={endpoints[0].name}>
        <ScrollArea className="w-full">
          
          <TabsList className="flex flex-nowrap gap-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:gap-4">
            {endpoints.map((endpoint) => (
              <TabsTrigger
                key={endpoint.name}
                value={endpoint.name}
                className="flex-shrink-0 min-w-[120px] text-center"
              >
                {endpoint.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {endpoints.map((endpoint) => (
          <TabsContent
            key={endpoint.name}
            value={endpoint.name}
            className="w-full"
          >
            <Card className=" bg-background lg:max-w-6xl md:max-w-4xl sm:max-w-sm xs:max-w-xs">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  {endpoint.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {endpoint.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold sm:text-lg">
                    Endpoint
                  </h3>
                  <p className="text-sm text-muted-foreground break-all">
                    <span className="font-mono bg-muted p-1 rounded">
                      {endpoint.method}
                    </span>{" "}
                    {endpoint.path}
                  </p>
                </div>

                {endpoint.params.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">
                      Parameters
                    </h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {endpoint.params.map((param) => (
                        <li key={param.name}>
                          <span className="font-mono">{param.name}</span> (
                          {param.type}): {param.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {endpoint.headers.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">
                      Headers
                    </h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {endpoint.headers.map((header) => (
                        <li key={header.name}>
                          <span className="font-mono">{header.name}</span>:{" "}
                          {header.value} - {header.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {endpoint.body && (
                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">
                      Request Body
                    </h3>
                    <ScrollArea>
                      <SyntaxHighlighter
                        language="json"
                        style={vscDarkPlus}
                        className="rounded-md text-sm overflow-x-auto"
                        wrapLines
                      >
                        {endpoint.body}
                      </SyntaxHighlighter>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                )}

                <div>
                  <h3 className="text-base font-semibold sm:text-lg">
                    Response
                  </h3>
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    className="rounded-md text-sm overflow-x-auto"
                    wrapLines
                  >
                    {endpoint.response}
                  </SyntaxHighlighter>
                </div>

                <div>
                  <h3 className="text-base font-semibold sm:text-lg">
                    Examples
                  </h3>
                  <Tabs defaultValue="javascript">
                    <TabsList className="flex gap-2 sm:gap-4">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="javascript">
                      <div className="relative">
                        <SyntaxHighlighter
                          language="javascript"
                          style={vscDarkPlus}
                          className="rounded-md text-sm overflow-x-auto"
                          wrapLines
                        >
                          {endpoint.examples.javascript}
                        </SyntaxHighlighter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              endpoint.examples.javascript,
                              `${endpoint.name}-js`
                            )
                          }
                        >
                          <CopyIcon className="h-4 w-4" />
                          {copied === `${endpoint.name}-js`
                            ? " Copied!"
                            : " Copy"}
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="python">
                      <div className="relative">
                        <SyntaxHighlighter
                          language="python"
                          style={vscDarkPlus}
                          className="rounded-md text-sm overflow-x-auto"
                          wrapLines
                        >
                          {endpoint.examples.python}
                        </SyntaxHighlighter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              endpoint.examples.python,
                              `${endpoint.name}-py`
                            )
                          }
                        >
                          <CopyIcon className="h-4 w-4" />
                          {copied === `${endpoint.name}-py`
                            ? " Copied!"
                            : " Copy"}
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="curl">
                      <div className="relative">
                        <SyntaxHighlighter
                          language="bash"
                          style={vscDarkPlus}
                          className="rounded-md text-sm overflow-x-auto"
                          wrapLines
                        >
                          {endpoint.examples.curl}
                        </SyntaxHighlighter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              endpoint.examples.curl,
                              `${endpoint.name}-curl`
                            )
                          }
                        >
                          <CopyIcon className="h-4 w-4" />
                          {copied === `${endpoint.name}-curl`
                            ? " Copied!"
                            : " Copy"}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
