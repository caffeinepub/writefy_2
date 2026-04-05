# Writefy - Premium Screenplay Writing App

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Full screenplay writing app with Spotify-style bottom navigation (4 tabs: Home, Library, Create, Play)
- Global dark theme with black background, subtle green radial gradient glow, and watermark "W WRITEFY" text
- Home screen with: Continue Writing hero card (type, title, last edited, Resume Writing CTA), Recent Projects horizontal scroll, Start New dashed card
- Library screen with: title/subtitle, grid/list view toggle, 2-column project cards (type, title, word count, scene count, last edited), floating + button
- Create/Editor screen with: project title + metadata header, Write/Outline tabs (text style with underline active), formatting toolbar (Slugline, Action, Character, Dialogue), clean textarea editor
- Play/Reader screen with: clean screenplay reader, centered dialogue, cinematic spacing, minimal UI
- All navigation between screens functional
- Backend: project CRUD (title, type, content, scenes, word count, last edited timestamps)

### Modify
N/A — new project

### Remove
N/A — new project

## Implementation Plan
1. Backend actor: Project type with id, title, type (Screenplay/Novel), content, scenes array, word count, lastEdited timestamp. CRUD operations: createProject, getProjects, updateProject, deleteProject, getProject.
2. Frontend: React app with global CSS background system (body, ::before, ::after pseudo-elements), bottom nav component, 4 screen components.
3. Home screen: hero card from most-recent project, horizontal scroll recent projects, dashed new project card.
4. Library screen: LayoutGrid/List toggle, 2-col grid cards with metadata, floating action button.
5. Create screen: editor header, Write/Outline tab switcher, formatting toolbar row, contenteditable or textarea editor.
6. Play screen: reader mode renderer parsing screenplay format, centered dialogue blocks, cinematic spacing.
7. Wire all navigation interactions and card click-throughs.
