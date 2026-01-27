'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import Script from 'next/script';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * SEO-optimized Breadcrumbs component with Schema.org markup
 * Improves navigation UX and provides structured data for search engines
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [
    { name: 'Inicio', url: 'https://achievingcoach.com' },
    ...items,
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <Script
        id={`breadcrumb-schema-${items[items.length - 1]?.name || 'page'}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;
          const isFirst = index === 0;

          return (
            <div key={item.url} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
              {isLast ? (
                <span className="text-gray-400" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url.replace('https://achievingcoach.com', '')}
                  className="text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  {isFirst && <Home className="w-4 h-4" />}
                  {!isFirst && item.name}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
