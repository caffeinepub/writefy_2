import { Clock, FileText, Hash, LayoutGrid, List, Plus } from "lucide-react";
import { useState } from "react";
import { formatRelativeTime } from "../lib/storage";
import type { Project } from "../lib/types";

interface LibraryScreenProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onNewProject: () => void;
}

type ViewMode = "grid" | "list";

export function LibraryScreen({
  projects,
  onOpenProject,
  onNewProject,
}: LibraryScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const sorted = [...projects].sort((a, b) => b.lastEdited - a.lastEdited);

  return (
    <div data-ocid="library.page" className="min-h-screen pb-36 relative z-10">
      <div className="px-6 pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-4xl font-bold text-white mb-1"
              style={{ letterSpacing: "-0.03em" }}
            >
              Library
            </h1>
            <p className="text-sm" style={{ color: "#9AA0A6" }}>
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>
          <div
            className="flex items-center gap-1 p-1 rounded-xl mt-2"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <button
              type="button"
              data-ocid="library.grid.toggle"
              onClick={() => setViewMode("grid")}
              className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
              style={{
                background:
                  viewMode === "grid" ? "rgba(34,197,94,0.15)" : "transparent",
                color: viewMode === "grid" ? "#22C55E" : "#6B7280",
              }}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              data-ocid="library.list.toggle"
              onClick={() => setViewMode("list")}
              className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
              style={{
                background:
                  viewMode === "list" ? "rgba(34,197,94,0.15)" : "transparent",
                color: viewMode === "list" ? "#22C55E" : "#6B7280",
              }}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6">
        {sorted.length === 0 ? (
          <div
            data-ocid="library.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
            >
              <FileText size={28} style={{ color: "rgba(34,197,94,0.5)" }} />
            </div>
            <p className="text-white font-semibold mb-1">No projects yet</p>
            <p className="text-sm" style={{ color: "#9AA0A6" }}>
              Start writing something amazing
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4">
            {sorted.map((project, idx) => (
              <button
                type="button"
                key={project.id}
                data-ocid={`library.item.${idx + 1}`}
                className="rounded-2xl p-4 cursor-pointer transition-all duration-200 text-left"
                style={{
                  background: "rgba(12,12,12,0.9)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onClick={() => onOpenProject(project)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(34,197,94,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                <div
                  className="w-full aspect-square rounded-xl mb-3 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(0,0,0,0.5) 100%)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <FileText
                    size={28}
                    style={{ color: "rgba(34,197,94,0.35)" }}
                  />
                </div>
                <div
                  className="inline-block px-1.5 py-0.5 rounded mb-1.5"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "#22C55E",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  {project.type.toUpperCase()}
                </div>
                <p className="text-sm font-bold text-white leading-tight line-clamp-2 mb-2">
                  {project.title}
                </p>
                <div className="space-y-1">
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "#6B7280" }}
                  >
                    <Hash size={10} />
                    <span>{project.wordCount.toLocaleString()} words</span>
                    <span className="mx-0.5">·</span>
                    <span>{project.sceneCount} scenes</span>
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "#6B7280" }}
                  >
                    <Clock size={10} />
                    <span>{formatRelativeTime(project.lastEdited)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((project, idx) => (
              <button
                type="button"
                key={project.id}
                data-ocid={`library.item.${idx + 1}`}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 w-full text-left"
                style={{
                  background: "rgba(12,12,12,0.9)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onClick={() => onOpenProject(project)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(34,197,94,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.15)",
                  }}
                >
                  <FileText size={16} style={{ color: "#22C55E" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-white truncate">
                      {project.title}
                    </p>
                    <span
                      className="flex-shrink-0 px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(34,197,94,0.1)",
                        color: "#22C55E",
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {project.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {project.wordCount.toLocaleString()} words &middot;{" "}
                    {project.sceneCount} scenes
                  </p>
                </div>
                <div
                  className="text-xs flex-shrink-0"
                  style={{ color: "#6B7280" }}
                >
                  {formatRelativeTime(project.lastEdited)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        data-ocid="library.new.open_modal_button"
        onClick={onNewProject}
        className="fixed z-40 flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-all duration-200"
        style={{
          bottom: "108px",
          right: "24px",
          background: "#22C55E",
          boxShadow: "0 4px 20px rgba(34,197,94,0.4)",
          color: "#050505",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#16a34a";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#22C55E";
          e.currentTarget.style.transform = "scale(1)";
        }}
        aria-label="Create new project"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
