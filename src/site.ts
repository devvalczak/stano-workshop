// Site-wide settings read from .env at build time.

const env = import.meta.env;

function required(key: string): string {
  const value = String(env[key] ?? '').trim();
  if (!value) throw new Error(`Missing required variable ${key} in .env`);
  return value;
}

const optional = (key: string): string => String(env[key] ?? '').trim();

/** "07:00" → "7:00" */
const displayTime = (hhmm: string) => hhmm.replace(/^0(\d)/, '$1');

/** Day codes accepted in OPENING_DAYS, in week order, mapped to schema.org day names. */
export const WEEK_DAYS = {
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
  Su: 'Sunday',
} as const;
export type DayCode = keyof typeof WEEK_DAYS;

const phone = required('PHONE');
const phoneE164 = `${required('PHONE_COUNTRY_CODE')}${phone.replace(/\D/g, '')}`;
const lat = optional('GEO_LAT');
const lng = optional('GEO_LNG');

export const site = {
  url: required('SITE_URL').replace(/\/+$/, ''),
  name: required('BUSINESS_NAME'),
  phone,
  phoneE164,
  phoneHref: `tel:${phoneE164}`,
  street: required('ADDRESS_STREET'),
  postalCode: required('ADDRESS_POSTAL_CODE'),
  city: required('ADDRESS_CITY'),
  /** Grammatical locative of the city for languages that inflect it ("w {cityLocative}"); falls back to the city. */
  cityLocative: optional('ADDRESS_CITY_LOCATIVE') || required('ADDRESS_CITY'),
  country: required('ADDRESS_COUNTRY'),
  hours: {
    opens: required('HOURS_OPEN'),
    closes: required('HOURS_CLOSE'),
    open: displayTime(required('HOURS_OPEN')),
    close: displayTime(required('HOURS_CLOSE')),
    days: optional('OPENING_DAYS')
      .split(',')
      .map((d) => d.trim())
      .filter((d): d is DayCode => d in WEEK_DAYS),
  },
  geo: lat && lng ? { latitude: Number(lat), longitude: Number(lng) } : null,
  sameAs: [optional('GOOGLE_PROFILE_URL'), optional('FACEBOOK_URL')].filter(Boolean),
};

const addressQuery = encodeURIComponent(`${site.street}, ${site.postalCode} ${site.city}`);

export const maps = {
  embed: (lang: string) => `https://www.google.com/maps?q=${addressQuery}&hl=${lang}&output=embed`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`,
};

const base = String(import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/** Root-relative path including BASE_PATH: url('/cennik/') → '/stano-workshop/cennik/'. */
export const url = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;

/** Absolute URL for canonical, hreflang, sitemap and Open Graph. */
export const absolute = (path: string) => `${site.url}${url(path)}`;
