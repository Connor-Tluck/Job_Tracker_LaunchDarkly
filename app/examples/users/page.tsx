"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Dropdown } from "@/components/ui/Dropdown";
import { Plus, Edit, Trash2, MoreVertical, Search } from "lucide-react";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", created: "Oct 28, 2025" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active", created: "Oct 27, 2025" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive", created: "Oct 26, 2025" },
    { id: 4, name: "Alice Williams", email: "alice@example.com", role: "Moderator", status: "Active", created: "Oct 25, 2025" },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "Active", created: "Oct 24, 2025" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management Example</h1>
          <p className="text-foreground-secondary">
            Example user management interface with table, search, and pagination
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-background-tertiary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.created}</TableCell>
                <TableCell className="text-right">
                  <Dropdown
                    align="right"
                    trigger={
                      <button className="p-2 hover:bg-background-tertiary rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      {
                        label: "Edit",
                        onClick: () => alert(`Edit ${user.name}`),
                        icon: <Edit className="w-4 h-4" />,
                      },
                      {
                        label: "Delete",
                        onClick: () => alert(`Delete ${user.name}`),
                        icon: <Trash2 className="w-4 h-4" />,
                        divider: true,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}

