# DevTools Modes - Implementation Plan

**Created:** 2026-01-10
**Status:** Planning
**Branch:** claude/review-progress-docs-s2n8m

---

## Overview

This document defines the focused feature sets for DevTools interactive modes. Each mode has a single purpose and clear scope.

| Mode | Scope | Purpose |
|------|-------|---------|
| **Help Mode** | DevTools panel | Explain how to use DevTools sections |
| **Component ID Mode** | Browser page | Identify components, open in DevTools |
| **Text Edit Mode** | Browser page | Collect text changes for AI |
| **Minimized Panel** | DevTools | Always-accessible tool sidebar |

**Target Audience:** Figma-familiar designers (no complexity toggles)

---

## 1. Minimized Panel State

### Rationale

Component ID Mode needs to open DevTools to show component details. A minimized state allows the panel to be "closed" while keeping tools accessible.

### Behavior

**When minimized:**
- Only LeftRail visible (slim vertical sidebar)
- All tools accessible (Component ID, Text Edit, Help)
- All tabs accessible (click expands panel)

**Layout:**
```
┌──┐
│🔍│  ← Component ID tool
│✏️│  ← Text Edit tool
│❓│  ← Help tool
├──┤
│📊│  ← Variables tab (click → expand)
│🔤│  ← Typography tab
│🧩│  ← Components tab
│📁│  ← Assets tab
│⚙️│  ← Mock States tab
└──┘
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+K` | Toggle minimized ↔ expanded |
| `1-5` | Expand panel + switch to tab |

### Implementation

**Files to modify:**
- `DevToolsProvider.tsx` - Add `isMinimized` state
- `DevToolsPanel.tsx` - Conditional render based on state
- `store/slices/panelSlice.ts` - Add minimized state + toggle

**New state:**
```typescript
interface PanelSlice {
  isOpen: boolean;        // Panel visible at all
  isMinimized: boolean;   // Panel in slim mode
  // ...existing
}
```

---

## 2. Help Mode

### Purpose

Explain DevTools UI sections. Static info bar, not overlays.

### Scope

DevTools panel only (not browser page)

### Display

Dark-themed info bar at top of panel (matches header style):

```
┌─────────────────────────────────────────────────────────────┐
│ ▓ COMPONENTS TAB                                            │
│   Browse UI components from @radflow/ui and /components.    │
│   Click any component to see variants and props.            │
│   Use ⌘⇧I to identify components on your page.             │
└─────────────────────────────────────────────────────────────┘
```

### Behavior

1. Toggle with `Cmd+Shift+?` or Help tool button
2. Info bar appears at top of DevTools panel
3. Content updates based on active tab or hovered element
4. Normal navigation still works (not blocking)
5. ESC or toggle again to exit

### Content Map

| Context | Title | Description |
|---------|-------|-------------|
| Variables tab | VARIABLES | Edit design tokens. Changes preview live. Click "Save to CSS" to persist. |
| Typography tab | TYPOGRAPHY | Manage fonts and base HTML typography. Changes save to globals.css. |
| Components tab | COMPONENTS | Browse available components. Click to see variants and props. |
| Assets tab | ASSETS | Browse icons and images. Click any asset to copy its name. |
| Mock States tab | MOCK STATES | Simulate auth, wallet, and subscription states for testing. |
| Component ID tool hover | COMPONENT ID | Click any element on your page to identify its component. |
| Text Edit tool hover | TEXT EDIT | Click text to edit inline. Enter saves, Escape cancels. |
| Help tool hover | HELP | You are here. Hover over tabs and tools for info. |
| Resize handle hover | RESIZE | Drag to resize panel width. |
| Search hover | SEARCH | Press ⌘E to search across all tabs. |

### Implementation

**Files to modify:**
- `components/HelpMode.tsx` - Replace tooltip with static bar
- `lib/helpRegistry.ts` - Update content structure
- `DevToolsPanel.tsx` - Add help bar to panel header area

