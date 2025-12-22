import * as fs from 'node:fs';
import * as path from 'node:path';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export function detectPackageManager(cwd: string): PackageManager {
  // Check for lockfiles in order of preference
  if (fs.existsSync(path.join(cwd, 'bun.lockb'))) {
    return 'bun';
  }

  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }

  // Default to npm
  return 'npm';
}
