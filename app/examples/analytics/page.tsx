import { Card } from "@/components/ui/Card";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Example</h1>
        <p className="text-foreground-secondary">
          Example analytics dashboard with metrics and charts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Total Views</p>
              <p className="text-lg font-bold">12,345</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Growth</p>
              <p className="text-lg font-bold">+23.5%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Active Users</p>
              <p className="text-lg font-bold">1,234</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Engagement</p>
              <p className="text-lg font-bold">87.2%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-background-tertiary rounded-lg">
            <p className="text-foreground-secondary">Line chart placeholder</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-background-tertiary rounded-lg">
            <p className="text-foreground-secondary">Bar chart placeholder</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
          <div className="h-56 flex items-center justify-center bg-background-tertiary rounded-lg">
            <p className="text-foreground-secondary text-center px-4">
              Funnel chart placeholder
            </p>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
          <div className="h-56 flex items-center justify-center bg-background-tertiary rounded-lg">
            <p className="text-foreground-secondary text-center px-4">
              Map heatmap placeholder
            </p>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Channel Performance</h3>
          <div className="h-56 flex items-center justify-center bg-background-tertiary rounded-lg">
            <p className="text-foreground-secondary text-center px-4">
              Donut chart placeholder
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Weekly Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="flex flex-col space-y-2">
              <span className="text-xs text-foreground-secondary uppercase tracking-wide text-center">
                {day}
              </span>
              <div className="flex-1 bg-background-tertiary rounded-lg flex items-center justify-center h-24">
                <span className="text-xs text-foreground-secondary">
                  Sparkline
                </span>
              </div>
              <span className="text-sm font-semibold text-center">+5.4%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

