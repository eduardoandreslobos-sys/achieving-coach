/**
 * Schema.org JSON-LD Tests
 *
 * Tests for structured data schema generators.
 * Validates JSON-LD output for SEO compliance.
 */

import {
  organizationSchema,
  softwareApplicationSchema,
  webPageSchema,
  blogPostSchema,
  faqSchema,
} from '../schema';

describe('Schema.org Generators', () => {
  describe('organizationSchema', () => {
    it('should have correct @context', () => {
      expect(organizationSchema['@context']).toBe('https://schema.org');
    });

    it('should have correct @type', () => {
      expect(organizationSchema['@type']).toBe('Organization');
    });

    it('should include required organization properties', () => {
      expect(organizationSchema.name).toBe('AchievingCoach');
      expect(organizationSchema.url).toBe('https://achievingcoach.com');
      expect(organizationSchema.logo).toBeDefined();
      expect(organizationSchema.description).toBeDefined();
    });

    it('should include founders array', () => {
      expect(Array.isArray(organizationSchema.founders)).toBe(true);
      expect(organizationSchema.founders.length).toBeGreaterThan(0);
      expect(organizationSchema.founders[0]['@type']).toBe('Person');
      expect(organizationSchema.founders[0].name).toBeDefined();
    });

    it('should include address with country', () => {
      expect(organizationSchema.address).toBeDefined();
      expect(organizationSchema.address['@type']).toBe('PostalAddress');
      expect(organizationSchema.address.addressCountry).toBe('US');
    });

    it('should include social media links', () => {
      expect(Array.isArray(organizationSchema.sameAs)).toBe(true);
      expect(organizationSchema.sameAs.length).toBeGreaterThan(0);
    });

    it('should include contact point', () => {
      expect(organizationSchema.contactPoint).toBeDefined();
      expect(organizationSchema.contactPoint['@type']).toBe('ContactPoint');
      expect(organizationSchema.contactPoint.email).toBeDefined();
      expect(Array.isArray(organizationSchema.contactPoint.availableLanguage)).toBe(true);
    });

    it('should include founding date', () => {
      expect(organizationSchema.foundingDate).toBeDefined();
    });
  });

  describe('softwareApplicationSchema', () => {
    it('should have correct @context', () => {
      expect(softwareApplicationSchema['@context']).toBe('https://schema.org');
    });

    it('should have correct @type', () => {
      expect(softwareApplicationSchema['@type']).toBe('SoftwareApplication');
    });

    it('should include application details', () => {
      expect(softwareApplicationSchema.name).toBe('AchievingCoach');
      expect(softwareApplicationSchema.applicationCategory).toBe('BusinessApplication');
      expect(softwareApplicationSchema.operatingSystem).toBe('Web');
    });

    it('should include offer details', () => {
      expect(softwareApplicationSchema.offers).toBeDefined();
      expect(softwareApplicationSchema.offers['@type']).toBe('Offer');
      expect(softwareApplicationSchema.offers.price).toBeDefined();
      expect(softwareApplicationSchema.offers.priceCurrency).toBe('USD');
      expect(softwareApplicationSchema.offers.priceValidUntil).toBeDefined();
    });

    it('should include aggregate rating', () => {
      expect(softwareApplicationSchema.aggregateRating).toBeDefined();
      expect(softwareApplicationSchema.aggregateRating['@type']).toBe('AggregateRating');
      expect(softwareApplicationSchema.aggregateRating.ratingValue).toBeDefined();
      expect(softwareApplicationSchema.aggregateRating.ratingCount).toBeDefined();
      expect(softwareApplicationSchema.aggregateRating.bestRating).toBe('5');
      expect(softwareApplicationSchema.aggregateRating.worstRating).toBe('1');
    });

    it('should include description', () => {
      expect(softwareApplicationSchema.description).toBeDefined();
      expect(typeof softwareApplicationSchema.description).toBe('string');
    });
  });

  describe('webPageSchema', () => {
    it('should generate valid WebPage schema', () => {
      const result = webPageSchema(
        'Test Page',
        'A test page description',
        'https://achievingcoach.com/test'
      );

      expect(result['@context']).toBe('https://schema.org');
      expect(result['@type']).toBe('WebPage');
    });

    it('should include provided parameters', () => {
      const title = 'About Us';
      const description = 'Learn about AchievingCoach';
      const url = 'https://achievingcoach.com/about';

      const result = webPageSchema(title, description, url);

      expect(result.name).toBe(title);
      expect(result.description).toBe(description);
      expect(result.url).toBe(url);
    });

    it('should include publisher organization', () => {
      const result = webPageSchema('Test', 'Test desc', 'https://test.com');

      expect(result.publisher).toBeDefined();
      expect(result.publisher['@type']).toBe('Organization');
      expect(result.publisher.name).toBe('AchievingCoach');
    });

    it('should include publisher logo', () => {
      const result = webPageSchema('Test', 'Test desc', 'https://test.com');

      expect(result.publisher.logo).toBeDefined();
      expect(result.publisher.logo['@type']).toBe('ImageObject');
      expect(result.publisher.logo.url).toBeDefined();
    });

    it('should handle special characters in title and description', () => {
      const result = webPageSchema(
        'Coach\'s Guide & Tips',
        'Learn "coaching" techniques & strategies',
        'https://achievingcoach.com/guide'
      );

      expect(result.name).toBe('Coach\'s Guide & Tips');
      expect(result.description).toContain('&');
    });

    it('should handle empty strings', () => {
      const result = webPageSchema('', '', '');

      expect(result.name).toBe('');
      expect(result.description).toBe('');
      expect(result.url).toBe('');
    });
  });

  describe('blogPostSchema', () => {
    const defaultParams = {
      title: 'How to Become a Better Coach',
      description: 'Tips for improving your coaching practice',
      url: 'https://achievingcoach.com/blog/better-coach',
      imageUrl: 'https://achievingcoach.com/images/blog/better-coach.webp',
      publishedDate: '2024-01-15T10:00:00Z',
      modifiedDate: '2024-01-20T15:30:00Z',
      authorName: 'Eduardo Lobos',
    };

    it('should generate valid BlogPosting schema', () => {
      const result = blogPostSchema(
        defaultParams.title,
        defaultParams.description,
        defaultParams.url,
        defaultParams.imageUrl,
        defaultParams.publishedDate,
        defaultParams.modifiedDate,
        defaultParams.authorName
      );

      expect(result['@context']).toBe('https://schema.org');
      expect(result['@type']).toBe('BlogPosting');
    });

    it('should include all provided parameters', () => {
      const result = blogPostSchema(
        defaultParams.title,
        defaultParams.description,
        defaultParams.url,
        defaultParams.imageUrl,
        defaultParams.publishedDate,
        defaultParams.modifiedDate,
        defaultParams.authorName
      );

      expect(result.headline).toBe(defaultParams.title);
      expect(result.description).toBe(defaultParams.description);
      expect(result.url).toBe(defaultParams.url);
      expect(result.image).toBe(defaultParams.imageUrl);
      expect(result.datePublished).toBe(defaultParams.publishedDate);
      expect(result.dateModified).toBe(defaultParams.modifiedDate);
    });

    it('should include author as Person', () => {
      const result = blogPostSchema(
        defaultParams.title,
        defaultParams.description,
        defaultParams.url,
        defaultParams.imageUrl,
        defaultParams.publishedDate,
        defaultParams.modifiedDate,
        defaultParams.authorName
      );

      expect(result.author).toBeDefined();
      expect(result.author['@type']).toBe('Person');
      expect(result.author.name).toBe(defaultParams.authorName);
    });

    it('should include publisher organization', () => {
      const result = blogPostSchema(
        defaultParams.title,
        defaultParams.description,
        defaultParams.url,
        defaultParams.imageUrl,
        defaultParams.publishedDate,
        defaultParams.modifiedDate,
        defaultParams.authorName
      );

      expect(result.publisher).toBeDefined();
      expect(result.publisher['@type']).toBe('Organization');
      expect(result.publisher.name).toBe('AchievingCoach');
      expect(result.publisher.logo).toBeDefined();
    });

    it('should include mainEntityOfPage', () => {
      const result = blogPostSchema(
        defaultParams.title,
        defaultParams.description,
        defaultParams.url,
        defaultParams.imageUrl,
        defaultParams.publishedDate,
        defaultParams.modifiedDate,
        defaultParams.authorName
      );

      expect(result.mainEntityOfPage).toBeDefined();
      expect(result.mainEntityOfPage['@type']).toBe('WebPage');
      expect(result.mainEntityOfPage['@id']).toBe(defaultParams.url);
    });

    it('should handle ISO date strings', () => {
      const result = blogPostSchema(
        'Test',
        'Test',
        'https://test.com',
        'https://test.com/image.jpg',
        '2024-06-15T14:30:00.000Z',
        '2024-06-16T10:00:00.000Z',
        'Author'
      );

      expect(result.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(result.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('faqSchema', () => {
    const sampleFaqs = [
      {
        question: 'What is AchievingCoach?',
        answer: 'AchievingCoach is a professional coaching platform.',
      },
      {
        question: 'How much does it cost?',
        answer: 'Plans start at $29/month.',
      },
      {
        question: 'Is there a free trial?',
        answer: 'Yes, we offer a 14-day free trial.',
      },
    ];

    it('should generate valid FAQPage schema', () => {
      const result = faqSchema(sampleFaqs);

      expect(result['@context']).toBe('https://schema.org');
      expect(result['@type']).toBe('FAQPage');
    });

    it('should include mainEntity array', () => {
      const result = faqSchema(sampleFaqs);

      expect(result.mainEntity).toBeDefined();
      expect(Array.isArray(result.mainEntity)).toBe(true);
      expect(result.mainEntity.length).toBe(3);
    });

    it('should format questions correctly', () => {
      const result = faqSchema(sampleFaqs);

      result.mainEntity.forEach((item: any, index: number) => {
        expect(item['@type']).toBe('Question');
        expect(item.name).toBe(sampleFaqs[index].question);
      });
    });

    it('should format answers correctly', () => {
      const result = faqSchema(sampleFaqs);

      result.mainEntity.forEach((item: any, index: number) => {
        expect(item.acceptedAnswer).toBeDefined();
        expect(item.acceptedAnswer['@type']).toBe('Answer');
        expect(item.acceptedAnswer.text).toBe(sampleFaqs[index].answer);
      });
    });

    it('should handle empty FAQs array', () => {
      const result = faqSchema([]);

      expect(result['@type']).toBe('FAQPage');
      expect(result.mainEntity).toEqual([]);
    });

    it('should handle single FAQ', () => {
      const singleFaq = [{ question: 'Q?', answer: 'A.' }];
      const result = faqSchema(singleFaq);

      expect(result.mainEntity.length).toBe(1);
    });

    it('should handle special characters in questions and answers', () => {
      const specialFaqs = [
        {
          question: 'What\'s the "best" coaching approach?',
          answer: 'It depends on your goals & preferences.',
        },
      ];

      const result = faqSchema(specialFaqs);

      expect(result.mainEntity[0].name).toContain('\'');
      expect(result.mainEntity[0].acceptedAnswer.text).toContain('&');
    });

    it('should preserve HTML in answers', () => {
      const htmlFaqs = [
        {
          question: 'How do I sign up?',
          answer: 'Visit our <a href="/signup">signup page</a> to get started.',
        },
      ];

      const result = faqSchema(htmlFaqs);

      expect(result.mainEntity[0].acceptedAnswer.text).toContain('<a href');
    });
  });

  describe('JSON-LD validity', () => {
    it('should produce valid JSON for organizationSchema', () => {
      expect(() => JSON.stringify(organizationSchema)).not.toThrow();
    });

    it('should produce valid JSON for softwareApplicationSchema', () => {
      expect(() => JSON.stringify(softwareApplicationSchema)).not.toThrow();
    });

    it('should produce valid JSON for webPageSchema', () => {
      const result = webPageSchema('Test', 'Test', 'https://test.com');
      expect(() => JSON.stringify(result)).not.toThrow();
    });

    it('should produce valid JSON for blogPostSchema', () => {
      const result = blogPostSchema(
        'Title',
        'Description',
        'https://test.com/blog/post',
        'https://test.com/image.jpg',
        '2024-01-01',
        '2024-01-02',
        'Author'
      );
      expect(() => JSON.stringify(result)).not.toThrow();
    });

    it('should produce valid JSON for faqSchema', () => {
      const result = faqSchema([{ question: 'Q?', answer: 'A.' }]);
      expect(() => JSON.stringify(result)).not.toThrow();
    });
  });

  describe('Schema compliance', () => {
    it('organizationSchema should have required properties for Google', () => {
      // Google requires: name, url
      expect(organizationSchema.name).toBeDefined();
      expect(organizationSchema.url).toBeDefined();
    });

    it('blogPostSchema should have required properties for Google', () => {
      // Google requires: headline, image, datePublished, author
      const result = blogPostSchema(
        'Title',
        'Description',
        'https://test.com',
        'https://test.com/image.jpg',
        '2024-01-01',
        '2024-01-02',
        'Author'
      );

      expect(result.headline).toBeDefined();
      expect(result.image).toBeDefined();
      expect(result.datePublished).toBeDefined();
      expect(result.author).toBeDefined();
    });

    it('faqSchema should have required properties for Google', () => {
      // Google requires: mainEntity with Question items containing acceptedAnswer
      const result = faqSchema([{ question: 'Q?', answer: 'A.' }]);

      expect(result.mainEntity).toBeDefined();
      expect(result.mainEntity[0]['@type']).toBe('Question');
      expect(result.mainEntity[0].acceptedAnswer).toBeDefined();
      expect(result.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    });
  });
});
