// Verifies that every locale has the same keys as the default locale and that every id
// referenced by src/data/*.json has a translation. Exits with code 1 on any problem.
import { readFileSync, readdirSync } from 'node:fs';

const LOCALES_DIR = new URL('../src/i18n/', import.meta.url);
const DATA_DIR = new URL('../src/data/', import.meta.url);
const DEFAULT_LOCALE = 'pl';

const readJson = (dir, file) => JSON.parse(readFileSync(new URL(file, dir), 'utf8'));
const locales = Object.fromEntries(
  readdirSync(LOCALES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => [f.replace('.json', ''), readJson(LOCALES_DIR, f)]),
);

const errors = [];
const typeOf = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);

/** Compares structure recursively; null and string are interchangeable (null = untranslated placeholder). */
function compare(reference, other, path, lang) {
  const [a, b] = [typeOf(reference), typeOf(other)];
  const scalar = (t) => t === 'string' || t === 'null';
  if (a !== b && !(scalar(a) && scalar(b))) {
    errors.push(`${lang}: ${path || '(root)'} is ${b}, expected ${a}`);
    return;
  }
  if (a === 'array') {
    if (reference.length !== other.length)
      errors.push(`${lang}: ${path} has ${other.length} items, expected ${reference.length}`);
    reference.forEach((item, i) => i < other.length && compare(item, other[i], `${path}[${i}]`, lang));
  } else if (a === 'object') {
    for (const key of Object.keys(reference)) {
      if (!(key in other)) errors.push(`${lang}: missing key ${path}${path ? '.' : ''}${key}`);
      else compare(reference[key], other[key], `${path}${path ? '.' : ''}${key}`, lang);
    }
    for (const key of Object.keys(other)) {
      if (!(key in reference)) errors.push(`${lang}: unexpected key ${path}${path ? '.' : ''}${key}`);
    }
  }
}

const reference = locales[DEFAULT_LOCALE];
for (const [lang, dict] of Object.entries(locales)) {
  if (lang !== DEFAULT_LOCALE) compare(reference, dict, '', lang);
}

const services = readJson(DATA_DIR, 'services.json');
const perks = readJson(DATA_DIR, 'perks.json');
for (const [lang, dict] of Object.entries(locales)) {
  for (const id of services) {
    if (!dict.services?.[id]) errors.push(`${lang}: services.${id} missing (src/data/services.json)`);
  }
  for (const id of perks) {
    if (!dict.home?.perks?.items?.[id]) errors.push(`${lang}: home.perks.items.${id} missing (src/data/perks.json)`);
  }
}

if (errors.length) {
  console.error(`i18n check failed (${errors.length}):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`i18n check passed: ${Object.keys(locales).join(', ')}`);
