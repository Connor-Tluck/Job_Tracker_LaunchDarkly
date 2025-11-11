import { Card } from "@/components/ui/Card";
import { Target, CheckCircle, XCircle } from "lucide-react";

export default function EvaluationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Evaluation Example</h1>
        <p className="text-foreground-secondary">
          Example evaluation and testing interface
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Passed</p>
              <p className="text-2xl font-bold">87</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Failed</p>
              <p className="text-2xl font-bold">13</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Success Rate</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Test Results</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg"
            >
              <div>
                <p className="text-sm font-medium">Test Case {i}</p>
                <p className="text-xs text-foreground-secondary">Completed 2 minutes ago</p>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                Passed
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

