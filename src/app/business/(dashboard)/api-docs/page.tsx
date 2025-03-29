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
    setTimeout(() => setCopied(null), 2000);
  };

  const endpoints = [
    {
      name: "List All Projects",
      method: "GET",
      path: "/api/projects/list",
      description:
        "Retrieve a list of all projects for a given business using an API key and business ID.",
      params: [
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
          description: "A valid project API key for the business",
        },
      ],
      body: null,
      response: `{ "success": true, "projects": [{ "id": "...", "name": "...", "description": "...", "username": "...", "status": "...", "apiKey": "...", "customFields": {}, "createdAt": "...", "businessId": "..." }] }`,
      examples: {
        javascript: `fetch('/api/projects/list?businessId=<businessId>', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer <apiKey>' }
})
  .then(response => response.json())
  .then(data => console.log(data));`,
        python: `import requests

response = requests.get('http://localhost:3000/api/projects/list', 
  params={'businessId': '<businessId>'}, 
  headers={'Authorization': 'Bearer <apiKey>'}
)
print(response.json())`,
        curl: `curl -X GET "http://localhost:3000/api/projects/list?businessId=<businessId>" -H "Authorization: Bearer <apiKey>"`,
      },
    },
    {
      name: "Get Project",
      method: "GET",
      path: "/api/projects/getproject",
      description: "Retrieve a specific project using its API key.",
      params: [],
      headers: [
        {
          name: "Authorization",
          value: "Bearer <apiKey>",
          description: "The project's API key",
        },
      ],
      body: null,
      response: `{ "success": true, "project": { "id": "...", "name": "...", "description": "...", "username": "...", "status": "...", "apiKey": "...", "customFields": {}, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `fetch('/api/projects/getproject', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer <apiKey>' }
})
  .then(response => response.json())
  .then(data => console.log(data));`,
        python: `import requests

response = requests.get('http://localhost:3000/api/projects/getproject', 
  headers={'Authorization': 'Bearer <apiKey>'}
)
print(response.json())`,
        curl: `curl -X GET "http://localhost:3000/api/projects/getproject" -H "Authorization: Bearer <apiKey>"`,
      },
    },
    {
      name: "Create a Project",
      method: "POST",
      path: "/api/projects/create",
      description:
        "Create a new project for a business. An API key will be generated automatically.",
      params: [],
      headers: [
        {
          name: "Content-Type",
          value: "application/json",
          description: "Specifies JSON request body",
        },
      ],
      body: `{ "businessId": "<businessId>", "businessEmail": "<email>", "data": { "name": "<name>", "username": "<username>", "description": "<description>", "status": "PRIVATE", "customFields": {} } }`,
      response: `{ "success": true, "project": { "id": "...", "name": "...", "description": "...", "username": "...", "status": "...", "apiKey": "...", "customFields": {}, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `fetch('/api/projects/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    businessId: '<businessId>',
    businessEmail: '<email>',
    data: { name: '<name>', username: '<username>', description: '<description>', status: 'PRIVATE', customFields: {} }
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`,
        python: `import requests

response = requests.post('http://localhost:3000/api/projects/create', 
  json={
    'businessId': '<businessId>',
    'businessEmail': '<email>',
    'data': {'name': '<name>', 'username': '<username>', 'description': '<description>', 'status': 'PRIVATE', 'customFields': {}}
  }
)
print(response.json())`,
        curl: `curl -X POST "http://localhost:3000/api/projects/create" -H "Content-Type: application/json" -d '{"businessId": "<businessId>", "businessEmail": "<email>", "data": {"name": "<name>", "username": "<username>", "description": "<description>", "status": "PRIVATE", "customFields": {}}}'`,
      },
    },
    {
      name: "Delete a Project",
      method: "DELETE",
      path: "/api/projects/getproject",
      description: "Delete a project using its API key.",
      params: [],
      headers: [
        {
          name: "Authorization",
          value: "Bearer <apiKey>",
          description: "The project's API key",
        },
      ],
      body: null,
      response: `{ "success": true, "project": { "id": "...", "name": "...", "description": "...", "username": "...", "status": "...", "apiKey": "...", "customFields": {}, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `fetch('/api/projects/getproject', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer <apiKey>' }
})
  .then(response => response.json())
  .then(data => console.log(data));`,
        python: `import requests

