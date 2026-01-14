# AI Integration

## Purpose

AI Integration enables intelligent assistance throughout the design system workflow. RadFlow acts as a **prompt builder and context provider** for external AI tools, not an embedded AI system.

**MVP Scope:** Prompt building and context injection for external AI (Claude Code, etc.)
**Post-MVP:** Embedded AI capabilities

---

## Core Concept

RadFlow makes it easy to build precise, context-rich prompts for AI-assisted design work.

```
Select elements → Cmd+E → Build prompt → Copy → Paste in AI tool
```

The app provides:
1. **Context** — What's selected, what file, what line
2. **Quick prompts** — Common actions for selected element types
3. **Prompt library** — Organized, reusable prompts
4. **SREF codes** — Style references per theme

---

## Prompt Builder (Cmd+E)

### Concept
Contextual command palette for building AI prompts quickly.

### Flow
1. Select element(s) on canvas or in editor
2. Press Cmd+E
3. See contextual quick prompts
4. Select/modify prompt
5. Enter to copy to clipboard
6. Paste into external AI tool

### Context Injection
Prompts automatically include relevant context:
- Selected element type and name
- File path and line number
- Current theme
- Relevant token values
- Component variant (if applicable)

### Quick Prompts
Suggested actions based on selection type.

**Examples by Selection:**
- Component → "Add variant", "Update styles", "Fix accessibility"
- Token → "Generate scale", "Find usage", "Suggest alternatives"
- Multiple items → "Make consistent", "Apply to all", "Batch update"

---

## Prompt Library

### Organization
Prompts organized by category.

**Categories:**
- RadFlow Prompts (tool-specific workflows)
- Theme Prompts (theme customization)
- Component Prompts (component creation/editing)
- Style References (visual direction codes)

### Prompt Structure
What a prompt contains.

**Fields:**
- Title (what it does)
- Description (when to use)
- Prompt text (template with variables)
- Variables (customizable parts)
- Category tags

### Custom Prompts
Users can create and save prompts.

**Features:**
- Create from scratch
- Save from Cmd+E builder
- Edit existing prompts
- Organize with tags
- Export/import

---

## Style References (SREF)

### Concept
Visual direction codes for consistent AI-generated output. Per-theme basis.

### Per-Theme SREFs
Each theme can define its own style references.

**Contains:**
- SREF code identifier
- Associated visual characteristics
- Example outputs
- Usage guidelines

### Usage
Include SREF in prompts for visual consistency.

**Example:**
```
Using SREF-RAD01, update this button to match the theme aesthetic.
```

---

## Claude Code Integration

### Access Model
Claude Code can interact with RadFlow directly (local app, no browser needed).

**Capabilities:**
- View pages in the app
- Read component definitions
- Access design tokens
- Understand project structure

### Skills Integration
RadFlow-specific skills for Claude Code.

**Potential Skills:**
- Component editing
- Token management
- Theme switching
- Violation detection

*Note: Skills integration details TBD based on Claude Code capabilities.*

---

## Future: Embedded AI

Post-MVP consideration for built-in AI capabilities.

### Potential Features
- In-app chat interface
- Direct prompt execution
- AI suggestions in Properties Panel
- Violation auto-fix
- Component generation

### Requirements (Future)
- API key configuration
- Model selection
- Privacy controls
- Response handling

*Note: Embedded AI is post-MVP. This section is placeholder for future planning.*

---

## Framework Principles

### RadFlow's Role
- **Context provider** — Rich, accurate context for AI prompts
- **Prompt builder** — Quick, contextual prompt construction
- **Library manager** — Organized, reusable prompts
- **Style enforcer** — SREF codes for visual consistency

### What RadFlow Does NOT Do (MVP)
- Execute AI requests directly
- Embed chat interface
- Store API keys
- Process AI responses

### Integration Points
- Cmd+E prompt builder
- Component ID clipboard format
- Prompts tab/library
- SREF codes in themes
