'use client';

import { memo, useEffect, useState } from 'react';

interface IconProps {
  /** Icon name (filename without .svg extension) */
  name: string;
  /** Icon size in pixels (applies to both width and height) */
  size?: number;
  /** Additional CSS classes for styling (use text-* for color) */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

/**
 * Icon component using SVG files from /assets/icons.
 * 
 * Icons automatically use currentColor, inheriting the parent's text color.
 * 
 * @example
 * ```tsx
 * // Inherits parent text color
 * <div className="text-blue-500">
 *   <Icon name="copy" size={24} />
 * </div>
 * 
 * // Override color with className
 * <Icon name="checkmark" size={20} className="text-green-500" />
 * ```
 */

function IconComponent({ 
  name, 
  size = 24, 
  className = '',
  'aria-label': ariaLabel,
}: IconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const iconPath = `/assets/icons/${name}.svg`;

  useEffect(() => {
    fetch(iconPath)
      .then((res) => res.text())
      .then((text) => {
        // Inject width and height into SVG for proper scaling
        const svgWithSize = text.replace(
          /<svg([^>]*)>/,
          `<svg$1 width="${size}" height="${size}">`
        );
        setSvgContent(svgWithSize);
      })
      .catch((err) => {
        console.error(`Failed to load icon: ${name}`, err);
      });
  }, [name, iconPath, size]);

  if (!svgContent) {
    return (
      <span
        className={className}
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel}
        style={{
          width: size,
          height: size,
          display: 'inline-block',
        }}
      />
    );
  }

  return (
    <span
      className={className}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        verticalAlign: 'middle',
        lineHeight: 0,
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

// Memoize to prevent unnecessary re-renders
export const Icon = memo(IconComponent);

