"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Project } from "shared-types";
import { getProject } from "@/lib/api";
import { Badge } from "ui/components/ui/badge";
import { Button } from "ui/components/ui/button";
import {
  statusLabelMap,
  statusColorMap,
  priorityLabelMap,
  priorityColorMap,
  formatDate,
} from "@/lib/utils";
import { EditProjectForm } from "@/components/EditProjectForm";
import { DeleteProjectDialog } from "@/components/DeleteProjectDialog";
import { ProjectGridSkeleton } from "@/components/ProjectCardSkeleton";
import { ErrorState } from "@/components/ErrorState";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const projectId = parseInt(params.id, 10);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  const fetchProject = async () => {
    if (isNaN(projectId)) {
      setError("无效的项目ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getProject(projectId);

      if (result.success && result.data) {
        setProject(result.data);
      } else {
        setError(result.error || "获取项目详情失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取项目详情失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleEditSuccess = () => {
    setEditSuccess(true);
    fetchProject();
    setTimeout(() => setEditSuccess(false), 3000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32 mb-8" />
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <ProjectGridSkeleton count={1} />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Link>
          <ErrorState
            title="加载失败"
            description={error}
            onRetry={fetchProject}
          />
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Link>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-gray-500">项目不存在</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回列表
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {project.name}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${statusColorMap[project.status]} border-0`}>
                  {statusLabelMap[project.status]}
                </Badge>
                <Badge
                  className={`${priorityColorMap[project.priority]} border-0`}
                >
                  {priorityLabelMap[project.priority]}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                创建时间：{formatDate(project.createdAt)}
              </div>
            </div>
            <div className="flex gap-2">
              <DeleteProjectDialog
                projectId={project.id}
                projectName={project.name}
              />
            </div>
          </div>

          {project.description && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                项目描述
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">编辑项目</h2>
          {editSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
              保存成功！
            </div>
          )}
          <EditProjectForm project={project} onSuccess={handleEditSuccess} />
        </div>
      </div>
    </main>
  );
}
