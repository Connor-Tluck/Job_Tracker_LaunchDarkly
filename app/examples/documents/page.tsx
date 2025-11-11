import { Card } from "@/components/ui/Card";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents Example</h1>
          <p className="text-foreground-secondary">
            Example document management interface
          </p>
        </div>
        <Button>Create Document</Button>
      </div>

      <Card>
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-background-tertiary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} hover>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">Document {i}</h3>
                  <p className="text-sm text-foreground-secondary mt-1">
                    Last modified: Oct {28 - i}, 2025
                  </p>
                  <p className="text-xs text-foreground-secondary mt-2">
                    {i * 234} KB
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

