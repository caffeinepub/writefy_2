export type ProjectType = "Screenplay" | "Novel";

export type FormatType = "slugline" | "action" | "character" | "dialogue";

export interface SceneItem {
  id: string;
  title: string;
  content: string;
  type: FormatType;
}

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  content: string;
  scenes: SceneItem[];
  wordCount: number;
  sceneCount: number;
  lastEdited: number;
  createdAt: number;
}

export type Screen = "home" | "library" | "create" | "play";
