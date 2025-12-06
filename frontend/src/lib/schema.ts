export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AchievingCoach",
  "url": "https://achievingcoach.com",
  "logo": "https://achievingcoach.com/images/logo.png",
  "description": "Professional coaching platform for certified coaches to manage practices, track client progress, and deliver exceptional results.",
  "foundingDate": "2021",
  "founders": [
    {
      "@type": "Person",
      "name": "Eduardo Lobos"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.linkedin.com/company/achievingcoach",
    "https://twitter.com/achievingcoach"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "support@achievingcoach.com",
    "availableLanguage": ["English", "Spanish"]
  }
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AchievingCoach",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "29",
    "priceCurrency": "USD",
    "priceValidUntil": "2025-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "description": "End-to-end platform for professional coaches to manage coaching practices, track client progress, and acquire structured development exercises."
};

export const webPageSchema = (title: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": title,
  "description": description,
  "url": url,
  "publisher": {
    "@type": "Organization",
    "name": "AchievingCoach",
    "logo": {
      "@type": "ImageObject",
      "url": "https://achievingcoach.com/images/logo.png"
    }
  }
});

export const blogPostSchema = (
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  publishedDate: string,
  modifiedDate: string,
  authorName: string
) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "description": description,
  "image": imageUrl,
  "datePublished": publishedDate,
  "dateModified": modifiedDate,
  "author": {
    "@type": "Person",
    "name": authorName
  },
  "publisher": {
    "@type": "Organization",
    "name": "AchievingCoach",
    "logo": {
      "@type": "ImageObject",
      "url": "https://achievingcoach.com/images/logo.png"
    }
  },
  "url": url,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": url
  }
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
