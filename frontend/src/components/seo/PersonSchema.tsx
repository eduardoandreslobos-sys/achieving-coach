import Script from 'next/script';

interface PersonSchemaProps {
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  url: string;
  sameAs?: string[];
  worksFor?: string;
  knowsAbout?: string[];
  alumniOf?: string[];
  hasCredential?: Array<{
    name: string;
    credentialCategory?: string;
    issuedBy?: string;
  }>;
  areaServed?: string[];
  priceRange?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Person Schema for coach profiles - Critical for E-E-A-T signals
 * Helps search engines understand expertise and credentials
 */
export default function PersonSchema({
  name,
  jobTitle,
  description,
  image,
  url,
  sameAs = [],
  worksFor,
  knowsAbout = [],
  alumniOf = [],
  hasCredential = [],
  areaServed = [],
  priceRange,
  aggregateRating,
}: PersonSchemaProps) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${url}#person`,
    name,
    url,
  };

  if (jobTitle) schema.jobTitle = jobTitle;
  if (description) schema.description = description;
  if (image) {
    schema.image = {
      '@type': 'ImageObject',
      url: image,
      width: 400,
      height: 400,
    };
  }
  if (sameAs.length > 0) schema.sameAs = sameAs;
  if (worksFor) {
    schema.worksFor = {
      '@type': 'Organization',
      name: worksFor,
    };
  }
  if (knowsAbout.length > 0) schema.knowsAbout = knowsAbout;
  if (alumniOf.length > 0) {
    schema.alumniOf = alumniOf.map(org => ({
      '@type': 'EducationalOrganization',
      name: org,
    }));
  }
  if (hasCredential.length > 0) {
    schema.hasCredential = hasCredential.map(cred => ({
      '@type': 'EducationalOccupationalCredential',
      name: cred.name,
      ...(cred.credentialCategory && { credentialCategory: cred.credentialCategory }),
      ...(cred.issuedBy && {
        recognizedBy: {
          '@type': 'Organization',
          name: cred.issuedBy,
        },
      }),
    }));
  }

  // Add LocalBusiness-like properties for coaches
  if (areaServed.length > 0 || priceRange || aggregateRating) {
    // Also create a ProfessionalService schema
    const serviceSchema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${url}#service`,
      name: `${name} - Coaching Services`,
      provider: { '@id': `${url}#person` },
      url,
    };

    if (areaServed.length > 0) {
      serviceSchema.areaServed = areaServed.map(area => ({
        '@type': 'Place',
        name: area,
      }));
    }
    if (priceRange) serviceSchema.priceRange = priceRange;
    if (aggregateRating) {
      serviceSchema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      };
    }

    return (
      <>
        <Script
          id={`person-schema-${name.replace(/\s+/g, '-').toLowerCase()}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Script
          id={`service-schema-${name.replace(/\s+/g, '-').toLowerCase()}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      </>
    );
  }

  return (
    <Script
      id={`person-schema-${name.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
