import { siteConfig, contactContent, teamContent } from "@/lib/constants";

// Schema.org structured data for SEO
export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    email: contactContent.email,
    telephone: contactContent.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Warszawa",
      addressCountry: "PL",
    },
    sameAs: [
      // Add social media URLs when available
      // "https://linkedin.com/company/catman-consulting",
      // "https://facebook.com/catmanconsulting",
    ],
    founder: teamContent.members.map((member) => ({
      "@type": "Person",
      name: member.name,
      jobTitle: member.role,
      description: member.experience,
    })),
    knowsAbout: [
      "Kultura organizacyjna",
      "Kompetencje społeczne",
      "Rozwój liderów",
      "Coaching biznesowy",
      "Szkolenia menedżerskie",
      "Transformacja organizacji",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    inLanguage: "pl-PL",
  };

  const consultingServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#service`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: contactContent.phone,
    email: contactContent.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Warszawa",
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "52.2297",
      longitude: "21.0122",
    },
    areaServed: {
      "@type": "Country",
      name: "Polska",
    },
    serviceType: [
      "Konsulting biznesowy",
      "Szkolenia dla liderów",
      "Coaching",
      "Rozwój kultury organizacyjnej",
    ],
    priceRange: "$$$$",
    image: `${siteConfig.url}/images/og-image.jpg`,
  };

  // Person schemas for team members
  const personSchemas = teamContent.members.map((member, index) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person-${index + 1}`,
    name: member.name,
    jobTitle: member.role,
    description: member.experience,
    image: `${siteConfig.url}${member.image}`,
    worksFor: {
      "@id": `${siteConfig.url}/#organization`,
    },
    knowsAbout: [
      "Kompetencje społeczne",
      "Kultura organizacyjna",
      "Coaching",
      "Szkolenia biznesowe",
    ],
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona główna",
        item: siteConfig.url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(consultingServiceSchema),
        }}
      />
      {personSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
