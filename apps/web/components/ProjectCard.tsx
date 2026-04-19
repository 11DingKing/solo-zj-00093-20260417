"use client";

import Link from "next/link";
import type { Project } from "shared-types";
import { Badge } from "ui/components/ui/badge";
import {
  statusLabelMap,
  statusColorMap,
  priorityLabelMap,
  priorityColorMap,
  formatDate,
} from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {project.name}
        </h3>

        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className={`${statusColorMap[project.status]} border-0`}>
            {statusLabelMap[project.status]}
          </Badge>
          <Badge className={`${priorityColorMap[project.priority]} border-0`}>
            {priorityLabelMap[project.priority]}
          </Badge>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          创建时间：{formatDate(project.createdAt)}
        </p>
      </div>
    </Link>
  );
}
