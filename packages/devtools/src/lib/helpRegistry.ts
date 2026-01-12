export interface HelpItem {
  id: string;
  title: string;
  description: string;
}

export const helpRegistry: Record<string, HelpItem> = {
  'tab-variables': {
    id: 'tab-variables',
    title: 'Variables Tab',
    description: 'Edit design tokens, colors, and shadows with live preview and CSS save.',
  },
  'tab-typography': {
    id: 'tab-typography',
    title: 'Typography Tab',
    description: 'Manage fonts and typography styles for HTML elements.',
  },
  'tab-components': {
    id: 'tab-components',
    title: 'Components Tab',
    description: 'Browse and inspect your UI components with live previews.',
  },
  'tab-assets': {
    id: 'tab-assets',
    title: 'Assets Tab',
    description: 'Browse icons, brand logos, and media files.',
  },
  'tab-ai': {
    id: 'tab-ai',
    title: 'AI Tab',
    description: 'Access RadFlow prompts, custom theme prompts, and Midjourney SREF codes.',
  },
  'tab-mockStates': {
    id: 'tab-mockStates',
    title: 'Mock States Tab',
    description: 'Simulate application states for testing components.',
  },
  'tool-component-id': {
    id: 'tool-component-id',
    title: 'Component ID Mode',
    description: 'Click any element to identify its React component and source file.',
  },
  'tool-text-edit': {
    id: 'tool-text-edit',
    title: 'Text Edit Mode',
    description: 'Click any text to edit inline. Press Enter to commit, Escape to copy all changes.',
  },
  'tool-help': {
    id: 'tool-help',
    title: 'Help Mode',
    description: 'View contextual help for the current tab or tool.',
  },
};
