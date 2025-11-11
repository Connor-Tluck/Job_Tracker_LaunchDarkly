"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  FileText,
  Database,
  Zap,
  Target,
  Wrench,
  Image as ImageIcon,
  Video,
  Music,
  MapPin,
  CheckSquare,
  Building2,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Create",
    items: [
      { name: "Component Library", href: "/components", icon: Package },
      { name: "Dashboard Example", href: "/examples/dashboard", icon: LayoutDashboard },
      { name: "Chat Interface", href: "/examples/chat", icon: MessageSquare },
      { name: "User Management", href: "/examples/users", icon: Users },
      { name: "Task Tracking", href: "/examples/tasks", icon: CheckSquare },
      { name: "Mapping App", href: "/examples/mapping", icon: MapPin },
      { name: "Media Gallery", href: "/examples/media", icon: ImageIcon },
    ],
  },
  {
    title: "Manage",
    items: [
      { name: "Analytics", href: "/examples/analytics", icon: BarChart3 },
      { name: "Documents", href: "/examples/documents", icon: FileText },
      { name: "Data Storage", href: "/examples/storage", icon: Database },
      { name: "Settings", href: "/examples/settings", icon: Settings },
    ],
  },
  {
    title: "Optimize",
    items: [
      { name: "Performance", href: "/examples/performance", icon: Zap },
      { name: "Evaluation", href: "/examples/evaluation", icon: Target },
      { name: "Configuration", href: "/examples/config", icon: Wrench },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background-secondary border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            P
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">Personal</div>
            <div className="text-xs text-foreground-secondary truncate">
              Project Template
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.title}>
            <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-background-tertiary text-foreground"
                        : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-background-tertiary rounded-lg p-3 text-xs">
          <div className="flex items-start justify-between mb-2">
            <span className="font-medium text-foreground">Template Info</span>
            <button className="text-foreground-secondary hover:text-foreground">
              ×
            </button>
          </div>
          <p className="text-foreground-secondary text-[10px] leading-relaxed">
            This is a modular template for building modern applications.
          </p>
        </div>
      </div>
    </aside>
  );
}

