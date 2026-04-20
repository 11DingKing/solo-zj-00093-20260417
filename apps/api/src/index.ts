import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import client, { ProjectStatus, ProjectPriority } from "database";
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  GetProjectsQueryParams,
  PaginatedResponse,
  ApiResponse,
} from "shared-types";

const app = new Hono();
const PORT = 3001;

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.get("/ping", async (c) => {
  return c.json({ message: "pong" });
});

app.get("/users", async (c) => {
  const users = await client.user.findMany();
  return c.json(users);
});

app.get("/users/:id", async (c) => {
  const user = await client.user.findUnique({
    where: { id: Number(c.req.param("id")) },
  });
  return c.json(user);
});

app.post("/users", async (c) => {
  const data = await c.req.json();
  const user = await client.user.create({ data });
  return c.json(user);
});

app.put("/users/:id", async (c) => {
  const data = await c.req.json();
  const user = await client.user.update({
    where: { id: Number(c.req.param("id")) },
    data,
  });
  return c.json(user);
});

app.delete("/users/:id", async (c) => {
  const user = await client.user.delete({
    where: { id: Number(c.req.param("id")) },
  });
  return c.json(user);
});

app.get("/projects", async (c) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = c.req.query() as GetProjectsQueryParams;

    const pageNum = typeof page === "string" ? parseInt(page, 10) : page;
    const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (
      status &&
      Object.values(ProjectStatus).includes(status as ProjectStatus)
    ) {
      where.status = status;
    }

    if (
      priority &&
      Object.values(ProjectPriority).includes(priority as ProjectPriority)
    ) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = {};
    if (sortBy === "createdAt" || sortBy === "priority") {
      orderBy[sortBy] = sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [projects, total] = await Promise.all([
      client.project.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
      }),
      client.project.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const response: PaginatedResponse<Project> = {
      data: projects as Project[],
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };

    return c.json<ApiResponse<PaginatedResponse<Project>>>({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      500
    );
  }
});

app.get("/projects/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));

    if (isNaN(id)) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          error: "Invalid project ID",
        },
        400
      );
    }

    const project = await client.project.findUnique({
      where: { id },
    });

    if (!project) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          error: "Project not found",
        },
        404
      );
    }

    return c.json<ApiResponse<Project>>({
      success: true,
      data: project as Project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return c.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch project",
      },
      500
    );
  }
});

app.post("/projects", async (c) => {
  try {
    const data = await c.req.json<CreateProjectInput>();

    if (!data.name || data.name.trim() === "") {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          error: "Project name is required",
        },
        400
      );
    }

    const projectData: any = {
      name: data.name.trim(),
    };

    if (data.description !== undefined) {
      projectData.description = data.description;
    }

    if (data.status && Object.values(ProjectStatus).includes(data.status)) {
      projectData.status = data.status;
    }

    if (
      data.priority &&
      Object.values(ProjectPriority).includes(data.priority)
    ) {
      projectData.priority = data.priority;
    }

    const project = await client.project.create({
      data: projectData,
    });

    return c.json<ApiResponse<Project>>(
      {
        success: true,
        data: project as Project,
      },
      201
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return c.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to create project",
      },
      500
    );
  }
});

app.put("/projects/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const data = await c.req.json<UpdateProjectInput>();

    if (isNaN(id)) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          error: "Invalid project ID",
        },
        400
      );
    }

    const existingProject = await client.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          error: "Project not found",
        },
        404
      );
    }

    const projectData: any = {};

    if (data.name !== undefined) {
      if (data.name.trim() === "") {
        return c.json<ApiResponse<null>>(
          {
            success: false,
            error: "Project name cannot be empty",
          },
          400
        );
      }
      projectData.name = data.name.trim();
    }

    if (data.description !== undefined) {
      projectData.description = data.description;
    }

    if (data.status && Object.values(ProjectStatus).includes(data.status)) {
      projectData.status = data.status;
    }

    if (
      data.priority &&
      Object.values(ProjectPriority).includes(data.priority)
    ) {
      projectData.priority = data.priority;
    }

    const project = await client.project.update({
      where: { id },
      data: projectData,
    });

    return c.json<ApiResponse<Project>>({
      success: true,
      data: project as Project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return c.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to update project",
      },
      500
    );
  }
});

app.delete("/projects/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));

    if (isNaN(id)) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          error: "Invalid project ID",
        },
        400
      );
    }

    const existingProject = await client.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return c.json<ApiResponse<null>>(
        {
          success: false,
          error: "Project not found",
        },
        404
      );
    }

    await client.project.delete({
      where: { id },
    });

    return c.json<ApiResponse<null>>(
      {
        success: true,
      },
      200
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return c.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to delete project",
      },
      500
    );
  }
});

serve({ fetch: app.fetch, port: Number(PORT) });
