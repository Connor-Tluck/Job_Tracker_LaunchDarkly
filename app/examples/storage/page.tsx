"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Upload, Download, Trash2, Search } from "lucide-react";

export default function StoragePage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const files = [
    { id: 1, name: "document.pdf", size: "2.4 MB", type: "PDF", created: "Oct 28, 2025" },
    { id: 2, name: "image.jpg", size: "1.2 MB", type: "Image", created: "Oct 27, 2025" },
    { id: 3, name: "spreadsheet.xlsx", size: "856 KB", type: "Spreadsheet", created: "Oct 26, 2025" },
    { id: 4, name: "presentation.pptx", size: "5.1 MB", type: "Presentation", created: "Oct 25, 2025" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Storage Example</h1>
          <p className="text-foreground-secondary">
            Example file storage interface
          </p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-full pl-10 pr-4 py-2 bg-background-tertiary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow
                    key={file.id}
                    className={selectedFile === file.name ? "bg-background-tertiary" : ""}
                  >
                    <TableCell
                      className="font-medium cursor-pointer"
                      onClick={() => setSelectedFile(file.name)}
                    >
                      {file.name}
                    </TableCell>
                    <TableCell>{file.type}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>{file.created}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold mb-4">File Details</h3>
            {selectedFile ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-foreground-secondary uppercase">File Name</label>
                  <p className="text-sm font-medium mt-1">{selectedFile}</p>
                </div>
                <div>
                  <label className="text-xs text-foreground-secondary uppercase">Status</label>
                  <p className="text-sm font-medium mt-1">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                      Ready
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs text-foreground-secondary uppercase">File ID</label>
                  <p className="text-sm font-medium mt-1 font-mono text-xs">
                    file-{selectedFile.replace(/\s/g, "").toLowerCase()}
                  </p>
                </div>
                <div className="pt-4 space-y-2">
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button className="w-full" variant="danger">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-foreground-secondary text-sm">
                Select a file to view details
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

