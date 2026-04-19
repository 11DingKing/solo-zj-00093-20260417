"use client";

import { Search } from "lucide-react";
import { Input } from "ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/components/ui/select";
import type { ProjectStatus, ProjectPriority } from "shared-types";
import { statusLabelMap, priorityLabelMap } from "@/lib/utils";

interface FilterBarProps {
  status?: ProjectStatus;
  priority?: ProjectPriority;
  search?: string;
  sortBy?: "createdAt" | "priority";
  sortOrder?: "asc" | "desc";
  onStatusChange: (value: ProjectStatus | undefined) => void;
  onPriorityChange: (value: ProjectPriority | undefined) => void;
  onSearchChange: (value: string) => void;
  onSortByChange: (value: "createdAt" | "priority") => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
}

export function FilterBar({
  status,
  priority,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  onStatusChange,
  onPriorityChange,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索项目名称..."
            value={search || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={status || "all"}
          onValueChange={(value) =>
            onStatusChange(
              value === "all" ? undefined : (value as ProjectStatus)
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            {Object.entries(statusLabelMap).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priority || "all"}
          onValueChange={(value) =>
            onPriorityChange(
              value === "all" ? undefined : (value as ProjectPriority)
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部优先级</SelectItem>
            {Object.entries(priorityLabelMap).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) =>
            onSortByChange(value as "createdAt" | "priority")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">创建时间</SelectItem>
            <SelectItem value="priority">优先级</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value) => onSortOrderChange(value as "asc" | "desc")}
        >
          <SelectTrigger>
            <SelectValue placeholder="排序顺序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">降序</SelectItem>
            <SelectItem value="asc">升序</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
