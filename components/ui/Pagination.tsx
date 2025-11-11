"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  );

  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(totalPages, page));
    if (clampedPage !== currentPage) {
      onPageChange(clampedPage);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            const showEllipsis =
              index > 0 && page - visiblePages[index - 1] > 1;
            return (
              <div key={page} className="flex items-center space-x-1">
                {showEllipsis && (
                  <span className="px-2 text-foreground-secondary">...</span>
                )}
                <Button
                  variant={currentPage === page ? "primary" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="min-w-[2.5rem]"
                >
                  {page}
                </Button>
              </div>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-sm text-foreground-secondary">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}

