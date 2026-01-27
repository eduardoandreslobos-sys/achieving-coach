'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Globe,
  Clock,
  Award,
  CheckCircle,
  MessageSquare,
  Calendar,
  ChevronLeft,
  Languages,
  Briefcase,
  GraduationCap,
  Target,
  Play,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InquiryForm } from '@/components/directory';
import { CoachPublicProfile } from '@/types/directory';
import { getPublicReviews } from '@/services/customer-success.service';
import { CoachReview } from '@/types/customer-success';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import PersonSchema from '@/components/seo/PersonSchema';

interface CoachProfileContentProps {
  coach: CoachPublicProfile;
}

export default function CoachProfileContent({ coach }: CoachProfileContentProps) {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [reviews, setReviews] = useState<CoachReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [coach.id]);

  const loadReviews = async () => {
    try {
      const reviewsData = await getPublicReviews(coach.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPrice = () => {
    if (!coach.sessionPrice) return null;
    const { min, max, currency } = coach.sessionPrice;
    if (min === max) {
      return `${currency} ${min}`;
    }
    return `${currency} ${min} - ${max}`;
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: coach.displayName,
        text: coach.headline,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Build Person Schema data
  const coachUrl = `https://achievingcoach.com/coaches/${coach.slug}`;
  const socialLinks: string[] = [];
  if (coach.linkedInUrl) socialLinks.push(coach.linkedInUrl);
  if (coach.websiteUrl) socialLinks.push(coach.websiteUrl);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      {/* Person Schema for SEO - Critical for E-E-A-T */}
      <PersonSchema
        name={coach.displayName}
        jobTitle={coach.headline || 'Coach Profesional'}
        description={coach.shortBio || coach.headline}
        image={coach.photoURL}
        url={coachUrl}
        sameAs={socialLinks}
        knowsAbout={coach.specialties || []}
        hasCredential={coach.certifications?.map(cert => ({
          name: cert,
          credentialCategory: 'Coaching Certification',
          issuedBy: cert.includes('ICF') ? 'International Coaching Federation' : undefined,
        })) || []}
        areaServed={coach.location?.city ? [coach.location.city, coach.location.country || ''].filter(Boolean) : ['Online', 'Worldwide']}
        priceRange={formatPrice() || undefined}
        aggregateRating={coach.rating && coach.reviewCount ? {
          ratingValue: coach.rating,
          reviewCount: coach.reviewCount,
        } : undefined}
      />

      {/* Breadcrumb with Schema */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { name: 'Directorio de Coaches', url: 'https://achievingcoach.com/coaches' },
            { name: coach.displayName, url: coachUrl },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="relative">
        {/* Cover photo / gradient background */}
        <div className="h-48 md:h-64 bg-gradient-to-br from-emerald-600/30 via-emerald-800/20 to-transparent">
          {coach.coverPhotoURL && (
            <Image
              src={coach.coverPhotoURL}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Profile info overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-24 pb-8">
            <div className="flex flex-col md:flex-row gap-6 md:items-end">
              {/* Avatar */}
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-[var(--bg-primary)] bg-[var(--bg-card)] shadow-xl flex-shrink-0">
                {coach.photoURL ? (
                  <Image
                    src={coach.photoURL}
                    alt={coach.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-600/20">
                    <span className="text-5xl font-bold text-emerald-400">
                      {getInitials(coach.displayName)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and quick info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-4 justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-[var(--fg-primary)]">
                        {coach.displayName}
                      </h1>
                      {coach.acceptingNewClients && (
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Disponible
                        </span>
                      )}
                    </div>
                    <p className="text-xl text-[var(--fg-muted)] max-w-2xl">
                      {coach.headline}
                    </p>

                    {/* Quick stats */}
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      {coach.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-amber-400 fill-current" />
                          <span className="font-semibold text-[var(--fg-primary)]">
                            {coach.rating.toFixed(1)}
                          </span>
                          <span className="text-[var(--fg-muted)]">
                            ({coach.reviewCount} reseñas)
                          </span>
                        </div>
                      )}
                      {coach.location && (
                        <div className="flex items-center gap-1 text-[var(--fg-muted)]">
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
                        <div className="flex items-center gap-1 text-[var(--fg-muted)]">
                          <Clock className="w-4 h-4" />
                          <span>{coach.yearsExperience} años de experiencia</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleShare}
                      className="p-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors"
                      title="Compartir"
                    >
                      <Share2 className="w-5 h-5 text-[var(--fg-muted)]" />
                    </button>
                    <button
                      onClick={() => setShowInquiryForm(true)}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Contactar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video intro */}
              {coach.videoIntroUrl && (
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                  <div className="aspect-video relative bg-black">
                    <iframe
                      src={coach.videoIntroUrl}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* About */}
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
                <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-4">
                  Sobre mí
                </h2>
                <div className="prose prose-invert max-w-none text-[var(--fg-muted)]">
                  <p className="whitespace-pre-line">{coach.bio}</p>
                </div>
              </div>

              {/* Specialties */}
              {coach.specialties.length > 0 && (
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
                  <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    Especialidades
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Methodology */}
              {coach.methodology && coach.methodology.length > 0 && (
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
                  <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    Metodología
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {coach.methodology.map((method, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--fg-muted)] rounded-xl"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Works with */}
              {coach.worksWith && coach.worksWith.length > 0 && (
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
                  <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                    Trabaja con
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {coach.worksWith.map((client, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--fg-muted)] rounded-xl"
                      >
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
                <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Reseñas de clientes
                  {coach.reviewCount > 0 && (
                    <span className="text-[var(--fg-muted)] font-normal">
                      ({coach.reviewCount})
                    </span>
                  )}
                </h2>

                {loadingReviews ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-32 bg-[var(--bg-secondary)] rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-[var(--fg-muted)] text-center py-8">
                    Aún no hay reseñas para este coach.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div
                        key={review.id}
                        className="pb-6 border-b border-[var(--border-color)] last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-[var(--fg-primary)]">
                              {review.clientName}
                            </div>
                            <div className="text-sm text-[var(--fg-muted)]">
                              {review.programType} • {review.programDuration}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.overallRating
                                    ? 'text-amber-400 fill-current'
                                    : 'text-[var(--fg-muted)]'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <h4 className="font-medium text-[var(--fg-primary)] mb-2">
                          {review.title}
                        </h4>
                        <p className="text-[var(--fg-muted)]">{review.content}</p>
                        {review.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {review.highlights.map((highlight, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact card */}
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 sticky top-4">
                {/* Price */}
                {formatPrice() && (
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-[var(--fg-primary)]">
                      {formatPrice()}
                    </div>
                    <div className="text-[var(--fg-muted)]">por sesión</div>
                  </div>
                )}

                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  <MessageSquare className="w-5 h-5" />
                  Contactar a {coach.displayName.split(' ')[0]}
                </button>

                {coach.acceptingNewClients && (
                  <p className="text-center text-sm text-emerald-400">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Aceptando nuevos clientes
                  </p>
                )}
              </div>

              {/* Certifications */}
              {coach.certifications.length > 0 && (
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
                  <h3 className="font-semibold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Certificaciones
                  </h3>
                  <ul className="space-y-3">
                    {coach.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center gap-2 text-[var(--fg-muted)]">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {coach.languages.length > 0 && (
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
                  <h3 className="font-semibold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-emerald-400" />
                    Idiomas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coach.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--fg-muted)] rounded-lg text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(coach.linkedInUrl || coach.websiteUrl) && (
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
                  <h3 className="font-semibold text-[var(--fg-primary)] mb-4">
                    Enlaces
                  </h3>
                  <div className="space-y-3">
                    {coach.linkedInUrl && (
                      <a
                        href={coach.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[var(--fg-muted)] hover:text-emerald-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {coach.websiteUrl && (
                      <a
                        href={coach.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[var(--fg-muted)] hover:text-emerald-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Sitio web</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Modal */}
      <InquiryForm
        coachId={coach.id}
        coachName={coach.displayName}
        specialties={coach.specialties}
        isOpen={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
      />

      <Footer />
    </div>
  );
}
