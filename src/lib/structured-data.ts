// schema.org JSON-LD builders.
import { site, maps, absolute, WEEK_DAYS } from '../site';
import { routes, useTranslations, type Lang } from '../i18n';
import services from '../data/services.json';

export function localBusiness(lang: Lang) {
  const { t } = useTranslations(lang);
  const { hours } = site;
  const sameAs = site.social.map((s) => s.url);

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
    hasMap: maps.place,
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
    ...(sameAs.length && { sameAs }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t.nav.services,
      itemListElement: services.map((id) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: t.services[id as keyof typeof t.services].title },
      })),
    },
  };
}
