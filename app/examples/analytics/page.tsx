"use client";

import { Card } from "@/components/ui/Card";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#a0a0a0",
        font: {
          size: 11,
        },
      },
      border: {
        color: "#2a2a2a",
      },
    },
    y: {
      grid: {
        color: "#2a2a2a",
      },
      ticks: {
        color: "#a0a0a0",
        font: {
          size: 11,
        },
      },
      border: {
        color: "#2a2a2a",
      },
    },
  },
};

export default function AnalyticsPage() {
  // Sample data for charts
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data: [20, 35, 25, 45, 30, 50, 40, 60, 55, 70, 65, 80],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const barChartData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Distribution",
        data: [45, 60, 35, 80],
        backgroundColor: "#8b5cf6",
        borderRadius: 4,
      },
    ],
  };

  const funnelData = [
    { label: "Visitors", value: 10000 },
    { label: "Signups", value: 3000 },
    { label: "Trials", value: 1500 },
    { label: "Customers", value: 500 },
  ];

  const channelData = {
    labels: ["Organic", "Direct", "Social", "Email"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const weeklyData = [
    { day: "Mon", value: 65, change: 5.4 },
    { day: "Tue", value: 78, change: 8.2 },
    { day: "Wed", value: 82, change: 12.1 },
    { day: "Thu", value: 70, change: 3.7 },
    { day: "Fri", value: 88, change: 15.3 },
    { day: "Sat", value: 55, change: -2.1 },
    { day: "Sun", value: 60, change: 1.2 },
  ];

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
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Distribution</h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
          <div className="h-56 flex flex-col justify-center space-y-3 bg-background-tertiary rounded-lg p-4">
            {funnelData.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground-secondary">{item.label}</span>
                  <span className="font-medium">{item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-background-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(item.value / funnelData[0].value) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
          <div className="h-56 flex items-center justify-center bg-background-tertiary rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 w-full">
              {["North America", "Europe", "Asia", "Other"].map((region, index) => (
                <div key={region} className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {[35, 28, 25, 12][index]}%
                  </div>
                  <div className="text-xs text-foreground-secondary">{region}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Channel Performance</h3>
          <div className="h-56 flex flex-col items-center justify-center bg-background-tertiary rounded-lg p-4">
            <div className="w-32 h-32 mb-4">
              <Doughnut
                data={channelData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 w-full text-xs">
              {channelData.labels.map((label, index) => (
                <div key={label} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{
                      backgroundColor: channelData.datasets[0].backgroundColor[index],
                    }}
                  />
                  <span className="text-foreground-secondary">{label}</span>
                  <span className="font-medium ml-auto">
                    {channelData.datasets[0].data[index]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Weekly Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weeklyData.map((day) => (
            <div key={day.day} className="flex flex-col space-y-2">
              <span className="text-xs text-foreground-secondary uppercase tracking-wide text-center">
                {day.day}
              </span>
              <div className="flex-1 bg-background-tertiary rounded-lg p-2 flex items-end justify-center h-24">
                <div
                  className="w-full bg-primary rounded-t transition-all"
                  style={{ height: `${day.value}%` }}
                />
              </div>
              <span
                className={`text-sm font-semibold text-center ${
                  day.change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {day.change >= 0 ? "+" : ""}
                {day.change}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
