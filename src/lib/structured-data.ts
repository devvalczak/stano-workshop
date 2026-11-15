// schema.org JSON-LD builders.
import { site, absolute, WEEK_DAYS } from '../site';
import { routes, useTranslations, type Lang, type PageId } from '../i18n';
import services from '../data/services.json';

export function localBusiness(lang: Lang) {
  const { t } = useTranslations(lang);
  const { hours } = site;

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: site.name,
    description: t.home.meta.description,
    url: absolute(routes.home[lang]),
    telephone: site.phoneE164,
    image: absolute('/og-image.jpg'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      postalCode: site.postalCode,
      addressLocality: site.city,
      addressCountry: site.country,
    },
    areaServed: site.city,
    ...(hours.days.length && {
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: hours.days.map((d) => WEEK_DAYS[d]),
          opens: hours.opens,
          closes: hours.closes,
        },
      ],
    }),
    ...(site.geo && { geo: { '@type': 'GeoCoordinates', ...site.geo } }),
    ...(site.sameAs.length && { sameAs: site.sameAs }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t.nav.services,
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: t.services[s.id as keyof typeof t.services].title },
      })),
    },
  };
}

/** Breadcrumb trail from the home page to `pageId`. */
export function breadcrumbs(lang: Lang, pageId: PageId, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: site.name, item: absolute(routes.home[lang]) },
      { '@type': 'ListItem', position: 2, name, item: absolute(routes[pageId][lang]) },
    ],
  };
}
