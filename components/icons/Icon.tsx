'use client';

import { useState, useEffect, memo } from 'react';

interface IconProps {
  /** Icon filename without .svg extension (e.g., "arrow-left") */
  name: string;
  /** Icon size in pixels (applies to both width and height) */
  size?: number;
  /** Additional CSS classes for styling (use text-* for color) */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

/**
 * Runtime SVG icon loader with automatic currentColor support.
 * 
 * Icons are loaded from /assets/icons/{name}.svg and automatically
 * processed to use currentColor for fills, inheriting the parent's
 * text color.
 * 
 * @example
 * ```tsx
 * // Inherits parent text color
 * <div className="text-blue-500">
 *   <Icon name="arrow-left" size={24} />
 * </div>
 * 
 * // Override color with className
 * <Icon name="check" size={20} className="text-green-500" />
 * ```
 */
function IconComponent({ 
  name, 
  size = 24, 
  className = '',
  'aria-label': ariaLabel,
}: IconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadIcon = async () => {
      try {
        const response = await fetch(`/assets/icons/${name}.svg`);
        
        if (!response.ok) {
          throw new Error(`Icon not found: ${name}`);
        }

        const svgText = await response.text();
        
        if (!mounted) return;

        // Process SVG to use currentColor for theming
        let processed = svgText;
        
        // Check if SVG uses CSS classes (like .st0 with fill: currentColor)
        const usesCssClasses = processed.includes('<style>') && processed.includes('currentColor');
        
        if (!usesCssClasses) {
          // Only process fill/stroke attributes if not using CSS classes
          // Remove existing fill attributes (except none)
          processed = processed.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
          // Remove existing stroke attributes (except none)  
          processed = processed.replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');
          
          // Add fill="currentColor" to root svg if no fill exists
          if (!processed.includes('fill=')) {
            processed = processed.replace(/<svg([^>]*)>/, `<svg$1 fill="currentColor">`);
          }
        }
        
        // Set dimensions (always do this, preserving viewBox)
        // Parse the SVG tag more carefully to avoid breaking structure
        const svgTagMatch = processed.match(/<svg([^>]*)>/);
        if (svgTagMatch) {
          let svgAttrs = svgTagMatch[1];
          
          // Extract and preserve viewBox (critical for CSS-based fills to work correctly)
          const viewBoxMatch = svgAttrs.match(/viewBox="[^"]*"/);
          const viewBox = viewBoxMatch ? viewBoxMatch[0] : null;
          
          // Remove existing width/height attributes
          svgAttrs = svgAttrs.replace(/\s*width="[^"]*"/g, '');
          svgAttrs = svgAttrs.replace(/\s*height="[^"]*"/g, '');
          
          // Clean up extra spaces
          svgAttrs = svgAttrs.trim().replace(/\s+/g, ' ');
          
          // Build new attributes: preserve viewBox first, then add width/height
          const newAttrs = [];
          if (viewBox) {
            newAttrs.push(viewBox);
          }
          newAttrs.push(`width="${size}"`, `height="${size}"`);
          
          // Add any remaining attributes
          const remainingAttrs = svgAttrs
            .replace(/viewBox="[^"]*"/g, '')
            .trim();
          if (remainingAttrs) {
            newAttrs.push(remainingAttrs);
          }
          
          // Reconstruct the SVG tag with proper spacing
          processed = processed.replace(/<svg[^>]*>/, `<svg ${newAttrs.join(' ')}>`);
        }

        setSvgContent(processed);
        setError(false);
      } catch (e) {
        if (mounted) {
          setError(true);
        }
      }
    };

    loadIcon();

    return () => {
      mounted = false;
    };
  }, [name, size]);

  // Mapping of icon names to PixelCode fallback characters
  const ICON_FALLBACKS: Record<string, string> = {
    'close': '×',           // Multiplication sign
    'check': '✓',           // Check mark
    'checkmark': '✓',
    'checkmark-filled': '✓',
    'arrow-left': '←',      // Left arrow
    'arrow-right': '→',     // Right arrow
    'chevron-down': '▼',    // Down triangle
    'plus': '+',
    'minus': '−',
    'search': '○',          // Circle
    'settings': '⚙',        // Gear symbol
    'home': '⌂',            // Home symbol
    'home-outline': '⌂',
    'folder-closed': '▷',   // Right-pointing triangle
    'folder-open': '▼',     // Down triangle
    'file-blank': '□',      // Empty square
    'file-image': '▣',      // Square with pattern
    'file-written': '▤',    // Square with lines
    'trash': '×',
    'trash-open': '×',
    'trash-full': '×',
    'power': '⚡',          // Lightning
    'power-thin': '⚡',
    'locked': '🔒',         // Lock
    'unlocked': '🔓',       // Unlock
    'save': '💾',           // Floppy disk
    'download': '↓',        // Down arrow
    'copy': '⧉',           // Copy symbol
    'refresh': '↻',         // Refresh arrow
    'refresh-block': '↻',
    'information': 'ℹ',     // Information
    'information-circle': 'ℹ',
    'warning': '⚠',         // Warning
    'warning-triangle-filled': '⚠',
    'warning-triangle-filled-2': '⚠',
    'warning-triangle-lines': '⚠',
    'waring-triangle-filled': '⚠',
    'question': '?',
    'question-block': '?',
    'expand': '▶',
    'hamburger': '☰',      // Hamburger menu
    'avatar': '○',
    'lightning': '⚡',
    'not-allowed': '⊘',
    'hourglass': '⏳',
    'wrench': '🔧',
  };

  if (error || !svgContent) {
    // Get fallback character, or use a default
    const fallbackChar = ICON_FALLBACKS[name] || '?';
    
    return (
      <span
        className={`font-['PixelCode'] ${className}`}
        style={{ 
          display: 'inline-flex', 
          width: size, 
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.8, // Slightly smaller than container for padding
          lineHeight: 1,
        }}
        role="img"
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel}
      >
        {fallbackChar}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ 
        display: 'inline-flex', 
        width: size, 
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="img"
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

// Memoize to prevent unnecessary re-renders and re-fetches
export const Icon = memo(IconComponent);

