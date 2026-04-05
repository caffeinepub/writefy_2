import { ArrowLeft, BookOpen } from "lucide-react";
import type { Project, Screen } from "../lib/types";

interface PlayScreenProps {
  project: Project | null;
  onNavigate: (screen: Screen) => void;
}

function renderScreenplayContent(content: string): React.ReactNode[] {
  if (!content.trim()) return [];

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let keyIdx = 0;
  let lastWasCharacter = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={keyIdx++} style={{ height: "12px" }} />);
      lastWasCharacter = false;
      continue;
    }

    const isSlugline =
      /^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)/.test(trimmed) ||
      (trimmed === trimmed.toUpperCase() &&
        trimmed.length > 4 &&
        !/^["(]/.test(trimmed) &&
        /[A-Z]{3,}/.test(trimmed) &&
        trimmed.includes(" "));

    const isCharacterLine =
      !isSlugline &&
      trimmed === trimmed.toUpperCase() &&
      trimmed.length < 40 &&
      !trimmed.includes(".") &&
      /^[A-Z]/.test(trimmed) &&
      /[A-Z]{2,}/.test(trimmed);

    const isParenthetical = /^\(/.test(trimmed) && /\)/.test(trimmed);

    if (isSlugline) {
      lastWasCharacter = false;
      elements.push(
        <div
          key={keyIdx++}
          className="mt-8 mb-2"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#f5f5f5",
            fontSize: "15px",
          }}
        >
          {trimmed}
        </div>,
      );
    } else if (isCharacterLine) {
      lastWasCharacter = true;
      elements.push(
        <div
          key={keyIdx++}
          className="mt-6 mb-1 text-center"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            textTransform: "uppercase",
            color: "#9AA0A6",
            fontSize: "14px",
            letterSpacing: "0.05em",
          }}
        >
          {trimmed}
        </div>,
      );
    } else if (isParenthetical) {
      lastWasCharacter = false;
      elements.push(
        <div
          key={keyIdx++}
          className="text-center mb-1"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            color: "#6B7280",
            fontSize: "13px",
            paddingLeft: "25%",
            paddingRight: "25%",
          }}
        >
          {trimmed}
        </div>,
      );
    } else if (
      lastWasCharacter ||
      line.startsWith("  ") ||
      line.startsWith("\t")
    ) {
      lastWasCharacter = false;
      elements.push(
        <div
          key={keyIdx++}
          className="mb-2"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            color: "#d4d4d4",
            fontSize: "14px",
            paddingLeft: "25%",
            paddingRight: "25%",
            lineHeight: 1.65,
          }}
        >
          {trimmed}
        </div>,
      );
    } else {
      lastWasCharacter = false;
      elements.push(
        <div
          key={keyIdx++}
          className="mb-4"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            color: "#e0e0e0",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          {line}
        </div>,
      );
    }
  }

  return elements;
}

export function PlayScreen({ project, onNavigate }: PlayScreenProps) {
  const progress =
    project && project.content.length > 0
      ? Math.min(100, Math.floor((project.content.length / 5000) * 100))
      : 0;

  if (!project) {
    return (
      <div
        data-ocid="play.page"
        className="min-h-screen flex items-center justify-center pb-36 relative z-10 px-6"
      >
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.15)",
            }}
          >
            <BookOpen size={32} style={{ color: "rgba(34,197,94,0.6)" }} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Nothing to Read</h2>
          <p className="text-sm mb-6" style={{ color: "#9AA0A6" }}>
            Select a project from your Library to read it here.
          </p>
          <button
            type="button"
            data-ocid="play.library.button"
            onClick={() => onNavigate("library")}
            className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200"
            style={{
              background: "#22C55E",
              color: "#050505",
              boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#16a34a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#22C55E";
            }}
          >
            Go to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="play.page"
      className="min-h-screen pb-36 relative z-10"
      style={{ background: "#000" }}
    >
      <div
        className="fixed top-0 left-0 right-0 z-30 h-0.5"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, background: "#22C55E" }}
        />
      </div>

      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-4"
        style={{
          background: "rgba(0,0,0,0.92)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          type="button"
          data-ocid="play.back.button"
          onClick={() => onNavigate("library")}
          className="flex items-center justify-center w-9 h-9 rounded-full transition-all cursor-pointer flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.06)", color: "#9AA0A6" }}
          aria-label="Back to Library"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">
            {project.title}
          </p>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            {project.type}
          </p>
        </div>
        <div
          className="px-2.5 py-1 rounded-full flex-shrink-0"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            color: "#22C55E",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          READING MODE
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div
          className="text-center mb-12 pb-8"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#f5f5f5",
            }}
          >
            {project.title}
          </h1>
          <p
            style={{
              color: "#6B7280",
              fontSize: "13px",
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            {project.type} &middot; {project.wordCount.toLocaleString()} words
          </p>
        </div>

        {project.content.trim() ? (
          <div>{renderScreenplayContent(project.content)}</div>
        ) : (
          <div
            data-ocid="play.content.empty_state"
            className="text-center py-20"
          >
            <p
              style={{
                color: "#4B5563",
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              [ This project has no content yet ]
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
