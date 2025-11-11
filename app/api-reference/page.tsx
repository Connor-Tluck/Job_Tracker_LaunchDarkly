import { Card } from "@/components/ui/Card";

const endpoints = [
  {
    name: "GET /api/resources",
    description: "List resources with pagination and filtering options.",
    params: [
      { name: "page", type: "number", description: "Page index (default 1)" },
      { name: "pageSize", type: "number", description: "Items per page (default 20)" },
      { name: "query", type: "string", description: "Search term to filter results" },
    ],
  },
  {
    name: "POST /api/resources",
    description: "Create a new resource with the provided payload.",
    params: [
      { name: "name", type: "string", description: "Resource name" },
      { name: "description", type: "string", description: "Resource description" },
    ],
  },
  {
    name: "GET /api/resources/:id",
    description: "Retrieve a specific resource by its identifier.",
    params: [
      { name: "id", type: "string", description: "Resource identifier" },
    ],
  },
];

export default function ApiReferencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Reference</h1>
        <p className="text-foreground-secondary">
          Document your API endpoints, parameters, and usage examples here.
        </p>
      </div>

      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <Card key={endpoint.name} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{endpoint.name}</h2>
              <p className="text-sm text-foreground-secondary mt-1">
                {endpoint.description}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground-secondary uppercase tracking-wide">
                Parameters
              </h3>
              <ul className="mt-2 space-y-2">
                {endpoint.params.map((param) => (
                  <li key={param.name}>
                    <span className="text-sm font-medium text-foreground">
                      {param.name}
                    </span>
                    <span className="text-xs text-foreground-secondary ml-2">
                      {param.type}
                    </span>
                    <p className="text-sm text-foreground-secondary mt-1">
                      {param.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

