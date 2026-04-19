import type { ProjectStatus, ProjectPriority } from "shared-types";

export const statusLabelMap: Record<ProjectStatus, string> = {
  ACTIVE: "进行中",
  ARCHIVED: "已归档",
  COMPLETED: "已完成",
};

export const statusColorMap: Record<ProjectStatus, string> = {
  ACTIVE: "bg-blue-100 text-blue-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
  COMPLETED: "bg-green-100 text-green-800",
};

export const priorityLabelMap: Record<ProjectPriority, string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高",
  URGENT: "紧急",
};

export const priorityColorMap: Record<ProjectPriority, string> = {
  LOW: "bg-emerald-100 text-emerald-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
