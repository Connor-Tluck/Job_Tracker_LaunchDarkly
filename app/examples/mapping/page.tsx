import { Card } from "@/components/ui/Card";
import { MapPin } from "lucide-react";

export default function MappingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mapping Application Example</h1>
        <p className="text-foreground-secondary">
          Example layout for mapping applications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="p-0 h-[600px] overflow-hidden">
            <div className="h-full bg-background-tertiary flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-foreground-secondary mx-auto mb-4" />
                <p className="text-foreground-secondary">
                  Map placeholder - Integrate your mapping library (e.g., Mapbox, Google Maps)
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Location Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-foreground-secondary uppercase">Name</label>
                <p className="text-sm font-medium mt-1">Sample Location</p>
              </div>
              <div>
                <label className="text-xs text-foreground-secondary uppercase">Coordinates</label>
                <p className="text-sm font-medium mt-1">40.7128° N, 74.0060° W</p>
              </div>
              <div>
                <label className="text-xs text-foreground-secondary uppercase">Address</label>
                <p className="text-sm font-medium mt-1">123 Main St, City, State</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Nearby Locations</h3>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-3 bg-background-tertiary rounded-lg hover:bg-background-secondary transition-colors cursor-pointer"
                >
                  <p className="text-sm font-medium">Location {i}</p>
                  <p className="text-xs text-foreground-secondary mt-1">0.{i} miles away</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

