import { useCallback, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { NewProjectModal } from "./components/NewProjectModal";
import { createProject, loadProjects, saveProject } from "./lib/storage";
import type { Project, ProjectType, Screen } from "./lib/types";
import { CreateScreen } from "./screens/CreateScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { LibraryScreen } from "./screens/LibraryScreen";
import { PlayScreen } from "./screens/PlayScreen";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleNavigate = useCallback((s: Screen) => {
    setScreen(s);
  }, []);

  const handleOpenProject = useCallback((project: Project) => {
    setCurrentProject(project);
    setScreen("create");
  }, []);

  const handleProjectUpdate = useCallback((updated: Project) => {
    setCurrentProject(updated);
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  }, []);

  const handleCreateProject = useCallback(
    (title: string, type: ProjectType) => {
      const newProj = createProject(title, type);
      saveProject(newProj);
      setProjects((prev) => [newProj, ...prev]);
      setCurrentProject(newProj);
      setScreen("create");
    },
    [],
  );

  const handleBackFromCreate = useCallback(() => {
    setScreen("library");
  }, []);

  return (
    <div className="relative min-h-screen">
      <main className="relative z-10" style={{ paddingBottom: "120px" }}>
        {screen === "home" && (
          <HomeScreen
            projects={projects}
            onNavigate={handleNavigate}
            onOpenProject={handleOpenProject}
            onNewProject={() => setShowModal(true)}
          />
        )}
        {screen === "library" && (
          <LibraryScreen
            projects={projects}
            onOpenProject={handleOpenProject}
            onNewProject={() => setShowModal(true)}
          />
        )}
        {screen === "create" && (
          <CreateScreen
            project={currentProject}
            onBack={handleBackFromCreate}
            onProjectUpdate={handleProjectUpdate}
          />
        )}
        {screen === "play" && (
          <PlayScreen project={currentProject} onNavigate={handleNavigate} />
        )}
      </main>

      <BottomNav activeScreen={screen} onNavigate={handleNavigate} />

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
}

export default App;
