'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Globe, CheckCircle, MessageSquare } from 'lucide-react';
import { CoachPublicProfile } from '@/types/directory';

interface CoachCardProps {
  coach: CoachPublicProfile;
  variant?: 'default' | 'compact' | 'featured';
}

export function CoachCard({ coach, variant = 'default' }: CoachCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  // Format price range
  const formatPrice = () => {
    if (!coach.sessionPrice) return null;
    const { min, max, currency } = coach.sessionPrice;
    if (min === max) {
      return `${currency} ${min}`;
    }
    return `${currency} ${min} - ${max}`;
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isCompact) {
    return (
      <Link
        href={`/coaches/${coach.slug}`}
        className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-emerald-500/50 transition-all"
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-emerald-600/20 flex-shrink-0">
          {coach.photoURL ? (
            <Image
              src={coach.photoURL}
              alt={coach.displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-400 font-semibold">
              {getInitials(coach.displayName)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--fg-primary)] truncate">
            {coach.displayName}
          </h3>
          <p className="text-sm text-[var(--fg-muted)] truncate">
            {coach.specialties.slice(0, 2).join(' • ')}
          </p>
        </div>
        {coach.rating > 0 && (
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{coach.rating.toFixed(1)}</span>
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={`/coaches/${coach.slug}`}
      className={`
        block rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]
        hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10
        transition-all duration-300 overflow-hidden group
        ${isFeatured ? 'md:flex' : ''}
      `}
    >
      {/* Image / Avatar */}
      <div className={`
        relative bg-gradient-to-br from-emerald-600/20 to-emerald-800/20
        ${isFeatured ? 'md:w-1/3 aspect-square md:aspect-auto' : 'aspect-[4/3]'}
      `}>
        {coach.photoURL ? (
          <Image
            src={coach.photoURL}
            alt={coach.displayName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold text-emerald-400/50">
              {getInitials(coach.displayName)}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {coach.featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
            Destacado
          </div>
        )}

        {/* Accepting clients badge */}
        {coach.acceptingNewClients && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-emerald-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Disponible
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-5 ${isFeatured ? 'md:w-2/3 md:p-6' : ''}`}>
        {/* Name and Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-bold text-[var(--fg-primary)] group-hover:text-emerald-400 transition-colors ${isFeatured ? 'text-xl' : 'text-lg'}`}>
            {coach.displayName}
          </h3>
          {coach.rating > 0 && (
            <div className="flex items-center gap-1 text-amber-400 flex-shrink-0">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">{coach.rating.toFixed(1)}</span>
              <span className="text-[var(--fg-muted)] text-sm">
                ({coach.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Headline */}
        <p className={`text-[var(--fg-muted)] mb-3 ${isFeatured ? '' : 'line-clamp-2'}`}>
          {coach.headline}
        </p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-4">
          {coach.specialties.slice(0, isFeatured ? 4 : 3).map((specialty, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full"
            >
              {specialty}
            </span>
          ))}
          {coach.specialties.length > (isFeatured ? 4 : 3) && (
            <span className="px-2 py-1 text-xs text-[var(--fg-muted)]">
              +{coach.specialties.length - (isFeatured ? 4 : 3)} más
            </span>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--fg-muted)]">
          {coach.location && (
            <div className="flex items-center gap-1">
              {coach.location.isRemoteOnly ? (
                <>
                  <Globe className="w-4 h-4" />
                  <span>100% Online</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>{coach.location.city}, {coach.location.country}</span>
                </>
              )}
            </div>
          )}

          {coach.yearsExperience > 0 && (
            <div className="flex items-center gap-1">
              <span>{coach.yearsExperience} años exp.</span>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)]">
          {formatPrice() && (
            <div>
              <span className="text-lg font-bold text-[var(--fg-primary)]">
                {formatPrice()}
              </span>
              <span className="text-sm text-[var(--fg-muted)]"> / sesión</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <MessageSquare className="w-4 h-4" />
            <span>Contactar</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CoachCard;
