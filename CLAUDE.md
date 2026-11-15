# StanoWorkshop — strona warsztatu samochodowego

Statyczna strona wizytówka (PL + EN) warsztatu StanoWorkshop w Gidlach. Astro 5 + Tailwind 4,
build do `build/`, deploy na GitHub Pages przez GitHub Actions. Na serwerze nie działa żaden Node.

## Git — NIGDY nie commitować

**Nigdy nie wykonuj `git commit`, `git push`, `git tag`, `git rebase`, `git merge` ani innych
operacji zapisujących historię lub wysyłających zmiany — nawet jeśli zadanie wydaje się tego
wymagać.** Commity i push robi wyłącznie właściciel. Wolno: `git status`, `git diff`, `git log`,
`git add` tylko na wyraźną prośbę.

## Komendy

```bash
npm run dev           # podgląd na żywo: http://localhost:4321/stano-workshop/
npm run build         # build do build/
npm run preview       # serwuje build/ lokalnie
npm run lint          # ESLint + spójność tłumaczeń (scripts/check-i18n.mjs)
npm run lint:fix      # ESLint z automatycznymi poprawkami
npm run format        # Prettier (zapis)
npm run format:check  # Prettier (tylko sprawdzenie)
npm run typecheck     # astro check
npm run verify        # lint + format:check + typecheck — to samo co etap Lint w CI
```

Node w wersji z `.nvmrc` (20). Po zmianie `.env` zrestartuj `npm run dev`.
**Po każdej zmianie kodu uruchom `npm run verify` i `npm run build`** — oba muszą przejść.

## Gdzie co jest

| Co zmienić                                             | Gdzie                                                                                                                                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Telefon, adres, godziny, dni otwarcia, domena, profile | `.env` (poza repo; wzór: `.env.example`; w CI z sekretu `ENV_FILE`)                                                                                                                                                      |
| Teksty strony                                          | `src/i18n/pl.json`, `src/i18n/en.json` — identyczna struktura kluczy (pilnuje `lint`)                                                                                                                                    |
| Lista usług (kolejność)                                | `src/data/services.json` (teksty: `services.<id>` w locale)                                                                                                                                                              |
| Atuty (ikony + kolejność)                              | `src/data/perks.json` (id = nazwa ikony z `icons.ts`; teksty: `home.perks.items.<id>`)                                                                                                                                   |
| Zdjęcia galerii                                        | pliki w `src/assets/gallery/` + wpis `{ "file", "alt": { "pl", "en" } }` w `gallery.json`                                                                                                                                |
| Opinie klientów                                        | `src/data/reviews.json`: `{ "author", "rating", "text", "lang" }` (bez tłumaczenia)                                                                                                                                      |
| Kolory, typografia, przyciski                          | `src/styles/global.css` (tokeny, `@theme`, `@utility`)                                                                                                                                                                   |
| Profile społecznościowe                                | `FACEBOOK_URL`, `GOOGLE_MAPS_URL` w `.env` (ikony w kontakcie i stopce, `sameAs` w JSON-LD); nowy serwis: zmienna w `.env` + wpis w `site.social` (`src/site.ts`) + ikona w `icons.ts` + etykieta `social.<id>` w locale |
| Ikony                                                  | `src/components/icons.ts` (rejestr SVG) → `<Icon name="…" />`                                                                                                                                                            |
| Zachowanie w przeglądarce                              | `src/scripts/main.js`                                                                                                                                                                                                    |
| Adresy podstron w obu językach                         | `routes` w `src/i18n/index.ts`                                                                                                                                                                                           |
| Favicon, og-image                                      | `public/`                                                                                                                                                                                                                |

## Architektura

- `src/pages/[...slug].astro` generuje wszystkie strony we wszystkich językach z `routes`
  (`src/i18n/index.ts`) i mapy `views` → widoki w `src/views/` dostają tylko `lang`.
- `src/layouts/Base.astro` — head, SEO, canonical/hreflang, JSON-LD, header/footer/callbar.
- Komponenty wielokrotnego użytku: `Section` (sekcja + kolumna), `Band` (skośna belka), `Icon`,
  `Faq`, `SocialLinks`, `CookieBanner`, `Wordmark`, `Header`, `Footer`, `Callbar`.
- `src/site.ts` — dane z `.env` + `url()` / `absolute()`; `src/lib/` — JSON-LD, galeria.
- Struktura (id, kolejność, liczby, ikony) w `src/data/*.json`; teksty w locale pod tymi samymi id.

## Zasady kodu

- **Kod i komentarze wyłącznie po angielsku.** Teksty dla użytkownika — w plikach locale.
- **Komentarze tylko wyjaśniają kod** (dlaczego tak, co robi nieoczywisty fragment). Bez kontekstu
  biznesowego, notatek o klientach, TODO dla właściciela ani historii zmian.
- **Bez duplikacji.** Powtarzający się markup → komponent; powtarzające się zestawy klas → `@utility`
  w `global.css`; powtarzające się dane → `src/data/` lub `.env`.
