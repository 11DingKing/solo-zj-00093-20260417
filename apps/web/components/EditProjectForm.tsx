"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "ui/components/ui/button";
import { Input } from "ui/components/ui/input";
import { Label } from "ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/components/ui/select";
import { Textarea } from "ui/components/ui/textarea";
import type {
  Project,
  UpdateProjectInput,
  ProjectStatus,
  ProjectPriority,
} from "shared-types";
import { statusLabelMap, priorityLabelMap } from "@/lib/utils";
import { updateProject } from "@/lib/api";

interface EditProjectFormProps {
  project: Project;
  onSuccess?: () => void;
}

export function EditProjectForm({ project, onSuccess }: EditProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateProjectInput>({
    name: project.name,
    description: project.description || "",
    status: project.status,
    priority: project.priority,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProject(project.id, formData);
      if (result.success) {
        onSuccess?.();
      } else {
        alert(result.error || "更新失败");
      }
    } catch (error) {
      alert("更新失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="name">项目名称 *</Label>
        <Input
          id="name"
          placeholder="请输入项目名称"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">项目描述</Label>
        <Textarea
          id="description"
          placeholder="请输入项目描述"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="status">状态</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as ProjectStatus,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabelMap).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="priority">优先级</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                priority: value as ProjectPriority,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityLabelMap).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        <Save className="h-4 w-4 mr-2" />
        {loading ? "保存中..." : "保存更改"}
      </Button>
    </form>
  );
}
