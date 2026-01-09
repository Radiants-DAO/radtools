/**
 * Shared search indexes for devtools navigation and search
 */

export interface TypographySearchableItem {
  text: string;
  aliases: string[];
  sectionId: string;
  element: string;
}

/**
 * Typography search index with aliases for searching typography elements
 */
export const TYPOGRAPHY_SEARCH_INDEX: TypographySearchableItem[] = [
  // Headings
  { text: 'H1', aliases: ['Heading 1', 'h1', 'heading 1'], sectionId: 'headings', element: 'h1' },
  { text: 'H2', aliases: ['Heading 2', 'h2', 'heading 2'], sectionId: 'headings', element: 'h2' },
  { text: 'H3', aliases: ['Heading 3', 'h3', 'heading 3'], sectionId: 'headings', element: 'h3' },
  { text: 'H4', aliases: ['Heading 4', 'h4', 'heading 4'], sectionId: 'headings', element: 'h4' },
  { text: 'H5', aliases: ['Heading 5', 'h5', 'heading 5'], sectionId: 'headings', element: 'h5' },
  { text: 'H6', aliases: ['Heading 6', 'h6', 'heading 6'], sectionId: 'headings', element: 'h6' },
  // Text
  { text: 'Paragraph', aliases: ['P', 'p', 'paragraph', 'body'], sectionId: 'text', element: 'p' },
  { text: 'Link', aliases: ['A', 'a', 'anchor'], sectionId: 'text', element: 'a' },
  // Lists
  { text: 'Unordered List', aliases: ['UL', 'ul', 'unordered list'], sectionId: 'lists', element: 'ul' },
  { text: 'Ordered List', aliases: ['OL', 'ol', 'ordered list'], sectionId: 'lists', element: 'ol' },
  { text: 'List Item', aliases: ['LI', 'li', 'list item'], sectionId: 'lists', element: 'li' },
  // Code
  { text: 'Code', aliases: ['code', 'inline code'], sectionId: 'code', element: 'code' },
  { text: 'Pre', aliases: ['pre', 'preformatted', 'code block'], sectionId: 'code', element: 'pre' },
  { text: 'Keyboard', aliases: ['KBD', 'kbd', 'keyboard'], sectionId: 'code', element: 'kbd' },
  // Semantic
  { text: 'Strong', aliases: ['strong', 'bold'], sectionId: 'semantic', element: 'strong' },
  { text: 'Emphasis', aliases: ['EM', 'em', 'emphasis', 'italic'], sectionId: 'semantic', element: 'em' },
  { text: 'Mark', aliases: ['mark', 'highlight'], sectionId: 'semantic', element: 'mark' },
  // Quotations
  { text: 'Blockquote', aliases: ['blockquote', 'quote'], sectionId: 'quotations', element: 'blockquote' },
  { text: 'Cite', aliases: ['cite', 'citation'], sectionId: 'quotations', element: 'cite' },
  // Captions
  { text: 'Caption', aliases: ['caption', 'table caption'], sectionId: 'captions', element: 'caption' },
  { text: 'Small', aliases: ['small', 'fine print'], sectionId: 'captions', element: 'small' },
  { text: 'Label', aliases: ['label', 'form label'], sectionId: 'captions', element: 'label' },
];
