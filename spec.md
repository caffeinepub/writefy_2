# Writefy — Screenplay Writing Assist Features

## Current State
- Block-based screenplay engine in `useScreenplayEngine.ts` (1005 lines)
- LineType union: `"scene-heading" | "action" | "character" | "dialogue" | "parenthetical" | "transition"`
- Toolbar buttons: Undo, Redo, Slugline, Action, Character, Dialogue, Paren, Transition, A-, A+, B/I/U/S, Font, Save, TW, Import
- Transition button calls `engine.setLineType()` immediately (no delay, no selection list)
- No "Shot" or "VO" LineType or toolbar buttons
- INT/EXT autocorrect only works via SPACE shortcut — no protection against device spellcheck turning "ext" into "Extract"
- Parenthetical: `setLineType` wraps in parens but no `(` auto-close or text-selection wrapping
- Character memory fully works (Set, suggestions, TAB fill)

## Requested Changes (Diff)

### Add
- `"shot"` to `LineType` union in useScreenplayEngine.ts
- Shot toolbar button (alongside existing buttons, no redesign)
- VO toolbar button (alongside existing buttons, no redesign)
- `pendingMode` state in CreateScreen: tracks `"transition" | "shot" | "vo" | null` — set when user clicks Transition/Shot/VO but not yet typed
- Selection dropdown component: opens when `pendingMode !== null` AND user types first char or presses Enter on that line
- TRANSITIONS_LIST: CUT TO:, SMASH CUT:, MATCH CUT:, JUMP CUT:, DISSOLVE TO:, FADE IN:, FADE OUT:, WIPE TO:, L CUT:, J CUT:
- SHOT_TYPES_LIST: CLOSE UP (CU), EXTREME CLOSE UP (ECU), MEDIUM SHOT (MS), LONG SHOT (LS), OVER THE SHOULDER (OTS), POV SHOT, WIDE SHOT, TRACKING SHOT, PAN SHOT, TILT SHOT
- VO_TYPES_LIST: (V.O.), (O.S.), (CONT'D), (FILTERED), (PHONE), (RADIO)
- Insert behavior: selecting from list inserts formatted text, cursor at end
  - Transition → uppercase text right-aligned (e.g. "CUT TO:")
  - Shot → uppercase action-style (e.g. "CLOSE UP:")
  - VO → appended to character name (e.g. "RAHUL (V.O.)")
- `getLineStyle` case for `"shot"`: uppercase, action-style block (full width)
- INT/EXT spellcheck protection: intercept `onInput` in ScreenplayLine, detect if text contains "Extract" or "Internal" or other common autocorrections of "ext"/"int", reverse them back. Also add `autoCorrect="off" autoCapitalize="off" spellCheck={false}` to contenteditable divs.
- Smart parenthesis Case 1: clicking Paren toolbar with no selection → insert `()` with cursor between them
- Smart parenthesis Case 2: clicking Paren toolbar with text selected → wrap in `(selected text)`
- Smart parenthesis Case 3: typing `(` auto-inserts closing `)` and places cursor inside

### Modify
- Transition toolbar button: clicking sets `pendingMode = "transition"` instead of calling setLineType immediately. The actual setLineType + insert happens when the user selects from the dropdown.
- ScreenplayLine contenteditable: add `autoCorrect="off" autoCapitalize="characters" spellCheck={false}` attributes. Add `onInput` intercept for "ext"→"EXT." and "int"→"INT." reversal.
- Parenthetical toolbar button onClick: check for text selection first; if selection → wrap; if no selection → insert `()` with cursor inside.
- `handleLineKeyDown` for `(` key: auto-insert `)` and reposition cursor.

### Remove
- Nothing removed. UI layout, spacing, toolbar design unchanged.

## Implementation Plan

1. **`useScreenplayEngine.ts`**:
   - Add `"shot"` to `LineType`
   - Add `getLineStyle` case for `"shot"`: full-width, uppercase, same weight as action
   - Add `detectLineType` recognition for SHOT prefixes (CLOSE UP:, ECU:, MS:, etc.)
   - In `handleLineKeyDown` Enter: add `"shot"` case → nextType = `"action"`
   - Export `insertVOOnCharacter(id: string, voType: string)` helper: gets character line, appends VO suffix to name
   - In `setLineText`: handle `"shot"` type → uppercase text

2. **`CreateScreen.tsx`**:
   - Add `pendingMode: "transition" | "shot" | "vo" | null` state
   - Add Shot + VO toolbar buttons (same style as existing Transition/Paren buttons)
   - Change Transition onClick: `setPendingMode("transition")` only
   - Shot onClick: `setPendingMode("shot")`
   - VO onClick: `setPendingMode("vo")`
   - Add `SelectionDropdown` component (inline, not a separate file): renders when `pendingMode !== null && selectionDropdownOpen`, positioned near the active line
   - Intercept `handleLineKeyDown` wrapper: if `pendingMode !== null` and user types first char or Enter → open dropdown, prevent default, clear pendingMode
   - On dropdown item select: insert text into the active line via engine, close dropdown
   - Fix Parenthetical button onClick: check `window.getSelection()`, if text selected in active line → wrap with parens; else → insert `()` at cursor
   - In ScreenplayLine: add `autoCorrect="off"` and intercept `onInput` to reverse autocorrect on ext/int
   - In `handleLineKeyDown` for `(` key: auto-close with `)`

3. **VO insert logic**:
   - When user picks a VO type and the current line is a `"character"` line: append suffix (e.g. ` (V.O.)`) to character name
   - When current line is action: treat like a character line starting fresh → set type to character, set text to `"CHARACTER (V.O.)"` placeholder
   - Cursor placed after the closing `)` of the VO suffix

4. **No UI layout changes** — all new buttons match existing toolbar button style exactly.
