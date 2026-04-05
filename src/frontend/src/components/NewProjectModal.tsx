import { X } from "lucide-react";
import { useState } from "react";
import type { ProjectType } from "../lib/types";

interface NewProjectModalProps {
  onClose: () => void;
  onCreate: (title: string, type: ProjectType) => void;
}

export function NewProjectModal({ onClose, onCreate }: NewProjectModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ProjectType>("Screenplay");
  const [error, setError] = useState("");

  function handleCreate() {
    if (!title.trim()) {
      setError("Please enter a project title");
      return;
    }
    onCreate(title.trim(), type);
    onClose();
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleCreate();
    if (e.key === "Escape") onClose();
  }

  return (
    <dialog
      data-ocid="new_project.modal"
      open
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 w-full h-full max-w-none max-h-none border-0 m-0"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 relative"
        style={{
          background: "rgba(14,14,14,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 id="modal-title" className="text-2xl font-bold text-white">
            New Project
          </h2>
          <button
            type="button"
            data-ocid="new_project.close_button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="project-title"
            className="block text-sm font-medium mb-2"
            style={{ color: "#9AA0A6" }}
          >
            Project Title
          </label>
          <input
            id="project-title"
            data-ocid="new_project.input"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter your project title..."
            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: error
                ? "1px solid rgba(239,68,68,0.6)"
                : "1px solid rgba(255,255,255,0.08)",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            onFocus={(e) => {
              if (!error)
                e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)";
            }}
            onBlur={(e) => {
              if (!error)
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          />
          {error && (
            <p
              data-ocid="new_project.error_state"
              className="mt-2 text-sm"
              style={{ color: "#ef4444" }}
            >
              {error}
            </p>
          )}
        </div>

        <fieldset className="mb-8 border-0 p-0 m-0">
          <legend
            className="block text-sm font-medium mb-2"
            style={{ color: "#9AA0A6" }}
          >
            Project Type
          </legend>
          <div className="flex gap-3">
            {(["Screenplay", "Novel"] as ProjectType[]).map((t) => (
              <button
                type="button"
                key={t}
                data-ocid={`new_project.${t.toLowerCase()}.toggle`}
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
                style={{
                  background:
                    type === t
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    type === t
                      ? "1px solid rgba(34,197,94,0.6)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color: type === t ? "#22C55E" : "#9AA0A6",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          data-ocid="new_project.submit_button"
          onClick={handleCreate}
          className="w-full py-4 rounded-xl font-bold text-base transition-all duration-200 cursor-pointer mb-3"
          style={{
            background: "#22C55E",
            color: "#050505",
            boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#16a34a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#22C55E";
          }}
        >
          Create Project
        </button>
        <button
          type="button"
          data-ocid="new_project.cancel_button"
          onClick={onClose}
          className="w-full py-2 text-sm transition-colors cursor-pointer"
          style={{ color: "#6B7280" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#9AA0A6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#6B7280";
          }}
        >
          Cancel
        </button>
      </div>
    </dialog>
  );
}
