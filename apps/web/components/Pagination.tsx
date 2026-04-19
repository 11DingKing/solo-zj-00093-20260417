"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "ui/components/ui/button";
import type { PaginatedResponse } from "shared-types";

interface PaginationProps {
  pagination: Pick<
    PaginatedResponse<any>,
    "page" | "limit" | "total" | "totalPages"
  >;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-gray-500">
        共 {total} 条记录，第 {page} / {totalPages} 页
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoForward}
        >
          下一页
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
