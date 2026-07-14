import type { CSSProperties } from 'react';
import type { Theme } from './types';

// Mappa i token del CMS su CSS variables applicate su <html>.
// I componenti/Tailwind leggono via var(--color-primary) ecc.
export function themeToCssVars(theme?: Theme | null): CSSProperties {
  const t = theme || {};
  return {
    '--color-primary': t.primary || '#2563eb',
    '--color-bg': t.background || '#ffffff',
    '--color-text': t.text || '#111827',
    '--font-body': t.fontBody || 'system-ui, sans-serif',
    '--font-heading': t.fontHeading || t.fontBody || 'system-ui, sans-serif',
    '--radius': `${t.radius ?? 8}px`,
  } as CSSProperties;
}
