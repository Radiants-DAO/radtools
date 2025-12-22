# Icon System

Runtime SVG loader with automatic `currentColor` support for easy theming.

## How It Works

Icons are loaded at runtime from `public/assets/icons/` and automatically processed to inherit the parent's text color.

## Usage

### 1. Add Icons

Upload SVG files via the Assets panel to the `icons` folder, or manually add them to `public/assets/icons/`.

### 2. Use Icons

```tsx
import { Icon } from '@/components/icons';

function MyComponent() {
  return (
    <div className="text-blue-500">
      {/* Inherits parent text color (blue) */}
      <Icon name="arrow-left" size={24} />
      
      {/* Override color with className */}
      <Icon name="check" size={20} className="text-green-500" />
      
      {/* With accessibility label */}
      <Icon name="close" size={16} aria-label="Close dialog" />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | Icon filename without `.svg` extension |
| `size` | `number` | `24` | Icon size in pixels (width & height) |
| `className` | `string` | `''` | CSS classes for styling (use `text-*` for color) |
| `aria-label` | `string` | - | Accessible label for screen readers |

## Icon Naming

Use the filename without the `.svg` extension:
- `arrow-left.svg` → `<Icon name="arrow-left" />`
- `user-profile.svg` → `<Icon name="user-profile" />`
- `check.svg` → `<Icon name="check" />`

## Color Inheritance

Icons automatically use `currentColor`, inheriting the parent's text color:

```tsx
// Icon will be blue
<div className="text-blue-500">
  <Icon name="star" />
</div>

// Icon will be red
<span className="text-red-500">
  <Icon name="heart" />
</span>
```

## SVG Optimization Tips

For best results, optimize SVGs before uploading:

1. ✅ Use `fill="currentColor"` or no fill attribute
2. ✅ Remove hardcoded colors like `fill="#000000"`
3. ✅ Keep the `viewBox` attribute
4. ✅ Remove `width` and `height` attributes (the component handles sizing)

The loader automatically converts fills to `currentColor`, but pre-optimized SVGs load faster.

## Benefits

- **Zero build config** — Works with Turbopack out of the box
- **Instant updates** — Add icons and use them immediately
- **Automatic theming** — Icons inherit text color
- **Memoized** — Prevents unnecessary re-renders
- **Accessible** — Supports aria-label for screen readers
