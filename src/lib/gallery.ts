// Resolves entries from src/data/gallery.json to optimized images in src/assets/gallery/.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import entries from '../data/gallery.json';
import type { Lang } from '../i18n';

type Entry = { file: string; alt: Partial<Record<Lang, string>> };

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/gallery/*.{jpg,jpeg,png,webp}', { eager: true });

export async function loadGallery(lang: Lang) {
  return Promise.all(
    (entries as Entry[]).map(async ({ file, alt }) => {
      const mod = files[`../assets/gallery/${file}`];
      if (!mod) throw new Error(`Gallery image not found: src/assets/gallery/${file}`);
      const full = await getImage({ src: mod.default, width: 1600, format: 'webp' });
      return { src: mod.default, full: full.src, alt: alt[lang] ?? Object.values(alt)[0] ?? '' };
    }),
  );
}
