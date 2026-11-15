// Inline SVG icon registry used by Icon.astro.
// `stroke` set → outline icon with that stroke width; otherwise a filled icon.

export type IconDef = { viewBox: string; body: string; stroke?: number };

export const icons = {
  phone: {
    viewBox: '0 0 24 24',
    body: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/>',
  },
  chevron: { viewBox: '0 0 24 24', body: '<path d="M7 3h6l6 9-6 9H7l6-9z"/>' },
  pin: {
    viewBox: '0 0 24 24',
    body: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>',
  },
  sun: {
    viewBox: '0 0 24 24',
    stroke: 2,
    body: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  },
  moon: { viewBox: '0 0 24 24', stroke: 2, body: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>' },
  menu: { viewBox: '0 0 24 24', stroke: 2, body: '<path d="M4 7h16M4 12h16M4 17h16"/>' },
  close: { viewBox: '0 0 24 24', stroke: 2, body: '<path d="M6 6l12 12M18 6L6 18"/>' },
  plus: { viewBox: '0 0 24 24', stroke: 2.5, body: '<path d="M12 5v14M5 12h14"/>' },
  gear: {
    viewBox: '0 0 100 100',
    stroke: 1.2,
    body: '<path d="M50 12h4l1.5 7.5a31 31 0 0 1 7.8 3.2l6.4-4.3 5.7 5.7-4.3 6.4a31 31 0 0 1 3.2 7.8L82 46v8l-7.5 1.5a31 31 0 0 1-3.2 7.8l4.3 6.4-5.7 5.7-6.4-4.3a31 31 0 0 1-7.8 3.2L54 88h-8l-1.5-7.5a31 31 0 0 1-7.8-3.2l-6.4 4.3-5.7-5.7 4.3-6.4a31 31 0 0 1-3.2-7.8L18 54v-8l7.5-1.5a31 31 0 0 1 3.2-7.8l-4.3-6.4 5.7-5.7 6.4 4.3a31 31 0 0 1 7.8-3.2L46 12z"/><circle cx="50" cy="50" r="14"/>',
  },
  quality: {
    viewBox: '0 0 48 48',
    stroke: 2.5,
    body: '<circle cx="24" cy="24" r="7"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/>',
  },
  fast: {
    viewBox: '0 0 48 48',
    stroke: 2.5,
    body: '<circle cx="26" cy="27" r="15"/><path d="M26 27l6-7M22 6h8M26 6v6M4 22h7M2 28h7M4 34h7"/>',
  },
  individual: {
    viewBox: '0 0 48 48',
    stroke: 2.5,
    body: '<path d="M5 30v-6l5-9h28l5 9v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM5 24h38M9 32v4M39 32v4"/><circle cx="13" cy="27" r="1.5" fill="currentColor"/><circle cx="35" cy="27" r="1.5" fill="currentColor"/>',
  },
  guarantee: {
    viewBox: '0 0 48 48',
    stroke: 2.5,
    body: '<path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z"/><path class="text-caliper" d="M16 24l6 6 10-12"/>',
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof icons;
