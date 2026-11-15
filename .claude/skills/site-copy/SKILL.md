---
name: site-copy
description: Pisanie i poprawianie tekstów na stronie warsztatu (PL + EN) — nagłówki, opisy usług, sekcja „O nas”, FAQ, CTA, baner cookies, alt-y obrazków, meta title/description, teksty pod lokalne SEO. Używaj ZAWSZE, gdy zadanie dotyka czegokolwiek, co czyta odwiedzający stronę albo Google — także przy „popraw tekst”, „dodaj pytanie do FAQ”, „przetłumacz na angielski”, „lepsze SEO”, „zmień opis usługi”, edycji src/i18n/*.json lub dodawaniu nowej sekcji z tekstem — nawet jeśli użytkownik nie mówi wprost o „copywritingu”.
---

# Teksty strony (PL + EN)

Strona to wizytówka lokalnego warsztatu samochodowego. Odwiedzający to kierowca z okolicy z konkretnym
problemem („stuka w zawieszeniu”, „kontrolka silnika”), często na telefonie. Tekst ma mu szybko
odpowiedzieć: czy tu to naprawią, gdzie to jest, kiedy otwarte, jak zadzwonić. Google ma z tego samego
tekstu zrozumieć: jaki to warsztat, w jakiej miejscowości, jakie usługi.

## Gdzie są teksty

- `src/i18n/pl.json` i `src/i18n/en.json` — wszystkie teksty, ta sama struktura kluczy w obu plikach.
- `src/data/*.json` — tylko struktura (id, kolejność). Teksty do tych id są w locale (`services.<id>`,
  `home.perks.items.<id>`).
- `.env` — dane firmy (nazwa, telefon, adres, godziny). W tekstach wstawiaj je placeholderami, nigdy
  wprost: `{name}`, `{phone}`, `{phoneLink}`, `{street}`, `{city}`, `{cityLocative}` („w {cityLocative}”
  → „w Gidlach”), `{open}`, `{close}`, `{days}`, `{schedule}`. Dzięki temu zmiana numeru czy adresu
  w `.env` nie wymaga szukania po tekstach, a dane klienta nie trafiają do repozytorium.
- Szablony (`src/views`, `src/components`) nie zawierają tekstów — ESLint to blokuje.

## Zasady, których nie łamiemy

1. **Nie wymyślaj faktów.** Cen, lat doświadczenia, liczby napraw, marek, warunków gwarancji, form płatności,
   certyfikatów, „najlepszy w regionie”. Klient czyta to jako obietnicę warsztatu. Czego nie wiesz — zostaw
   `null` (FAQ wyświetli „[Do uzupełnienia]”) i wypisz w odpowiedzi, o co trzeba dopytać właściciela.
2. **PL i EN zawsze razem.** Każda zmiana klucza w jednym pliku — ta sama w drugim. `npm run lint`
   (sprawdzenie i18n) wyłapie rozjazd struktury, ale nie treści: sprawdź sam, że EN mówi to samo.
3. **Polskie znaki** zawsze poprawne (ą, ę, ł, ó, ś, ź, ż, ć, ń). Typograficzne półpauzy (–) w zakresach
   („7:00–17:00”) i w tytułach („StanoWorkshop – warsztat…”), polskie cudzysłowy „…”.
4. **HTML w tekstach tylko tam, gdzie już jest** (np. `<br>` w nagłówku hero, `{phoneLink}` w FAQ).

## Głos marki

- **Konkretnie i po ludzku**, jak mechanik, który tłumaczy klientowi przy aucie. Krótkie zdania,
  czasowniki zamiast rzeczowników („wymieniamy rozrząd”, nie „realizujemy usługi w zakresie rozrządów”).
- **Bez marketingowych frazesów**: „kompleksowo”, „najwyższa jakość”, „profesjonalizm na każdym etapie”,
  „szeroki zakres usług”, „wychodzimy naprzeciw”. Zamiast przymiotnika — fakt lub konkret.
- **Słowa klienta, nie katalogu części**: „koło dwumasowe”, „rozrząd”, „kontrolka check engine”,
  „stuki w zawieszeniu” — tak ludzie szukają w Google.
- **Do klienta na „ty”**, formą małą literą w treści („Twój samochód” tylko w nagłówku hero, który
  powtarza hasło z banera marki).
- **Firma mówi „my”** („naprawiamy”, „mówimy, ile to kosztuje”). Wyjątek: hasło z banera
  „Zapraszam do kontaktu!” — to cytat z identyfikacji wizualnej, zostaje jak jest.

> Dwie ostatnie decyzje (wielkość liter „Twój” i forma „my”/„ja”) to ustawienia domyślne do
> potwierdzenia przez właściciela. Jeśli zdecyduje inaczej — zaktualizuj ten akapit.

### Angielski (en.json)

Brytyjski angielski (strona deklaruje `en_GB`; cspell sprawdza `en.json` słownikiem en-GB): „tyre”,
„labour”, „colour”. Tłumacz sens, nie słowa — odbiorca to obcokrajowiec w okolicy, więc tam, gdzie
pomaga, dodaj kontekst („Gidle, Poland” w opisie meta). Nazw miejscowości i ulic nie tłumacz.

## Lokalne SEO

- Fraza główna to usługa + miejscowość: „warsztat samochodowy {cityLocative}”, „mechanik {city}”.
  Ma się pojawić naturalnie w: meta title, meta description, h1/kicker hero, pierwszym akapicie
  „O nas”. Nie wciskaj jej w każde zdanie — Google karze upychanie słów, a klient przestaje czytać.
- **Meta title** ≤ 60 znaków, **meta description** 120–160 znaków (po podstawieniu placeholderów),
  z wezwaniem do działania lub telefonem.
- Okoliczne miejscowości pomagają, ale tylko te, z których naprawdę przyjeżdżają klienci — **listę
  bierz od właściciela, nie zgaduj z mapy**.
- Opisy usług i odpowiedzi FAQ odpowiadają na realne pytania („ile trwa wymiana sprzęgła?”) — to też
  treść, którą Google pokazuje w wynikach.
- `alt` obrazka opisuje, co na nim jest („Wymiana rozrządu w VW Passat B6”), nie „zdjęcie warsztatu”.

## Długości (żeby układ się nie sypał)

| Element        | Orientacyjnie                                                                         |
| -------------- | ------------------------------------------------------------------------------------- |
| Kicker hero    | do ~35 znaków                                                                         |
| Nagłówek hero  | 2 linie na telefonie (~35 znaków), z `<br class="hidden sm:block">` w miejscu łamania |
| Tytuł usługi   | 1–3 słowa                                                                             |
| Opis usługi    | 1 zdanie, do ~90 znaków                                                               |
| Atut           | 2–3 słowa                                                                             |
| Pytanie FAQ    | 1 zdanie, tak jak zadałby je klient                                                   |
| Odpowiedź FAQ  | 1–3 zdania, zaczyna się od odpowiedzi („Tak.”, „Nie.”, „Zwykle…”)                     |
| Przycisk / CTA | czasownik + obiekt: „Wyznacz trasę”, „Pokaż mapę” — ta sama nazwa w całym flow        |

## Jak pracować

1. Przeczytaj oba pliki locale (cały kontekst, nie tylko zmieniany klucz) i `CLAUDE.md`.
2. Zmień PL, potem EN. Dane firmy tylko placeholderami.
3. Sprawdź:
   ```bash
   npm run lint     # zgodność kluczy PL/EN + reguły szablonów
   npm run spell    # pisownia PL (pl.json, *.md) i EN-GB (en.json)
   npm run build
   grep -o '{[a-zA-Z]*}' build/index.html build/en/index.html   # niepodstawione placeholdery — ma być pusto
   ```
   Nowe poprawne słowo, którego nie zna słownik (nazwa własna, termin), dopisz do `words` w `cspell.json`.
4. W odpowiedzi pokaż zmiany jako tabelę „było → jest” dla PL i EN oraz listę pytań do właściciela
   (fakty, których brakowało). Nie commituj — robi to właściciel.

## Przykłady

**Opis usługi**

- ✗ „Oferujemy kompleksowe usługi w zakresie naprawy układów zawieszenia na najwyższym poziomie.”
- ✓ „Amortyzatory, sprężyny, wahacze, tuleje i łączniki stabilizatora.”

**Odpowiedź FAQ**

- ✗ „Oczywiście! Nasz doświadczony zespół z wieloletnią praktyką zawsze chętnie pomoże.” (zmyślone
  „wieloletnia praktyka”, brak odpowiedzi)
- ✓ „Najlepiej zadzwonić wcześniej pod numer {phoneLink}. Ustalimy termin i powiemy, ile mniej więcej
  potrwa naprawa.”

**Meta description**

- ✗ „Warsztat. Mechanik. Naprawa. Gidle. Tanio. Szybko. Najlepiej.”
- ✓ „{name} – warsztat samochodowy w {cityLocative}. Wymiana oleju, zawieszenie, sprzęgła, rozrządy,
  diagnostyka komputerowa. Tel. {phone}.”
