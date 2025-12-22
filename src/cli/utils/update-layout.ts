import * as fs from 'node:fs';
import * as path from 'node:path';

export async function updateLayout(cwd: string): Promise<boolean> {
  // Try both .tsx and .js extensions
  const possiblePaths = [
    path.join(cwd, 'app', 'layout.tsx'),
    path.join(cwd, 'app', 'layout.js'),
    path.join(cwd, 'app', 'layout.jsx'),
  ];

  let layoutPath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      layoutPath = p;
      break;
    }
  }

  if (!layoutPath) {
    throw new Error('Could not find app/layout.tsx or app/layout.js');
  }

  let content = fs.readFileSync(layoutPath, 'utf-8');

  // Check if DevToolsProvider is already imported
  if (content.includes('DevToolsProvider')) {
    return true; // Already installed
  }

  // Add import statement
  const devtoolsImport = "import { DevToolsProvider } from '@/devtools';";

  // Find where to insert the import (after the last import statement)
  const importRegex = /^import\s+.*?(?:from\s+['"][^'"]+['"])?;?\s*$/gm;
  let lastImportEnd = 0;
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    lastImportEnd = match.index + match[0].length;
  }

  if (lastImportEnd > 0) {
    content =
      content.slice(0, lastImportEnd) +
      '\n' +
      devtoolsImport +
      content.slice(lastImportEnd);
  } else {
    // No imports found, add at the beginning
    content = devtoolsImport + '\n' + content;
  }

  // Wrap {children} with DevToolsProvider
  // Look for patterns like: {children} or { children }
  const childrenPatterns = [
    /(\{children\})/g,
    /(\{\s*children\s*\})/g,
  ];

  let wrapped = false;
  for (const pattern of childrenPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '<DevToolsProvider>$1</DevToolsProvider>');
      wrapped = true;
      break;
    }
  }

  if (!wrapped) {
    // Try to find children prop usage and wrap it
    // This handles cases like: <body>{children}</body>
    const bodyPattern = /(<body[^>]*>)([\s\S]*?)(\{children\})([\s\S]*?)(<\/body>)/;
    if (bodyPattern.test(content)) {
      content = content.replace(
        bodyPattern,
        '$1$2<DevToolsProvider>$3</DevToolsProvider>$4$5'
      );
      wrapped = true;
    }
  }

  if (!wrapped) {
    throw new Error(
      'Could not find {children} to wrap with DevToolsProvider. Please add manually.'
    );
  }

  // Write the updated content
  fs.writeFileSync(layoutPath, content, 'utf-8');

  return true;
}