- **Kod generyczny i rozszerzalny**: nowe pozycje (usługi, ceny, atuty, FAQ, zdjęcia, opinie, języki,
  podstrony) dodaje się przez dane/locale, bez zmian w szablonach.
- **Żadnych tekstów ani danych firmy na sztywno w szablonach** (ESLint to wymusza). Dane firmy tylko
  z `site`; w tekstach przez placeholdery `{name}`, `{phone}`, `{street}`, `{city}`, `{phoneLink}`,
  `{schedule}`, `{days}`, `{open}`, `{close}`, `{cityLocative}` (miejscownik z `ADDRESS_CITY_LOCATIVE`).
- **Linki zawsze przez helpery**: `href(pageId, lang, hash?)` / `section(key)` z `src/i18n`, `url(path)`
  dla plików z `public/`, `absolute(path)` dla pełnych URL-i. Nigdy `href="/…"` na sztywno (ESLint) —
  strona działa pod `BASE_PATH`.
- Tłumaczenia tylko przez `useTranslations()` / `locales` z `src/i18n` — bez importu `*.json` locale
  (ESLint).
- Bez inline `style` (ESLint) — klasy Tailwind lub `global.css`.
- Obrazki z `src/assets/` przez `<Picture>` z `astro:assets`.
- Szanować `prefers-reduced-motion`; dostępność pilnowana przez `jsx-a11y-strict`.

## Dane klienta i `.env`

- `.env` zawiera dane klienta i **nie trafia do repo** (`.gitignore`). W repo jest tylko `.env.example`
  z przykładowymi wartościami — każda nowa zmienna musi trafić do obu plików.
- **Żadnych danych klienta w kodzie, locale, komentarzach ani przykładach** (nazwa, telefon, adres,
  miasto) — wyłącznie przez `site` / placeholdery z `.env`.
- CI odtwarza `.env` z sekretu repo `ENV_FILE` (cała zawartość pliku). Po zmianie lokalnego `.env`
  właściciel aktualizuje sekret: `gh secret set ENV_FILE < .env` (nie rób tego sam).
- Etap Lint w CI używa `.env.example`, więc nie potrzebuje sekretów.

## Zgoda na cookies (osadzenia zewnętrzne)

- Baner: `src/components/CookieBanner.astro`, logika: sekcja „Consent” w `src/scripts/main.js`
  (decyzja w `localStorage` pod `consent.embeds`: `granted` / `denied`).
- Każde osadzenie zewnętrzne (mapa itp.) oznaczaj `data-consent-embed` + `data-src` + `data-title`;
  pierwszy element dziecka to placeholder pokazywany bez zgody. Przyciski z `data-consent="granted|denied"`
  zapisują decyzję, `data-consent-open` ponownie otwiera baner (link w stopce).
- Nic nie może łączyć się z zewnętrznymi serwisami ustawiającymi cookies przed zgodą.
- Mapa: `MAPS_QUERY` (pinezka wizytówki) i `GOOGLE_MAPS_URL` (link do wizytówki) w `.env`.

## Treści

- **Nie zmyślać treści biznesowych** (cen, opinii, warunków gwarancji, form płatności). Brak danych =
  `null` w danych/locale; na stronie wyświetla się placeholder („…”, „[Do uzupełnienia]”).
- Teksty polskie z poprawnymi znakami diakrytycznymi.

## Nowa podstrona

1. Wpis w `routes` (`src/i18n/index.ts`) z adresem dla każdego języka.
2. Widok w `src/views/` (props: `lang`) + wpis w `views` w `src/pages/[...slug].astro`.
3. Teksty w każdym pliku locale. Sitemap, hreflang i przełącznik języka działają automatycznie.

## Nowy język

Plik `src/i18n/<lang>.json` (struktura jak `pl.json`), import w `locales` (`src/i18n/index.ts`),
adres w każdym wpisie `routes`. `npm run lint` wskaże brakujące klucze.

## Deploy (GitHub Pages)

- CI: `.github/workflows/deploy.yml` — etapy **Lint → Build → Deploy**. PR: lint + build; push na
  `main`: dodatkowo deploy.
- Jednorazowo: repo → Settings → Pages → Source: **GitHub Actions** oraz sekret `ENV_FILE`
  (`gh secret set ENV_FILE < .env`).
- Własna domena: w `.env` `SITE_URL=https://domena.pl`, `BASE_PATH=/`; domena w Settings → Pages →
  Custom domain + DNS.
- Bez własnej domeny `robots.txt` leży pod `/stano-workshop/robots.txt` i wyszukiwarki go nie czytają —
  sitemap zgłosić w Google Search Console.

## Pliki graficzne marki

Logo: `src/assets/logo.jpg` (optymalizowane przez `<Picture>`). Obrazek do udostępniania linków:
`public/og-image.jpg`. Favicony: `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`.
