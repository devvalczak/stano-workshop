import pl from './pl.json';
import en from './en.json';
import { site, url, WEEK_DAYS, type DayCode } from '../site';

export const locales = { pl, en };
export type Lang = keyof typeof locales;
export type Dictionary = (typeof locales)[Lang];

export const defaultLang: Lang = 'pl';
export const languages = Object.keys(locales) as Lang[];

/** Path of every page per language. Adding a page: add an entry here and a view in src/views/ (see src/pages/[...slug].astro). */
export const routes = {
  home: { pl: '/', en: '/en/' },
} as const satisfies Record<string, Record<Lang, string>>;
export type PageId = keyof typeof routes;

/** Link to a page in a given language, BASE_PATH included. */
export const href = (page: PageId, lang: Lang, hash?: string) => url(routes[page][lang]) + (hash ? `#${hash}` : '');

/** Replaces {key} placeholders with values from `vars`; unknown keys are left untouched. */
export function fmt(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const DAY_ORDER = Object.keys(WEEK_DAYS) as DayCode[];

/** Consecutive runs of 3+ days collapse to a range ("Mon–Fri"); anything else is listed. */
function formatDays(days: DayCode[], names: Record<DayCode, string>): string {
  const idx = days.map((d) => DAY_ORDER.indexOf(d)).sort((a, b) => a - b);
  if (!idx.length) return '';
  const consecutive = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  const label = (i: number) => names[DAY_ORDER[i]];
  return consecutive && idx.length > 2 ? `${label(idx[0])}–${label(idx[idx.length - 1])}` : idx.map(label).join(', ');
}

/** Applies `fmt` to every string in a nested dictionary. */
function formatDeep<T>(value: T, vars: Record<string, string>): T {
  if (typeof value === 'string') return fmt(value, vars) as T;
  if (Array.isArray(value)) return value.map((v) => formatDeep(v, vars)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, formatDeep(v, vars)])) as T;
  }
  return value;
}

const cache = new Map<Lang, ReturnType<typeof createTranslations>>();

/**
 * Dictionary for `lang` with site placeholders ({name}, {phone}, …) already substituted.
 * `f` handles placeholders that need per-call values, e.g. f(t.home.reviews.rating, { rating }).
 */
export function useTranslations(lang: Lang) {
  if (!cache.has(lang)) cache.set(lang, createTranslations(lang));
  return cache.get(lang)!;
}

function createTranslations(lang: Lang) {
  const raw: Dictionary = locales[lang];
  const days = formatDays(site.hours.days, raw.days);

  const vars: Record<string, string> = {
    name: site.name,
    phone: site.phone,
    street: site.street,
    city: site.city,
    cityLocative: site.cityLocative,
    open: site.hours.open,
    close: site.hours.close,
    days,
    phoneLink: `<a class="font-semibold text-caliper hover:text-caliper-hot" href="${site.phoneHref}">${site.phone}</a>`,
  };
  vars.schedule = capitalize(fmt(days ? raw.schedule.withDays : raw.schedule.noDays, vars));
  const t = formatDeep(raw, vars);

  return {
    t,
    lang,
    /** Opening hours for display, e.g. "pon.–pt. 7:00–17:00". */
    hours: `${days ? `${days} ` : ''}${site.hours.open}–${site.hours.close}`,
    f: (text: string, extra: Record<string, string | number> = {}) => fmt(text, { ...vars, ...extra }),
    /** Link to a home page section in this language. */
    section: (key: keyof Dictionary['anchors']) => href('home', lang, t.anchors[key]),
  };
}
