import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const FONTS_DIR = join(process.cwd(), 'public', 'fonts');

export async function GET() {
  // Security: Block in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    // Check if fonts directory exists
    if (!existsSync(FONTS_DIR)) {
      return NextResponse.json({ fonts: [] });
    }

    // Read all files in fonts directory
    const files = await readdir(FONTS_DIR);
    
    // Filter to only font files
    const fontFiles = files.filter(file => {
      const ext = file.split('.').pop()?.toLowerCase();
      return ['woff2', 'woff', 'ttf', 'otf'].includes(ext || '');
    });

    // Group fonts by family name
    const fontMap = new Map<string, Array<{ filename: string; path: string; format: string }>>();
    
    for (const file of fontFiles) {
      // Extract font family name from filename
      // Examples: "Mondwest-Regular.woff2" -> "Mondwest"
      //           "Pixeloid-Sans-Bold.woff2" -> "Pixeloid Sans"
      //           "joystix_monospace.ttf" -> "Joystix Monospace"
      const nameWithoutExt = file.replace(/\.[^.]+$/, '');
      
      // Handle both dash and underscore separators
      const parts = nameWithoutExt.split(/[-_]/);
      
      // Handle special cases:
      // - "Pixeloid-Sans" or "Pixeloid-Mono" -> "Pixeloid Sans" / "Pixeloid Mono"
      // - "joystix_monospace" -> "Joystix Monospace"
      // - "Mondwest-Regular" -> "Mondwest"
      let familyName = parts[0];
      
      if (parts.length > 1) {
        const secondPart = parts[1];
        // Check if second part is a type (Sans, Mono, Monospace) or a weight/style
        if (secondPart === 'Sans' || secondPart === 'Mono') {
          familyName = `${parts[0]} ${secondPart}`;
        } else if (secondPart.toLowerCase() === 'monospace') {
          familyName = `${parts[0]} Monospace`;
        }
        // Otherwise, it's likely a weight/style (Regular, Bold, etc.), so just use the first part
      }
      
      // Capitalize first letter of each word
      familyName = familyName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      const ext = file.split('.').pop()?.toLowerCase() || '';
      const path = `/fonts/${file}`;
      
      if (!fontMap.has(familyName)) {
        fontMap.set(familyName, []);
      }
      
      fontMap.get(familyName)!.push({
        filename: file,
        path,
        format: ext,
      });
    }

    // Convert to array format
    const fonts = Array.from(fontMap.entries()).map(([family, files]) => ({
      family,
      files,
    }));

    return NextResponse.json({ fonts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list fonts', details: String(error) },
      { status: 500 }
    );
  }
}

