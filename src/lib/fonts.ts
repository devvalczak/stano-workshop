// Self-hosted Saira (variable weight + width axes). Files come from @fontsource-variable/saira and are
// emitted by Vite as hashed assets, so no request leaves the site's origin.
import latinNormal from '@fontsource-variable/saira/files/saira-latin-wdth-normal.woff2?url';
import latinItalic from '@fontsource-variable/saira/files/saira-latin-wdth-italic.woff2?url';
import latinExtNormal from '@fontsource-variable/saira/files/saira-latin-ext-wdth-normal.woff2?url';
import latinExtItalic from '@fontsource-variable/saira/files/saira-latin-ext-wdth-italic.woff2?url';

const UNICODE_RANGES = {
  latin:
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  latinExt:
    'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
};

type FontFace = {
  src: string;
  style: 'normal' | 'italic';
  range: keyof typeof UNICODE_RANGES;
  /**
   * Italic is the condensed display style: much narrower than any fallback, so swapping would reflow
   * headings (CLS). `block` waits for the preloaded file instead; body text keeps `swap`.
   */
  display: 'swap' | 'block';
  /** Preloaded faces are needed for the first paint (the hero heading). */
  preload?: boolean;
};

const faces: FontFace[] = [
  { src: latinItalic, style: 'italic', range: 'latin', display: 'block', preload: true },
  { src: latinExtItalic, style: 'italic', range: 'latinExt', display: 'block' },
  { src: latinNormal, style: 'normal', range: 'latin', display: 'swap' },
  { src: latinExtNormal, style: 'normal', range: 'latinExt', display: 'swap' },
];

export const fontFaceCss = faces
  .map(
    (f) =>
      `@font-face{font-family:Saira;font-style:${f.style};font-weight:100 900;font-stretch:50% 125%;` +
      `font-display:${f.display};src:url(${f.src}) format('woff2');unicode-range:${UNICODE_RANGES[f.range]}}`,
  )
  .join('');

export const fontPreloads = faces.filter((f) => f.preload).map((f) => f.src);
