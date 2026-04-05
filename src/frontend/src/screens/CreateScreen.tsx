import {
  AlignLeft,
  ArrowLeft,
  GripVertical,
  MapPin,
  MessageSquare,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { countWords, saveProject } from "../lib/storage";
import type { FormatType, Project, SceneItem } from "../lib/types";

interface CreateScreenProps {
  project: Project | null;
  onBack: () => void;
  onProjectUpdate: (project: Project) => void;
}

type EditorTab = "write" | "outline";

const FORMAT_OPTIONS: {
  id: FormatType;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { id: "slugline", label: "Slugline", icon: MapPin },
  { id: "action", label: "Action", icon: AlignLeft },
  { id: "character", label: "Character", icon: User },
  { id: "dialogue", label: "Dialogue", icon: MessageSquare },
];

function getFormatStyle(format: FormatType): React.CSSProperties {
  if (format === "slugline") {
    return {
      textTransform: "uppercase",
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "#f5f5f5",
    };
  }
  if (format === "character") {
    return {
      textTransform: "uppercase",
      textAlign: "center",
      color: "#9AA0A6",
    };
  }
  if (format === "dialogue") {
    return { paddingLeft: "20%", paddingRight: "10%", color: "#d4d4d4" };
  }
  return { color: "#e0e0e0" };
}

export function CreateScreen({
  project,
  onBack,
  onProjectUpdate,
}: CreateScreenProps) {
  const [tab, setTab] = useState<EditorTab>("write");
  const [activeFormat, setActiveFormat] = useState<FormatType>("action");
  const [content, setContent] = useState(project?.content ?? "");
  const [title, setTitle] = useState(project?.title ?? "");
  const [scenes, setScenes] = useState<SceneItem[]>(project?.scenes ?? []);
  const [newSceneTitle, setNewSceneTitle] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const projectRef = useRef(project);
  projectRef.current = project;

  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset when project ID changes
  useEffect(() => {
    const p = projectRef.current;
    if (p) {
      setContent(p.content);
      setTitle(p.title);
      setScenes(p.scenes);
    }
  }, [project?.id]);

  const persistProject = useCallback(
    (
      updatedContent: string,
      updatedTitle: string,
      updatedScenes: SceneItem[],
    ) => {
      if (!project) return;
      const updated: Project = {
        ...project,
        title: updatedTitle,
        content: updatedContent,
        scenes: updatedScenes,
        wordCount: countWords(updatedContent),
        sceneCount: updatedScenes.length,
        lastEdited: Date.now(),
      };
      saveProject(updated);
      onProjectUpdate(updated);
    },
    [project, onProjectUpdate],
  );

  function handleContentChange(val: string) {
    setContent(val);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistProject(val, title, scenes);
    }, 1000);
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistProject(content, val, scenes);
    }, 1000);
  }

  function handleAddScene() {
    if (!newSceneTitle.trim()) return;
    const newScene: SceneItem = {
      id: `scene_${Date.now()}`,
      title: newSceneTitle.trim(),
      content: "",
      type: "slugline",
    };
    const updated = [...scenes, newScene];
    setScenes(updated);
    setNewSceneTitle("");
    persistProject(content, title, updated);
  }

  function handleDeleteScene(id: string) {
    const updated = scenes.filter((s) => s.id !== id);
    setScenes(updated);
    persistProject(content, title, updated);
  }

  function handleSceneTitleChange(id: string, val: string) {
    const updated = scenes.map((s) => (s.id === id ? { ...s, title: val } : s));
    setScenes(updated);
    persistProject(content, title, updated);
  }

  if (!project) {
    return (
      <div
        data-ocid="create.page"
        className="min-h-screen flex items-center justify-center pb-36 relative z-10"
      >
        <div className="text-center px-6">
          <p className="text-white font-semibold mb-2">No project selected</p>
          <p className="text-sm" style={{ color: "#9AA0A6" }}>
            Go to Library to open a project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="create.page"
      className="min-h-screen pb-36 relative z-10 flex flex-col"
    >
      <div className="px-4 pt-6 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            data-ocid="create.back.button"
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.06)", color: "#9AA0A6" }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <input
              data-ocid="create.title.input"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-transparent text-xl font-bold text-white outline-none placeholder-gray-600 truncate"
              placeholder="Untitled Project"
              style={{ letterSpacing: "-0.02em" }}
            />
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  color: "#22C55E",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {project.type.toUpperCase()}
              </span>
              <span className="text-xs" style={{ color: "#6B7280" }}>
                {countWords(content).toLocaleString()} words
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex gap-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {(["write", "outline"] as EditorTab[]).map((t) => (
            <button
              type="button"
              key={t}
              data-ocid={`create.${t}.tab`}
              onClick={() => setTab(t)}
              className="pb-3 text-sm font-semibold capitalize transition-all duration-200 cursor-pointer relative"
              style={{ color: tab === t ? "#f5f5f5" : "#6B7280" }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {tab === t && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "#22C55E" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === "write" ? (
        <div className="flex flex-col flex-1 px-4 pt-4">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {FORMAT_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                data-ocid={`create.format.${id}.toggle`}
                onClick={() => {
                  setActiveFormat(id);
                  textareaRef.current?.focus();
                }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background:
                    activeFormat === id
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(255,255,255,0.05)",
                  border:
                    activeFormat === id
                      ? "1px solid rgba(34,197,94,0.5)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color: activeFormat === id ? "#22C55E" : "#9AA0A6",
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          <div
            className="flex-1 rounded-xl p-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              minHeight: "380px",
            }}
          >
            <textarea
              ref={textareaRef}
              data-ocid="create.editor"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Begin your screenplay..."
              className="w-full h-full bg-transparent outline-none resize-none placeholder-gray-700"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "14px",
                lineHeight: "1.7",
                minHeight: "380px",
                ...getFormatStyle(activeFormat),
              }}
              spellCheck={false}
            />
          </div>

          <p className="mt-2 text-xs text-right" style={{ color: "#374151" }}>
            Auto-saved &middot; {countWords(content).toLocaleString()} words
          </p>
        </div>
      ) : (
        <div className="flex-1 px-4 pt-4">
          <div className="flex gap-2 mb-5">
            <input
              data-ocid="create.scene.input"
              type="text"
              value={newSceneTitle}
              onChange={(e) => setNewSceneTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddScene();
              }}
              placeholder="Scene title (e.g. EXT. COFFEE SHOP - DAY)"
              className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "'Courier New', Courier, monospace",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            />
            <button
              type="button"
              data-ocid="create.scene.add.button"
              onClick={handleAddScene}
              className="flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{ background: "#22C55E", color: "#050505" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#16a34a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#22C55E";
              }}
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {scenes.length === 0 ? (
            <div
              data-ocid="create.outline.empty_state"
              className="text-center py-16"
            >
              <p className="font-semibold mb-1" style={{ color: "#6B7280" }}>
                No scenes yet
              </p>
              <p className="text-sm" style={{ color: "#4B5563" }}>
                Start writing to auto-detect sluglines, or add scenes manually
                above.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  data-ocid={`create.scene.item.${idx + 1}`}
                  className="flex items-center gap-3 p-4 rounded-xl group"
                  style={{
                    background: "rgba(12,12,12,0.9)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <GripVertical
                    size={16}
                    style={{ color: "#4B5563" }}
                    className="flex-shrink-0 cursor-grab"
                  />
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      color: "#22C55E",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={scene.title}
                    onChange={(e) =>
                      handleSceneTitleChange(scene.id, e.target.value)
                    }
                    className="flex-1 bg-transparent text-sm font-medium text-white outline-none"
                    style={{
                      fontFamily: "'Courier New', Courier, monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  />
                  <button
                    type="button"
                    data-ocid={`create.scene.delete_button.${idx + 1}`}
                    onClick={() => handleDeleteScene(scene.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                    style={{ color: "#6B7280" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6B7280";
                    }}
                    aria-label="Delete scene"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
