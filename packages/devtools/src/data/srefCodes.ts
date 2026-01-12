import { SrefCode } from '../store/slices/aiSlice';

/**
 * Midjourney Style Reference (SREF) codes
 * These codes can be used with Midjourney to generate images in specific styles
 * Format: --sref [code]
 */
export const srefCodes: SrefCode[] = [
  {
    id: 'retro-tech',
    code: '1234567890',
    description: 'Retro tech aesthetic with warm tones and geometric shapes',
    previewImages: [
      '/assets/sref/1234567890-1.jpg',
      '/assets/sref/1234567890-2.jpg',
      '/assets/sref/1234567890-3.jpg',
      '/assets/sref/1234567890-4.jpg',
    ],
  },
  {
    id: 'brutalist-minimal',
    code: '2345678901',
    description: 'Brutalist design with minimal color palette and strong shapes',
    previewImages: [
      '/assets/sref/2345678901-1.jpg',
      '/assets/sref/2345678901-2.jpg',
      '/assets/sref/2345678901-3.jpg',
      '/assets/sref/2345678901-4.jpg',
    ],
  },
  {
    id: 'neo-vintage',
    code: '3456789012',
    description: 'Neo-vintage style combining retro elements with modern design',
    previewImages: [
      '/assets/sref/3456789012-1.jpg',
      '/assets/sref/3456789012-2.jpg',
      '/assets/sref/3456789012-3.jpg',
      '/assets/sref/3456789012-4.jpg',
    ],
  },
  {
    id: 'bold-graphic',
    code: '4567890123',
    description: 'Bold graphic design with high contrast and strong typography',
    previewImages: [
      '/assets/sref/4567890123-1.jpg',
      '/assets/sref/4567890123-2.jpg',
      '/assets/sref/4567890123-3.jpg',
      '/assets/sref/4567890123-4.jpg',
    ],
  },
  {
    id: 'soft-gradient',
    code: '5678901234',
    description: 'Soft gradients and pastel colors with organic shapes',
    previewImages: [
      '/assets/sref/5678901234-1.jpg',
      '/assets/sref/5678901234-2.jpg',
      '/assets/sref/5678901234-3.jpg',
      '/assets/sref/5678901234-4.jpg',
    ],
  },
  {
    id: 'industrial-modern',
    code: '6789012345',
    description: 'Industrial aesthetic with modern clean lines',
    previewImages: [
      '/assets/sref/6789012345-1.jpg',
      '/assets/sref/6789012345-2.jpg',
      '/assets/sref/6789012345-3.jpg',
      '/assets/sref/6789012345-4.jpg',
    ],
  },
  {
    id: 'playful-geometric',
    code: '7890123456',
    description: 'Playful geometric patterns with vibrant colors',
    previewImages: [
      '/assets/sref/7890123456-1.jpg',
      '/assets/sref/7890123456-2.jpg',
      '/assets/sref/7890123456-3.jpg',
      '/assets/sref/7890123456-4.jpg',
    ],
  },
  {
    id: 'monochrome-editorial',
    code: '8901234567',
    description: 'Monochrome editorial style with strong composition',
    previewImages: [
      '/assets/sref/8901234567-1.jpg',
      '/assets/sref/8901234567-2.jpg',
      '/assets/sref/8901234567-3.jpg',
      '/assets/sref/8901234567-4.jpg',
    ],
  },
];
