// Client-side behaviour. User-facing strings come from data-* attributes rendered by the templates.

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode, blocked cookies) */
    }
  },
};

/** Calls `init` with every element matching `selector` when it exists on the page. */
const onPage = (selector, init) => document.querySelectorAll(selector).forEach(init);

// ---------- Theme toggle (initial theme is applied by the inline script in <head>) ----------
onPage('#theme-btn', (button) => {
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');

  const apply = (theme) => {
    root.dataset.theme = theme;
    themeColor?.setAttribute('content', getComputedStyle(document.body).backgroundColor);
    button.setAttribute('aria-label', theme === 'dark' ? button.dataset.labelToLight : button.dataset.labelToDark);
  };

  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    storage.set('theme', next);
    apply(next);
  });
  apply(root.dataset.theme);
});

// ---------- Mobile menu ----------
onPage('#menu-btn', (button) => {
  const menu = document.getElementById(button.getAttribute('aria-controls'));

  const setOpen = (open) => {
    menu.classList.toggle('hidden', !open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? button.dataset.labelClose : button.dataset.labelOpen);
    button.querySelector('.i-open').classList.toggle('hidden', open);
    button.querySelector('.i-close').classList.toggle('hidden', !open);
  };

  button.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
  menu.addEventListener('click', (e) => e.target.closest('a') && setOpen(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
});

// ---------- Gallery lightbox (.gallery-item[data-full]) ----------
onPage('#lightbox', (dialog) => {
  const img = dialog.querySelector('img');

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item[data-full]');
    if (!item) return;
    img.src = item.dataset.full;
    img.alt = item.querySelector('img')?.alt ?? '';
    dialog.showModal();
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
});

// ---------- Consent for third-party embeds ----------
// Decision is stored as "granted" | "denied"; no stored value means the visitor has not chosen yet.
const CONSENT_KEY = 'consent.embeds';
const consent = {
  get: () => storage.get(CONSENT_KEY),
  set(value) {
    storage.set(CONSENT_KEY, value);
    document.dispatchEvent(new CustomEvent('consentchange', { detail: value }));
  },
};

document.addEventListener('click', (e) => {
  const choice = e.target.closest('[data-consent]');
  if (choice) consent.set(choice.dataset.consent);
});

onPage('#cookie-banner', (banner) => {
  const show = (visible) => (banner.hidden = !visible);
  document.addEventListener('click', (e) => e.target.closest('[data-consent-open]') && show(true));
  document.addEventListener('consentchange', () => show(false));
  show(consent.get() === null);
});

// Swaps the placeholder for an iframe while consent is granted and restores it when consent is withdrawn.
onPage('[data-consent-embed]', (container) => {
  const placeholder = container.firstElementChild;

  const render = (state) => {
    if (state !== 'granted') return container.replaceChildren(placeholder);
    const iframe = document.createElement('iframe');
    iframe.title = container.dataset.title;
    iframe.src = container.dataset.src;
    iframe.className = 'map-frame h-full min-h-[320px] w-full';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    container.replaceChildren(iframe);
  };

  document.addEventListener('consentchange', (e) => render(e.detail));
  render(consent.get());
});

// ---------- Call bar: shown once the element named in data-reveal-after has scrolled past ----------
onPage('#callbar[data-reveal-after]', (bar) => {
  const target = document.getElementById(bar.dataset.revealAfter);
  const show = (visible) => {
    bar.dataset.visible = String(visible);
    bar.inert = !visible;
  };

  if (!target || !('IntersectionObserver' in window)) return show(true);
  new IntersectionObserver(([entry]) => show(!entry.isIntersecting && entry.boundingClientRect.top < 0)).observe(
    target,
  );
});
