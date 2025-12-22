import { NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const COMPONENTS_DIR = join(process.cwd(), 'components');

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const { folderName } = await request.json();

    if (!folderName || typeof folderName !== 'string') {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    // Validate folder name (alphanumeric, underscore, hyphen only)
    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      return NextResponse.json(
        { error: 'Folder name must contain only letters, numbers, underscores, or hyphens' },
        { status: 400 }
      );
    }

    const folderPath = join(COMPONENTS_DIR, folderName);

    try {
      await mkdir(folderPath, { recursive: false });
      return NextResponse.json({ success: true, folderPath });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'EEXIST') {
        return NextResponse.json(
          { error: 'Folder already exists' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create folder', details: String(error) },
      { status: 500 }
    );
  }
}

