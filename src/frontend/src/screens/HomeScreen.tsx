import { Clock, FileText, Play, Plus } from "lucide-react";
import { formatRelativeTime } from "../lib/storage";
import type { Project, Screen } from "../lib/types";

interface HomeScreenProps {
  projects: Project[];
  onNavigate: (screen: Screen) => void;
  onOpenProject: (project: Project) => void;
  onNewProject: () => void;
}

export function HomeScreen({
  projects,
  onNavigate,
  onOpenProject,
  onNewProject,
}: HomeScreenProps) {
  const mostRecent =
    projects.length > 0
      ? [...projects].sort((a, b) => b.lastEdited - a.lastEdited)[0]
      : null;

  const recentProjects = projects
    .filter((p) => p.id !== mostRecent?.id)
    .sort((a, b) => b.lastEdited - a.lastEdited)
    .slice(0, 8);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div data-ocid="home.page" className="min-h-screen pb-36 relative z-10">
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <div>
          <p className="text-sm font-medium" style={{ color: "#9AA0A6" }}>
            {greeting}
          </p>
          <p className="text-base font-semibold text-white">Ready to write?</p>
        </div>
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full font-black text-sm"
          style={{
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#22C55E",
            letterSpacing: "0.05em",
          }}
        >
          W
        </div>
      </div>

      <div className="px-6 space-y-8">
        <section data-ocid="home.continue.section">
          <h2
            className="text-2xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Continue Writing
          </h2>

          {mostRecent ? (
            <div
              data-ocid="home.continue.card"
              className="rounded-2xl p-6 transition-all duration-300"
              style={{
                background: "rgba(12,12,12,0.9)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => onOpenProject(mostRecent)}
                onMouseEnter={(e) => {
                  const card = e.currentTarget.closest(
                    ".rounded-2xl",
                  ) as HTMLElement;
                  if (card) card.style.borderColor = "rgba(34,197,94,0.2)";
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget.closest(
                    ".rounded-2xl",
                  ) as HTMLElement;
                  if (card) card.style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    <FileText size={22} style={{ color: "#22C55E" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2"
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        color: "#22C55E",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {mostRecent.type.toUpperCase()}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 leading-tight truncate">
                      {mostRecent.title}
                    </h3>
                    <div
                      className="flex items-center gap-1 text-sm"
                      style={{ color: "#9AA0A6" }}
                    >
                      <Clock size={12} />
                      <span>
                        Last edited {formatRelativeTime(mostRecent.lastEdited)}
                      </span>
                      <span className="mx-1">·</span>
                      <span>{mostRecent.wordCount.toLocaleString()} words</span>
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                data-ocid="home.resume.primary_button"
                onClick={() => onOpenProject(mostRecent)}
                className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer"
                style={{
                  background: "#22C55E",
                  color: "#050505",
                  boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#16a34a";
                  e.currentTarget.style.boxShadow =
                    "0 4px 24px rgba(34,197,94,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#22C55E";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(34,197,94,0.3)";
                }}
              >
                <Play size={14} fill="#050505" />
                Resume Writing
              </button>
            </div>
          ) : (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "rgba(12,12,12,0.9)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p style={{ color: "#9AA0A6" }}>
                No projects yet. Start writing something!
              </p>
            </div>
          )}
        </section>

        {recentProjects.length > 0 && (
          <section data-ocid="home.recent.section">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                Recent Projects
              </h2>
              <button
                type="button"
                data-ocid="home.library.link"
                onClick={() => onNavigate("library")}
                className="text-sm font-medium cursor-pointer transition-opacity hover:opacity-70"
                style={{ color: "#22C55E" }}
              >
                See all
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {recentProjects.map((project, idx) => (
                <button
                  type="button"
                  key={project.id}
                  data-ocid={`home.recent.item.${idx + 1}`}
                  className="flex-shrink-0 w-44 rounded-xl p-4 cursor-pointer transition-all duration-200 text-left"
                  style={{
                    background: "rgba(12,12,12,0.9)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onClick={() => onOpenProject(project)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(34,197,94,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                  }}
                >
                  <div
                    className="w-full h-24 rounded-lg mb-3 flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(0,0,0,0.4) 100%)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <FileText
                      size={24}
                      style={{ color: "rgba(34,197,94,0.4)" }}
                    />
                  </div>
                  <div
                    className="inline-block px-1.5 py-0.5 rounded mb-1.5"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      color: "#22C55E",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {project.type.toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1">
                    {project.title}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {project.wordCount.toLocaleString()} words
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        <section data-ocid="home.new.section">
          <button
            type="button"
            data-ocid="home.new.open_modal_button"
            onClick={onNewProject}
            className="w-full rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
            style={{
              border: "1.5px dashed rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.01)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)";
              e.currentTarget.style.background = "rgba(34,197,94,0.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.background = "rgba(255,255,255,0.01)";
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <Plus size={22} style={{ color: "#22C55E" }} />
            </div>
            <span className="text-sm font-medium" style={{ color: "#9AA0A6" }}>
              + Start something new
            </span>
          </button>
        </section>

        <footer className="text-center py-4">
          <p className="text-xs" style={{ color: "#374151" }}>
            &copy; {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "#22C55E" }}
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
