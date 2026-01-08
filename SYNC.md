# RadTools Sync Configuration

This document defines what `radtools update` (or `npx radtools sync`) should push to Radiants projects.

## Sync Philosophy

RadTools is the **shared foundation** for all Radiants projects. It syncs:
- UI components (design system primitives)
- DevTools (visual development panel)
- Claude Code agents & skills (AI-assisted development)
- Documentation (vault docs for components/patterns)

Project-specific code (apps, window management, custom components) stays local.

---

## Syncable Content

### 1. Components (`templates/components/ui/`)

All RadTools UI primitives. These are the building blocks.

```
components/ui/
├── Accordion.tsx
├── Alert.tsx
├── Badge.tsx
├── Breadcrumbs.tsx
├── Button.tsx
├── Card.tsx
├── Checkbox.tsx
├── ContextMenu.tsx
├── CountdownTimer.tsx    # NEW - from RadOS
├── Dialog.tsx
├── Divider.tsx
├── DropdownMenu.tsx
├── HelpPanel.tsx
├── Input.tsx
├── MockStatesPopover.tsx # NEW - from RadOS
├── Popover.tsx
├── Progress.tsx
├── Select.tsx
├── Sheet.tsx
├── Slider.tsx
├── Switch.tsx
├── Tabs.tsx
├── Toast.tsx             # NEW - from RadOS
├── Tooltip.tsx
├── Web3ActionBar.tsx     # NEW - from RadOS
├── index.ts
└── hooks/
    └── useModalBehavior.ts
```

### 2. DevTools (`templates/devtools/`)

Visual development panel with Zustand store.

```
devtools/
├── DevToolsProvider.tsx
├── DevToolsPanel.tsx
├── index.ts
├── types/
├── store/
│   ├── index.ts
│   └── slices/
├── tabs/
│   ├── VariablesTab/
│   ├── TypographyTab/
│   ├── ComponentsTab/
│   ├── AssetsTab/
│   └── MockStatesTab/
├── components/
├── lib/
│   ├── cssParser.ts
│   ├── componentScanner.ts
│   ├── searchIndexes.ts
│   └── selectorGenerator.ts
└── hooks/
    └── useMockState.ts
```

### 3. API Routes (`templates/api-routes/`)

DevTools backend for CSS/asset management.

```
api-routes/devtools/
├── read-css/route.ts
├── write-css/route.ts
├── components/route.ts
├── components/create-folder/route.ts
├── fonts/route.ts
├── fonts/upload/route.ts
├── assets/route.ts
└── assets/optimize/route.ts
```

### 4. Icons (`templates/components/icons/`)

Icon system with SVG loader.

```
components/icons/
├── Icon.tsx
└── index.ts
```

### 5. Hooks (`templates/hooks/`)

Shared React hooks.

```
hooks/
├── useWindowManager.ts  # Generic window state (not RadOS-specific)
└── index.ts
```

### 6. Vault Documentation (`templates/.vault/`)

Documentation that applies to all RadTools projects.

```
.vault/
├── components/
│   ├── _moc.md                    # Component index
│   ├── radtools-reference.md       # Full API reference
│   └── primitives/
│       ├── Button.md
│       ├── Card.md
│       └── Tabs.md
├── architecture/
│   └── design-tokens.md           # Colors, typography, spacing
├── guides/
│   └── creating-components.md     # How to create components
├── _meta/
│   └── templates/
│       └── component.md           # Component doc template
└── index.md                       # Vault entry point
```

### 7. Claude Code Skills (`templates/.claude/skills/`)

AI development assistance.

```
.claude/skills/
└── radtools/
    └── SKILL.md                   # Component API quick reference
```

### 8. Claude Code Agents (`templates/.claude/agents/`)

AI agents for code quality and documentation.

```
.claude/agents/
├── radtools-reviewer.md           # Code quality reviewer
└── doc-writer.md                  # Documentation generator (generic)
```

---

## NOT Synced (Project-Specific)

These stay in individual projects:

| Item | Reason |
|------|--------|
| `components/apps/` | App implementations are project-specific |
| `components/Rad_os/` | Window system is RadOS-specific |
| `.vault/apps/` | App documentation is project-specific |
| `.vault/architecture/window-system.md` | RadOS-specific |
| `.vault/architecture/app-pattern.md` | RadOS-specific |
| `.vault/decisions/` | Project-specific ADRs |
| `.vault/reference/` | Project-specific references |
| `.claude/skills/rados/` | RadOS-specific skill |
| `.claude/skills/rados-app-scaffold/` | RadOS-specific skill |
| `.claude/agents/rados-builder.md` | RadOS-specific agent |
| `lib/mockData/` | Project-specific data |
| `store/` | Project-specific state |

---

## Sync Behavior

### `npx radtools init`

First-time setup:
1. Copy all templates to project
2. Update `layout.tsx` with DevToolsProvider
3. Install dependencies (zustand, react-draggable, sharp)
4. Create initial `globals.css` theme if not present

### `npx radtools update` (or `npx radtools sync`)

Update existing installation:
1. **Components**: Overwrite `components/ui/` entirely
2. **DevTools**: Overwrite `devtools/` entirely
3. **API Routes**: Overwrite `app/api/devtools/` entirely
4. **Icons**: Overwrite `components/icons/` entirely
5. **Hooks**: Merge (don't delete project hooks)
6. **Vault**: Merge (preserve project-specific docs)
7. **Skills**: Overwrite radtools skill only
8. **Agents**: Overwrite synced agents only

### Conflict Resolution

| Scenario | Behavior |
|----------|----------|
| User modified component | Overwrite with new version |
| User added custom component | Preserve (in different folder) |
| User modified agent | Overwrite with new version |
| User added custom agent | Preserve |
| User modified vault doc | Merge (preserve `%% USER %%` sections) |
| User added vault doc | Preserve |

### Version Tracking

Each sync writes version to `.radtools-version`:

```json
{
  "version": "0.1.4",
  "syncedAt": "2026-01-07T12:00:00Z",
  "components": "0.1.4",
  "devtools": "0.1.4",
  "agents": "0.1.4"
}
```

---

## CLI Commands

```bash
# Initialize RadTools in project
npx radtools init

# Update to latest
npx radtools update

# Update specific category
npx radtools update --components
npx radtools update --devtools
npx radtools update --agents
npx radtools update --vault

# Check for updates
npx radtools outdated

# Show what would be updated (dry run)
npx radtools update --dry-run
```

---

## Backport Checklist

Components/features to backport from RadOS to RadTools:

- [x] Toast system (`Toast.tsx`, `ToastProvider`, `useToast`)
- [x] CountdownTimer component
- [x] MockStatesPopover component
- [x] Web3ActionBar component
- [x] Button `href`/`asLink` props
- [x] Label component export from Input
- [ ] Any new components added to RadOS

---

## Release Process

1. Make changes in RadOS (the primary dev environment)
2. Run backport script to copy to RadTools
3. Test in RadTools demo app
4. Bump version in `package.json`
5. Publish to npm
6. Update Radiants projects: `npx radtools update`

---

*Last Updated: 2026-01-07*
