# Tools & Modes

## Purpose

Tools and Modes provide specialized interaction paradigms for specific tasks. They transform how the user interacts with the page, enabling inspection, editing, and exploration that wouldn't be possible in the default state.

---

## Component ID Mode

### Purpose
Provide a universal addressing system for page elements that enables precise AI-assisted editing. The goal is minimal tokens, maximum precision — an LLM should know exactly where to edit without searching.

### Core Principle
**Visual:** Minimal — small pills showing element type (`<Button>`, `AnimatedStatCard`)
**Clipboard:** Complete — full file path + line number for direct navigation

```
AnimatedStatCard @ app/dashboard/page.tsx:47
```

This format tells an LLM exactly where to go. No DOM paths, no CSS classes, no noise.

---

### Activation
Enter Component ID Mode through toolbar or keyboard shortcut.

**Indicators:**
- Cursor changes to crosshair
- Mode indicator visible in toolbar
- Subtle overlay on interactive elements

---

### Visual Display

**Element Pills**
Small, unobtrusive tags appear on or near elements.

**Display:**
- Component name for React components: `AnimatedStatCard`
- HTML tag for non-components: `<div>`, `<button>`, `<h1>`
- Positioned to not obscure element content
- Semi-transparent until hovered

**Hover State:**
- Pill becomes fully opaque
- Element gets subtle highlight outline
- No tooltip clutter — the pill IS the identifier

---

### Selection Behaviors

**Single Click — Select One**
- Element highlighted
- Location copied to clipboard
- Toast confirms: "Copied: AnimatedStatCard @ page.tsx:47"

**Shift+Click — Add to Selection**
- Add element to current selection
- All selected elements copied as list
- Visual indicator on all selected elements

```
AnimatedStatCard @ app/dashboard/page.tsx:47
MetricsCard @ app/dashboard/page.tsx:52
Button @ app/dashboard/page.tsx:61
```

**Shift+Cmd+Click — Select All of Type**
- Select all instances of that component/element on current page
- Clipboard contains summary format:

```
ALL AnimatedStatCard on /dashboard (4 instances)
→ app/dashboard/page.tsx:47, 89, 134, 201
```

**Click+Drag — Rectangle Selection**
- Draw rectangle to select multiple elements
- All elements within rectangle selected
- Same clipboard format as Shift+Click

---

### Clipboard Format

**React Component:**
```
ComponentName @ path/to/file.tsx:lineNumber
```

**HTML Element (non-component):**
```
<tagName> @ path/to/file.tsx:lineNumber "content preview"
```

The content preview (first ~30 chars) helps disambiguate multiple same-tag elements.

**Multiple Selection:**
```
ComponentA @ file.tsx:12
ComponentB @ file.tsx:34
<h1> @ file.tsx:56 "Welcome to RadFlow"
```

**All of Type:**
```
ALL ComponentName on /pagePath (count instances)
→ file.tsx:12, 34, 56, 78
```

---

### Line Number Accuracy

Line numbers are **live and accurate** because:
- Rust backend maintains file index
- File watcher updates index on save
- Line numbers recalculated on file change
- Sub-second accuracy after edits

If a file changes between copy and paste, line numbers reflect the new state (not stale data).

---

### Element Identification

**What Gets an ID:**
- All React components (detected by React DevTools fiber)
- All semantic HTML elements (headings, buttons, links, etc.)
- Elements with `data-edit-scope` attribute
- Focusable/interactive elements

