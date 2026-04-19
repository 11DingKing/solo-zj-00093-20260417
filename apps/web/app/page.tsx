"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  Project,
  ProjectStatus,
  ProjectPriority,
  PaginatedResponse,
  GetProjectsQueryParams,
} from "shared-types";
import { getProjects } from "@/lib/api";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectGridSkeleton } from "@/components/ProjectCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { FilterBar } from "@/components/FilterBar";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { Pagination } from "@/components/Pagination";

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<
    Pick<PaginatedResponse<Project>, "page" | "limit" | "total" | "totalPages">
  >({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!, 10)
    : 1;
  const status = (searchParams.get("status") as ProjectStatus) || undefined;
  const priority =
    (searchParams.get("priority") as ProjectPriority) || undefined;
  const search = searchParams.get("search") || "";
  const sortBy =
    (searchParams.get("sortBy") as "createdAt" | "priority") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const updateUrlParams = useCallback(
    (params: Partial<GetProjectsQueryParams>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      const newUrl = `${window.location.pathname}${
        newParams.toString() ? `?${newParams.toString()}` : ""
      }`;
      router.push(newUrl);
    },
    [searchParams, router]
  );

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: GetProjectsQueryParams = {
        page,
        limit: 12,
        status,
        priority,
        search: search || undefined,
        sortBy,
        sortOrder,
      };

      const result = await getProjects(params);

      if (result.success && result.data) {
        setProjects(result.data.data);
        setPagination({
          page: result.data.page,
          limit: result.data.limit,
          total: result.data.total,
          totalPages: result.data.totalPages,
        });
      } else {
        setError(result.error || "获取项目列表失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取项目列表失败");
    } finally {
      setLoading(false);
    }
  }, [page, status, priority, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleStatusChange = (value: ProjectStatus | undefined) => {
    updateUrlParams({ status: value, page: 1 });
  };

  const handlePriorityChange = (value: ProjectPriority | undefined) => {
    updateUrlParams({ priority: value, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    updateUrlParams({ search: value, page: 1 });
  };

  const handleSortByChange = (value: "createdAt" | "priority") => {
    updateUrlParams({ sortBy: value });
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    updateUrlParams({ sortOrder: value });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const handleCreateSuccess = () => {
    fetchProjects();
  };

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">项目管理</h1>
            <CreateProjectDialog onSuccess={handleCreateSuccess} />
          </div>
          <ErrorState
            title="加载失败"
            description={error}
            onRetry={fetchProjects}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">项目管理</h1>
          <CreateProjectDialog onSuccess={handleCreateSuccess} />
        </div>

        <div className="mb-6">
          <FilterBar
            status={status}
            priority={priority}
            search={search}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onSearchChange={handleSearchChange}
            onSortByChange={handleSortByChange}
            onSortOrderChange={handleSortOrderChange}
          />
        </div>

        {loading ? (
          <ProjectGridSkeleton count={6} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="暂无项目"
            description={
              search || status || priority
                ? "没有找到符合条件的项目，请尝试调整筛选条件"
                : "创建您的第一个项目开始吧"
            }
            action={
              !search && !status && !priority
                ? {
                    label: "新建项目",
                    onClick: () => {},
                  }
                : undefined
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  );
}
