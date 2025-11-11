import { Card } from "@/components/ui/Card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Example</h1>
        <p className="text-foreground-secondary">
          Example dashboard layout with metrics and charts
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-secondary mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">$45,231</p>
              <p className="text-xs text-green-400 mt-1">+20.1% from last month</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-secondary mb-1">Active Users</p>
              <p className="text-2xl font-bold">2,350</p>
              <p className="text-xs text-green-400 mt-1">+180 from last week</p>
            </div>
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-secondary mb-1">Growth Rate</p>
              <p className="text-2xl font-bold">12.5%</p>
              <p className="text-xs text-green-400 mt-1">+2.4% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-secondary mb-1">Analytics</p>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-xs text-foreground-secondary mt-1">Total events</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-background-tertiary rounded-lg">
            <p className="text-foreground-secondary">Chart placeholder - Integrate your charting library</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">User Activity</h3>
          <div className="h-64 flex items-center justify-center bg-background-tertiary rounded-lg">
            <p className="text-foreground-secondary">Chart placeholder - Integrate your charting library</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
              <div>
                <p className="text-sm font-medium">Activity Item {i}</p>
                <p className="text-xs text-foreground-secondary">2 hours ago</p>
              </div>
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">New</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

