import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  CheckSquare, 
  MapPin, 
  Image as ImageIcon,
  BarChart3,
  FileText,
  Database,
  Settings,
  Zap,
  Target,
  Wrench
} from "lucide-react";

const examples = [
  { name: "Dashboard", href: "/examples/dashboard", icon: LayoutDashboard, description: "Metrics and overview" },
  { name: "Chat Interface", href: "/examples/chat", icon: MessageSquare, description: "Real-time messaging" },
  { name: "User Management", href: "/examples/users", icon: Users, description: "User CRUD operations" },
  { name: "Task Tracking", href: "/examples/tasks", icon: CheckSquare, description: "Task management" },
  { name: "Mapping App", href: "/examples/mapping", icon: MapPin, description: "Geographic interfaces" },
  { name: "Media Gallery", href: "/examples/media", icon: ImageIcon, description: "Media browsing" },
  { name: "Analytics", href: "/examples/analytics", icon: BarChart3, description: "Data visualization" },
  { name: "Documents", href: "/examples/documents", icon: FileText, description: "Document management" },
  { name: "Storage", href: "/examples/storage", icon: Database, description: "File storage" },
  { name: "Settings", href: "/examples/settings", icon: Settings, description: "Configuration UI" },
  { name: "Performance", href: "/examples/performance", icon: Zap, description: "Monitoring dashboards" },
  { name: "Evaluation", href: "/examples/evaluation", icon: Target, description: "Testing interfaces" },
  { name: "Configuration", href: "/examples/config", icon: Wrench, description: "System config" },
];

export default function ExamplesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Example Pages</h1>
        <p className="text-foreground-secondary">
          Browse different layout patterns and use cases
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {examples.map((example) => {
          const Icon = example.icon;
          return (
            <Link key={example.href} href={example.href}>
              <Card hover>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{example.name}</h3>
                    <p className="text-sm text-foreground-secondary">
                      {example.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