response = requests.delete('http://localhost:3000/api/projects/getproject', 
  headers={'Authorization': 'Bearer <apiKey>'}
)
print(response.json())`,
        curl: `curl -X DELETE "http://localhost:3000/api/projects/getproject" -H "Authorization: Bearer <apiKey>"`,
      },
    },
    {
      name: "Update a Project",
      method: "PATCH",
      path: "/api/projects/update",
      description: "Update project details using its API key.",
      params: [],
      headers: [
        {
          name: "Authorization",
          value: "Bearer <apiKey>",
          description: "The project's API key",
        },
        {
          name: "Content-Type",
          value: "application/json",
          description: "Specifies JSON request body",
        },
      ],
      body: `{ "name": "<newName>", "description": "<newDescription>", "status": "PUBLIC", "customFields": { "field1": { "type": "text", "defaultValue": "value" } } }`,
      response: `{ "success": true, "project": { "id": "...", "name": "<newName>", "description": "<newDescription>", "username": "...", "status": "PUBLIC", "apiKey": "...", "customFields": {...}, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `fetch('/api/projects/update', {
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
  .then(data => console.log(data));`,
        python: `import requests

response = requests.patch('http://localhost:3000/api/projects/update', 
  headers={'Authorization': 'Bearer <apiKey>', 'Content-Type': 'application/json'},
  json={
    'name': '<newName>',
    'description': '<newDescription>',
    'status': 'PUBLIC',
    'customFields': {'field1': {'type': 'text', 'defaultValue': 'value'}}
  }
)
print(response.json())`,
        curl: `curl -X PATCH "http://localhost:3000/api/projects/update" -H "Authorization: Bearer <apiKey>" -H "Content-Type: application/json" -d '{"name": "<newName>", "description": "<newDescription>", "status": "PUBLIC", "customFields": {"field1": {"type": "text", "defaultValue": "value"}}}'`,
      },
    },
    {
      name: "Regenerate API Key",
      method: "POST",
      path: "/api/projects/regenerate-api-key",
      description:
        "Regenerate the API key for a project using its current API key.",
      params: [],
      headers: [
        {
          name: "Authorization",
          value: "Bearer <apiKey>",
          description: "The current project API key",
        },
      ],
      body: null,
      response: `{ "success": true, "project": { "id": "...", "name": "...", "description": "...", "username": "...", "status": "...", "apiKey": "<newApiKey>", "customFields": {}, "createdAt": "...", "updatedAt": "...", "businessId": "...", "users": [] } }`,
      examples: {
        javascript: `fetch('/api/projects/regenerate-api-key', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <apiKey>' }
})
  .then(response => response.json())
  .then(data => console.log(data));`,
        python: `import requests

response = requests.post('http://localhost:3000/api/projects/regenerate-api-key', 
  headers={'Authorization': 'Bearer <apiKey>'}
)
print(response.json())`,
        curl: `curl -X POST "http://localhost:3000/api/projects/regenerate-api-key" -H "Authorization: Bearer <apiKey>"`,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 sm:text-4xl lg:text-5xl">
          API Documentation
        </h1>
        <p className="text-base text-muted-foreground mb-8 max-w-2xl">
          Explore the API endpoints below to manage projects within a business
          using API keys.
        </p>
        <Tabs defaultValue={endpoints[0].name} className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-full flex-wrap gap-2 mb-6 p-1 bg-muted rounded-md sm:gap-3 lg:gap-4">
              {endpoints.map((endpoint) => (
                <TabsTrigger
                  key={endpoint.name}
                  value={endpoint.name}
                  className="flex-1 min-w-[120px] py-2 px-3 text-sm font-medium rounded-md whitespace-nowrap"
                >
                  {endpoint.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {endpoints.map((endpoint) => (
            <TabsContent key={endpoint.name} value={endpoint.name}>
              <Card className="bg-background shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold sm:text-2xl">
                    {endpoint.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {endpoint.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-mono bg-muted py-1 px-2 rounded">
                        {endpoint.method}
                      </span>{" "}
                      {endpoint.path}
                    </p>
                  </div>

                  {endpoint.params.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Parameters</h3>
                      <ul className="list-disc pl-6 text-sm space-y-2 text-muted-foreground">
                        {endpoint.params.map((param) => (
                          <li key={param.name}>
                            <span className="font-mono text-foreground">
                              {param.name}
                            </span>{" "}
                            ({param.type}): {param.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {endpoint.headers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Headers</h3>
                      <ul className="list-disc pl-6 text-sm space-y-2 text-muted-foreground">
                        {endpoint.headers.map((header) => (
                          <li key={header.name}>
                            <span className="font-mono text-foreground">
                              {header.name}
                            </span>
                            : {header.value} - {header.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {endpoint.body && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Request Body
                      </h3>
                      <ScrollArea className="overflow-x-auto">
                        <SyntaxHighlighter
                          language="json"
                          style={vscDarkPlus}
                          className="rounded-md text-sm min-w-[600px] whitespace-nowrap"
                          wrapLongLines={false}
                        >
                          {endpoint.body}
                        </SyntaxHighlighter>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Response</h3>
                    <ScrollArea className="overflow-x-auto">
                      <SyntaxHighlighter
                        language="json"
                        style={vscDarkPlus}
                        className="rounded-md text-sm min-w-[600px] whitespace-nowrap"
                        wrapLongLines={false}
                      >
                        {endpoint.response}
                      </SyntaxHighlighter>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Examples</h3>
                    <Tabs defaultValue="javascript" className="space-y-4">
                      <TabsList className="grid grid-cols-3 gap-2 w-full max-w-md">
                        <TabsTrigger
                          value="javascript"
                          className="py-2 text-sm"
                        >
                          JavaScript
                        </TabsTrigger>
                        <TabsTrigger value="python" className="py-2 text-sm">
                          Python
                        </TabsTrigger>
                        <TabsTrigger value="curl" className="py-2 text-sm">
                          cURL
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="javascript" className="bg-background">
                        <div className="relative">
                          <ScrollArea className="overflow-x-auto">
                            <SyntaxHighlighter
                              language="javascript"
                              style={vscDarkPlus}
                              className="rounded-md text-sm min-w-[600px] whitespace-nowrap"
                              wrapLongLines={false}
                            >
                              {endpoint.examples.javascript}
                            </SyntaxHighlighter>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
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
                          <ScrollArea className="overflow-x-auto">
                            <SyntaxHighlighter
                              language="python"
                              style={vscDarkPlus}
                              className="rounded-md text-sm min-w-[600px] whitespace-nowrap"
                              wrapLongLines={false}
                            >
                              {endpoint.examples.python}
                            </SyntaxHighlighter>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
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
                          <ScrollArea className="overflow-x-auto">
                            <SyntaxHighlighter
                              language="bash"
                              style={vscDarkPlus}
                              className="rounded-md text-sm min-w-[600px] whitespace-nowrap"
                              wrapLongLines={false}
                            >
                              {endpoint.examples.curl}
                            </SyntaxHighlighter>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
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
    </div>
  );
}
