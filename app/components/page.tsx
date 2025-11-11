"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ChevronDown, Plus, Edit, Trash2, Settings } from "lucide-react";

export default function ComponentsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Component Library</h1>
        <p className="text-foreground-secondary">
          Browse and test all available UI components
        </p>
      </div>

      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-sm font-semibold mb-3 text-foreground-secondary">Variants</h3>
            <div className="space-y-3">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Button</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3 text-foreground-secondary">Sizes</h3>
            <div className="space-y-3">
              <Button size="sm">Small Button</Button>
              <Button size="md">Medium Button</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3 text-foreground-secondary">With Icons</h3>
            <div className="space-y-3">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Dropdowns Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dropdowns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-sm font-semibold mb-3 text-foreground-secondary">Basic Dropdown</h3>
            <Dropdown
              trigger={
                <span className="flex items-center space-x-2 px-4 py-2 bg-background-secondary hover:bg-background-tertiary rounded-lg">
                  <span>Actions</span>
                  <ChevronDown className="w-4 h-4" />
                </span>
              }
              items={[
                { label: "Edit", onClick: () => alert("Edit clicked"), icon: <Edit className="w-4 h-4" /> },
                { label: "Delete", onClick: () => alert("Delete clicked"), icon: <Trash2 className="w-4 h-4" />, divider: true },
                { label: "Settings", onClick: () => alert("Settings clicked"), icon: <Settings className="w-4 h-4" /> },
              ]}
            />
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3 text-foreground-secondary">Right Aligned</h3>
            <div className="flex justify-end">
              <Dropdown
                align="right"
                trigger={
                  <span className="flex items-center space-x-2 px-4 py-2 bg-background-secondary hover:bg-background-tertiary rounded-lg">
                    <span>Menu</span>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                }
                items={[
                  { label: "Option 1", onClick: () => alert("Option 1") },
                  { label: "Option 2", onClick: () => alert("Option 2") },
                  { label: "Option 3", onClick: () => alert("Option 3"), divider: true },
                  { label: "Option 4", onClick: () => alert("Option 4") },
                ]}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Cards Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-lg font-semibold mb-2">Basic Card</h3>
            <p className="text-foreground-secondary text-sm">
              This is a basic card component with default styling.
            </p>
          </Card>

          <Card hover>
            <h3 className="text-lg font-semibold mb-2">Hoverable Card</h3>
            <p className="text-foreground-secondary text-sm">
              This card has hover effects enabled.
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Card with Actions</h3>
              <Button size="sm" variant="ghost">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-foreground-secondary text-sm">
              Cards can contain action buttons and other interactive elements.
            </p>
          </Card>
        </div>
      </section>

      {/* Tables Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tables</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Example Item 1</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                    Active
                  </span>
                </TableCell>
                <TableCell>Oct 28, 2025</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Example Item 2</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                    Pending
                  </span>
                </TableCell>
                <TableCell>Oct 27, 2025</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Example Item 3</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                    Inactive
                  </span>
                </TableCell>
                <TableCell>Oct 26, 2025</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Pagination Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Pagination</h2>
        <Card>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </Card>
      </section>
    </div>
  );
}

