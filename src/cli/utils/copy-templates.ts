import * as fs from 'node:fs';
import * as path from 'node:path';

function copyDir(src: string, dest: string) {
  // Create destination directory
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export async function copyTemplates(
  templatesDir: string,
  targetDir: string
): Promise<void> {
  // Verify templates directory exists
  if (!fs.existsSync(templatesDir)) {
    throw new Error(`Templates directory not found: ${templatesDir}`);
  }

  // Copy devtools
  const devtoolsSrc = path.join(templatesDir, 'devtools');
  const devtoolsDest = path.join(targetDir, 'devtools');
  if (fs.existsSync(devtoolsSrc)) {
    copyDir(devtoolsSrc, devtoolsDest);
  }

  // Copy components/ui
  const componentsSrc = path.join(templatesDir, 'components');
  const componentsDest = path.join(targetDir, 'components');
  if (fs.existsSync(componentsSrc)) {
    // Create components directory if it doesn't exist
    fs.mkdirSync(componentsDest, { recursive: true });

    // Copy ui folder
    const uiSrc = path.join(componentsSrc, 'ui');
    const uiDest = path.join(componentsDest, 'ui');
    if (fs.existsSync(uiSrc)) {
      copyDir(uiSrc, uiDest);
    }

    // Copy Rad_os folder
    const radOsSrc = path.join(componentsSrc, 'Rad_os');
    const radOsDest = path.join(componentsDest, 'Rad_os');
    if (fs.existsSync(radOsSrc)) {
      copyDir(radOsSrc, radOsDest);
    }

    // Copy icons folder
    const iconsSrc = path.join(componentsSrc, 'icons');
    const iconsDest = path.join(componentsDest, 'icons');
    if (fs.existsSync(iconsSrc)) {
      copyDir(iconsSrc, iconsDest);
    }

    // Copy icons.tsx if it exists at root
    const iconsFileSrc = path.join(componentsSrc, 'icons.tsx');
    const iconsFileDest = path.join(componentsDest, 'icons.tsx');
    if (fs.existsSync(iconsFileSrc)) {
      fs.copyFileSync(iconsFileSrc, iconsFileDest);
    }
  }

  // Copy hooks
  const hooksSrc = path.join(templatesDir, 'hooks');
  const hooksDest = path.join(targetDir, 'hooks');
  if (fs.existsSync(hooksSrc)) {
    copyDir(hooksSrc, hooksDest);
  }

  // Copy API routes
  const apiRoutesSrc = path.join(templatesDir, 'api-routes');
  const apiRoutesDest = path.join(targetDir, 'app', 'api', 'devtools');
  if (fs.existsSync(apiRoutesSrc)) {
    // Create app/api directory if needed
    fs.mkdirSync(path.join(targetDir, 'app', 'api'), { recursive: true });
    copyDir(apiRoutesSrc, apiRoutesDest);
  }

  // Copy public/assets/icons
  const iconsSrc = path.join(templatesDir, 'public', 'assets', 'icons');
  const iconsDest = path.join(targetDir, 'public', 'assets', 'icons');
  if (fs.existsSync(iconsSrc)) {
    copyDir(iconsSrc, iconsDest);
  }

  // Replace globals.css with RadTools theme
  const globalsCssSrc = path.join(templatesDir, 'globals.css');
  const globalsCssDest = path.join(targetDir, 'app', 'globals.css');
  if (fs.existsSync(globalsCssSrc)) {
    fs.copyFileSync(globalsCssSrc, globalsCssDest);
  }
}
