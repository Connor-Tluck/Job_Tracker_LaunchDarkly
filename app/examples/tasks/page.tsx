"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckSquare, Square, Plus, Filter } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete project proposal", description: "Write and submit the project proposal", completed: false, priority: "high" },
    { id: 2, title: "Review code changes", description: "Review pull requests from team", completed: false, priority: "medium" },
    { id: 3, title: "Update documentation", description: "Update API documentation", completed: true, priority: "low" },
    { id: 4, title: "Team meeting", description: "Attend weekly team sync", completed: false, priority: "high" },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "low": return "bg-green-500/20 text-green-400";
      default: return "bg-background-tertiary text-foreground-secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Task Tracking Example</h1>
          <p className="text-foreground-secondary">
            Example task management interface
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["high", "medium", "low"].map((priority) => (
          <div key={priority} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold capitalize">{priority} Priority</h2>
              <span className="px-2 py-1 bg-background-tertiary rounded text-xs">
                {tasks.filter(t => t.priority === priority && !t.completed).length}
              </span>
            </div>
            {tasks
              .filter(task => task.priority === priority)
              .map(task => (
                <Card key={task.id} hover>
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-foreground-secondary" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${task.completed ? "line-through text-foreground-secondary" : ""}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary mt-1">
                        {task.description}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