**What's Excluded:**
- Pure layout containers (unless they're components)
- Styling wrappers
- Internal library elements

---

### Exit Behavior

**Exit Methods:**
- Press Escape key
- Click toolbar toggle
- Activate different mode
- Close DevTools panel

**On Exit:**
- All visual pills removed
- Selection cleared
- Clipboard retains last copied selection

---

## Text Edit Mode

### Purpose
Edit text content directly on the page. Quick way to explore copy changes without editing source files.

### Activation
Enter Text Edit Mode through toolbar or keyboard shortcut.

**Indicators:**
- Mode indicator in toolbar
- Cursor changes over editable text
- Editable elements subtly highlighted

### Editable Elements
Which elements can be edited in this mode.

**Supported Elements:**
- Headings (h1-h6)
- Paragraphs (p)
- Spans
- Labels
- Button text
- Link text

**Not Editable:**
- Images
- Icons
- Inputs (use their native editing)
- Non-text elements

### Click-to-Edit
Clicking editable text enters edit state.

**Behavior:**
- Element becomes contenteditable
- Existing text selected
- Cursor positioned in text
- Keyboard input captured

### Editing Experience
While editing text content.

**Features:**
- Standard text editing (select, delete, type)
- No formatting controls (plain text only)
- Enter completes edit
- Escape cancels edit
- Click away completes edit

### Context Menu
Right-click provides additional options.

**Options:**
- Change element tag (h1 → h2, p → span, etc.)
- Copy original text
- Reset to original
- Mark as changed

### Change Tracking
All text modifications are tracked.

**Tracking:**
- Changed elements marked visually
- Original text preserved
- Change count displayed
- Changes listed in summary

### Exit Behavior
Leaving Text Edit Mode handles changes.

**On Exit:**
- All changes compiled into summary
- Summary copied to clipboard automatically
- Toast shows change count
- Page returns to original state (changes not persisted to source)

**Note:** Text Edit Mode is for exploration and copy review. Changes are not saved to source files. The clipboard export allows sharing proposed changes with content editors.

---

## Help Mode

### Purpose
Provide contextual guidance for the current state of the interface.

### Activation
Enter Help Mode through toolbar or keyboard shortcut.

**Behavior:**
- Help content appears for current context
- Context = active tab + active tool
- Overlay or panel displays help

### Contextual Help
Help content adapts to current state.

**Contexts:**
- Variables Tab — explain token editing workflow
- Typography Tab — explain typography controls
- Components Tab — explain component preview system
- Assets Tab — explain asset management
- Component ID Mode — explain inspection workflow
- Text Edit Mode — explain text editing workflow

### Help Content
What help includes.

**Content:**
- Feature title
- Brief description
- Key actions/shortcuts
- Tips and best practices
- Common workflows

### Display
How help is presented.

**Presentation:**
- Non-intrusive overlay or bar
- Readable without blocking content
- Dismissible
- Links to detailed documentation

### Exit Behavior
Leave Help Mode.

**Exit Methods:**
- Press Escape
- Click close button
- Click outside help content
- Activate different mode

---

## Preview Mode

### Purpose
View the page without DevTools chrome. See the design as users will see it.

### Activation
Toggle preview mode on/off.

**Behavior:**
- DevTools panel hides
- All overlays removed
- Page renders clean
- Keyboard shortcut still active for exit

### Page State
What happens to the page in preview.

**Preserved:**
- Current theme
- Any pending (unsaved) changes
- Current viewport
- Scroll position

**Removed:**
- DevTools panel
- Mode indicators
- Inspection overlays
- Help displays

### Exit Behavior
Return to editing mode.

**Methods:**
- Keyboard shortcut
- Edge trigger (mouse to screen edge)
- Auto-timeout (optional)

---

## Mode Interaction

### Mode Exclusivity
Only one mode active at a time.

**Behavior:**
- Activating a mode deactivates others
- Clear indication of current mode
- Easy to identify active mode
- Default state when no mode active

### Mode Persistence
Modes don't persist across sessions.

**Behavior:**
- Page refresh exits all modes
- Panel close exits all modes
- Tab switch may or may not exit mode (context-dependent)

### Mode + Tab Interaction
How modes work with tabs.

**Behavior:**
- Component ID Mode works across all tabs (it's about the page, not the panel)
- Text Edit Mode works across all tabs
- Help Mode content changes with active tab
- Some modes may restrict tab switching

---

## Ideal Behaviors

### Component ID Enhancements

**Embedded Terminal Integration**
Visual element pills appear in terminal input. Pills show truncated name, clipboard contains full path. Any CLI tool can receive element context.

**Selection Sets**
Save named selection sets for reuse. "Header elements", "Dashboard cards". Quick recall without re-selecting.

**Tree View**
Show component hierarchy tree alongside inspection. Hovering in tree highlights on page. Click in tree selects element.

**Props Inspector**
Show full props for selected component. Live values, not just defaults. Update as state changes.

**Context Injection**
Selected elements automatically available to AI tools. No manual paste needed. MCP-style bridge to external tools.

**Source Preview**
Inline preview of component source code. Scroll to relevant line. One-click open in editor.

**History**
Remember recently inspected components. Quick navigation to previous selections.

**Batch Edit Prompting**
Select multiple elements → type instruction → AI applies to all. "Make all these use rounded corners."

### Text Edit Enhancements

**Rich Text Support**
Support bold, italic, links in edit mode. Format preservation on edit.

**Spell Check**
Highlight spelling errors while editing. Suggest corrections.

**Character Count**
Show character/word count while editing. Helpful for constrained text areas.

**Multi-language Preview**
Preview text at different lengths (for i18n). Test with longer/shorter translations.

### New Modes to Consider

**Spacing Mode**
Visualize all spacing in the design. Click elements to see margin/padding. Drag to adjust spacing values.

**Color Mode**
Highlight all instances of a color. Click to see where a color is used. Bulk change color across page.

**Accessibility Mode**
Highlight accessibility issues. Show focus order. Display ARIA attributes. Contrast ratio indicators.

**Responsive Mode**
Quick viewport size switching. See breakpoint boundaries. Preview at common device sizes.

**Animation Mode**
Highlight animated elements. Pause/play animations. Adjust animation timing. Preview transitions.
