import type { Project, ProjectType } from "./types";

const STORAGE_KEY = "writefy_projects";

const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Neon Requiem",
    type: "Screenplay",
    content: `EXT. RAIN-SOAKED ALLEY - NIGHT

Glittering neon signs reflect in puddles. Steam rises from grates.

DETECTIVE MARLOWE (40s, rumpled coat, cigarette behind ear) crouches over a body.

MARLOWE
Three gunshots. Close range. No witnesses.

His partner, AGENT CHEN (30s, sharp suit), approaches from behind.

CHEN
The same M.O. as the Chinatown case. Someone is sending a message.

MARLOWE
(standing, surveying the alley)
Every message has a sender.

INT. PRECINCT - DETECTIVE'S OFFICE - NIGHT

Marlowe pins photos to a corkboard. Red string connects faces, places.

MARLOWE (V.O.)
The city never sleeps. Neither do I. Not since she disappeared.`,
    scenes: [
      {
        id: "s1",
        title: "EXT. RAIN-SOAKED ALLEY - NIGHT",
        content: "Opening crime scene",
        type: "slugline",
      },
      {
        id: "s2",
        title: "INT. PRECINCT - DETECTIVE'S OFFICE - NIGHT",
        content: "Investigation begins",
        type: "slugline",
      },
    ],
    wordCount: 98,
    sceneCount: 2,
    lastEdited: Date.now() - 1000 * 60 * 60 * 2,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "2",
    title: "The Last Cartographer",
    type: "Novel",
    content: `Chapter One: The Map That Breathed

Elara had drawn a thousand maps, but none had ever drawn back.

She pressed her fingertip to the parchment and felt it — the faintest pulse, like a heartbeat trapped under centuries of ink. The lantern above her workbench flickered. Shadows leaped and danced.

"Impossible," she whispered, but the word tasted like a lie even as she spoke it.

The map was alive. And it was trying to show her something.`,
    scenes: [
      {
        id: "s1",
        title: "Chapter One: The Map That Breathed",
        content: "Elara discovers the living map",
        type: "action",
      },
    ],
    wordCount: 112,
    sceneCount: 1,
    lastEdited: Date.now() - 1000 * 60 * 60 * 24,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: "3",
    title: "Parallel Hearts",
    type: "Screenplay",
    content: `INT. QUANTUM RESEARCH LAB - DAY

Humming machinery fills every surface. Holographic displays show overlapping timelines.

DR. SOFIA REYES (30s, brilliant, sleep-deprived) stares at two quantum signatures.

SOFIA
(to herself)
They're identical. Across both universes. Completely identical.

Her colleague DR. JAMES PARK enters, coffee in hand.

JAMES
Did you sleep here again?

SOFIA
Sleep is a construct, James. Look at this.`,
    scenes: [
      {
        id: "s1",
        title: "INT. QUANTUM RESEARCH LAB - DAY",
        content: "Sofia discovers parallel signature",
        type: "slugline",
      },
    ],
    wordCount: 88,
    sceneCount: 1,
    lastEdited: Date.now() - 1000 * 60 * 60 * 24 * 3,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
  },
  {
    id: "4",
    title: "Ghost Protocol: Tokyo",
    type: "Screenplay",
    content: `EXT. SHIBUYA CROSSING - NIGHT

Thousands of pedestrians flow in every direction. Among them — AGENT KIRA (20s, unassuming, deadly) moves against the current.

KIRA (V.O.)
They train you to disappear. In crowds, in plain sight, in your own mind.

INT. IZAKAYA BAR - CONTINUOUS

The bar is dim. Sake flows. KIRA slides onto the stool next to the TARGET.

TARGET
(nervous)
I was told you'd be... older.

KIRA
(small smile)
And I was told you'd be smarter.`,
    scenes: [
      {
        id: "s1",
        title: "EXT. SHIBUYA CROSSING - NIGHT",
        content: "Kira tracks her target",
        type: "slugline",
      },
      {
        id: "s2",
        title: "INT. IZAKAYA BAR - CONTINUOUS",
        content: "Contact scene",
        type: "slugline",
      },
    ],
    wordCount: 104,
    sceneCount: 2,
    lastEdited: Date.now() - 1000 * 60 * 60 * 24 * 7,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
];

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProjects(SAMPLE_PROJECTS);
      return SAMPLE_PROJECTS;
    }
    return JSON.parse(raw) as Project[];
  } catch {
    return SAMPLE_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function saveProject(project: Project): void {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.unshift(project);
  }
  saveProjects(projects);
}

export function createProject(title: string, type: ProjectType): Project {
  const now = Date.now();
  return {
    id: `proj_${now}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    type,
    content: "",
    scenes: [],
    wordCount: 0,
    sceneCount: 0,
    lastEdited: now,
    createdAt: now,
  };
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
