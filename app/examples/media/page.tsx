import { Card } from "@/components/ui/Card";
import { Image as ImageIcon, Video, Music } from "lucide-react";

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Media Gallery Example</h1>
        <p className="text-foreground-secondary">
          Example media gallery layout
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} hover className="p-0 overflow-hidden">
            <div className="aspect-square bg-background-tertiary flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-foreground-secondary" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium">Media Item {i}</p>
              <p className="text-xs text-foreground-secondary mt-1">Image • 2.{i} MB</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