**New registry structure:**
```typescript
interface HelpItem {
  title: string;      // Short uppercase title
  description: string; // One sentence explanation
  tip?: string;       // Optional keyboard shortcut or tip
}
```

---

## 3. Component ID Mode

### Purpose

Identify components on the page, open them in DevTools.

### Scope

Browser page only (not DevTools panel)

### Behavior

**Hover:**
- Blue outline on RadFlow components
- Floating label shows component name + source

```
┌─────────────────┐
│ Button          │
│ @radflow/ui     │
└─────────────────┘
```

**Click:**
- Opens DevTools (expands if minimized)
- Navigates to component in Components tab
- Component is highlighted/selected

**Right-click RadFlow component:**
- Context menu: "Open in Components tab"

**Right-click non-RadFlow element:**
- Context menu: "Extract to component..." (future feature)

### Click Actions

| Action | Result |
|--------|--------|
| Click | Open in Components tab |
| Cmd+Click | Copy component name |
| Right-click | Context menu |

### Implementation

**Files to modify:**
- `components/ComponentIdMode.tsx` - Add click handler
- `store/slices/componentIdSlice.ts` - Add navigation action
- `store/slices/panelSlice.ts` - Add expandAndNavigate action

**New flow:**
```
Click component →
  panelSlice.expandPanel() →
  panelSlice.setActiveTab('components') →
  componentsSlice.selectComponent(name)
```

---

## 4. Text Edit Mode

### Current State (Complete)

Text Edit Mode is already well-implemented:

| Feature | Status |
|---------|--------|
| Click to edit text | ✅ |
| Enter commits change | ✅ |
| Escape reverts | ✅ |
| Clipboard format for AI | ✅ |
| Hover highlight | ✅ |

### One Enhancement

**Add change count indicator:**

When text edit is active and changes exist, show badge on tool button:

```
┌──┐
│✏️│ 3  ← Badge shows pending change count
└──┘
```

### Implementation

**Files to modify:**
- `components/LeftRail.tsx` - Add badge to text edit button
- Read from `textEditSlice.pendingChanges.length`

---

## 5. Components Tab

### Decision: No Copy Buttons

**Rationale:** With AI agents, users describe intent rather than copy code.

- "Use the Button with secondary variant" → Agent generates JSX
- The value of Components tab is **reference**, not copying

### Keep Current Behavior

- Component name and source path
- Props table (type, required, default)
- Visual preview of variants
- Search functionality

---

## Removed Features

### CommentsTab
- **Deleted:** 2026-01-10
- **Reason:** Stub code, no implementation planned

### ChangelogTab
- **Deleted:** 2026-01-10
- **Reason:** Stub code, not needed for current workflow

### Vault Documentation
- **Deleted:** 2026-01-10
- **Reason:** Outdated, replaced by in-code documentation

---

## Implementation Order

1. **Minimized Panel State** - Foundation for Component ID click behavior
2. **Help Mode Refactor** - Replace tooltip with static bar
3. **Component ID Click Handler** - Navigate to Components tab
4. **Text Edit Badge** - Show pending change count

---

## File Changes Summary

| File | Changes |
|------|---------|
| `store/slices/panelSlice.ts` | Add `isMinimized`, `expandPanel()` |
| `DevToolsPanel.tsx` | Conditional render for minimized state |
| `DevToolsProvider.tsx` | Update keyboard handler for minimize toggle |
| `components/HelpMode.tsx` | Replace tooltip with static bar |
| `components/LeftRail.tsx` | Add badge support for text edit |
| `components/ComponentIdMode.tsx` | Add click → navigate behavior |
| `lib/helpRegistry.ts` | Simplify to title + description |

---

## Questions Resolved

1. ~~Copy import useful?~~ → No, removed
2. ~~Copy code useful?~~ → No, removed
3. ~~Help overlay style?~~ → Static bar in header
4. ~~Non-RadFlow elements?~~ → Right-click context menu (future)
