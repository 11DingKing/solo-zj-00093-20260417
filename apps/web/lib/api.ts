import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  GetProjectsQueryParams,
  PaginatedResponse,
  ApiResponse,
} from "shared-types";

const API_BASE_URL = "http://localhost:3001";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      return {
        success: false,
        error:
          errorData.error || `Request failed with status ${response.status}`,
      };
    } catch {
      return {
        success: false,
        error: `Request failed with status ${response.status}`,
      };
    }
  }

  if (response.status === 204) {
    return { success: true } as ApiResponse<T>;
  }

  const data = await response.json();
  return data as ApiResponse<T>;
}

export async function getProjects(
  params?: GetProjectsQueryParams
): Promise<ApiResponse<PaginatedResponse<Project>>> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${API_BASE_URL}/projects${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<PaginatedResponse<Project>>(response);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch projects",
    };
  }
}

export async function getProject(id: number): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<Project>(response);
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch project",
    };
  }
}

export async function createProject(
  data: CreateProjectInput
): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<Project>(response);
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function updateProject(
  id: number,
  data: UpdateProjectInput
): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<Project>(response);
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

export async function deleteProject(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<null>(response);
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}
