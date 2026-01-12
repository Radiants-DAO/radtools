import { NextResponse } from 'next/server';
import { switchThemeImport, isValidThemePackageName } from '@radflow/devtools/lib/themeUtils';

/**
 * POST /api/devtools/themes/switch
 *
 * Switches the active theme by rewriting the CSS import in globals.css.
 * This endpoint performs the file system operations needed to change themes.
 */
export async function POST(req: Request) {
  // Security: Block in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { themePackageName } = body;

    // Validate input
    if (!themePackageName || typeof themePackageName !== 'string') {
      return NextResponse.json(
        { error: 'Theme package name is required' },
        { status: 400 }
      );
    }

    // Validate package name format
    if (!isValidThemePackageName(themePackageName)) {
      return NextResponse.json(
        {
          error: 'Invalid theme package name',
          message: 'Package name must follow pattern: @radflow/theme-<name> or theme-<name>',
        },
        { status: 400 }
      );
    }

    // Perform the theme switch
    const result = await switchThemeImport(themePackageName);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Failed to switch theme',
          message: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      previousTheme: result.previousTheme,
      newTheme: themePackageName,
      message: `Theme switched to ${themePackageName}`,
    });
  } catch (error) {
    console.error('Theme switch error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
