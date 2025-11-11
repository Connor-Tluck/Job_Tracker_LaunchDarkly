import { Card } from "@/components/ui/Card";
import { Zap, Activity, Clock } from "lucide-react";

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Performance Example</h1>
        <p className="text-foreground-secondary">
          Example performance monitoring interface
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Response Time</p>
              <p className="text-2xl font-bold">142ms</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Uptime</p>
              <p className="text-2xl font-bold">99.9%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Load Time</p>
              <p className="text-2xl font-bold">1.2s</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="h-64 flex items-center justify-center bg-background-tertiary rounded-lg">
          <p className="text-foreground-secondary">Performance chart placeholder</p>
        </div>
      </Card>
    </div>
  );
}

