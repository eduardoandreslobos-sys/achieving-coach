import { Timestamp } from 'firebase/firestore';

// ============================================
// Coach Directory Types
// Following Salesforce Lead/Contact patterns
// ============================================

export interface AvailabilitySlot {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  timezone: string;  // "America/Mexico_City"
}

export interface CoachLocation {
  city: string;
  country: string;
  timezone: string;
  isRemoteOnly: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
  perSession: boolean; // true = per session, false = per program
}

/**
 * Public profile for the coach directory
 * Visible to potential coachees searching for coaches
 */
export interface CoachPublicProfile {
  id: string;
  userId: string;
  slug: string;                     // URL-friendly: /coaches/juan-perez

  // Basic Info
  displayName: string;
  headline: string;                 // "Coach Ejecutivo | Especialista en Liderazgo"
  bio: string;
  shortBio: string;                 // 150 chars for cards
  photoURL: string;
  coverPhotoURL?: string;

  // Professional Info
  specialties: string[];            // ["Liderazgo", "Transición de Carrera"]
  certifications: string[];         // ["ICF PCC", "CTI CPCC"]
  languages: string[];              // ["Español", "English"]
  yearsExperience: number;

  // Pricing & Availability
  sessionPrice: PriceRange;
  programPrice?: PriceRange;
  availability: AvailabilitySlot[];
  location: CoachLocation;

  // Target Audience
  worksWith: string[];              // ["Ejecutivos", "Emprendedores", "Equipos"]
  industries: string[];             // ["Tecnología", "Finanzas", "Salud"]
  methodology: string[];            // ["Ontológico", "GROW", "Co-Active"]

  // Social & Links
  linkedInUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  videoIntroUrl?: string;           // YouTube/Vimeo intro video

  // Stats & Ratings
  rating: number;                   // 0-5 average
  reviewCount: number;
  totalClients: number;
  totalSessions: number;
  successRate?: number;             // % of clients who achieved goals

  // Directory Settings
  isPublished: boolean;             // Visible in directory
  acceptingNewClients: boolean;
  featured: boolean;                // Admin can feature coaches
  featuredOrder?: number;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}

/**
 * Form data for creating/updating directory profile
 */
export interface CoachProfileFormData {
  displayName: string;
  headline: string;
  bio: string;
  shortBio: string;
  photoURL: string;
  coverPhotoURL?: string;
  specialties: string[];
  certifications: string[];
  languages: string[];
  yearsExperience: number;
  sessionPrice: PriceRange;
  programPrice?: PriceRange;
  availability: AvailabilitySlot[];
  location: CoachLocation;
  worksWith: string[];
  industries: string[];
  methodology: string[];
  linkedInUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  videoIntroUrl?: string;
  isPublished: boolean;
  acceptingNewClients: boolean;
}

// ============================================
// Coach Inquiries (Pre-Lead)
// Equivalent to Salesforce Web-to-Lead
// ============================================

export type InquiryStatus = 'new' | 'viewed' | 'responded' | 'converted' | 'declined';
export type InquirySource = 'directory' | 'referral' | 'website' | 'social' | 'event' | 'other';
export type InquiryUrgency = 'exploring' | 'soon' | 'immediate';
export type ContactMethod = 'email' | 'phone' | 'whatsapp' | 'video_call';

/**
 * Inquiry from a potential coachee via the directory
 * This is the first touchpoint before becoming a Lead
 */
export interface CoachInquiry {
  id: string;
  coachId: string;
  coachName: string;                // Denormalized for notifications

  // Prospect Information
  prospectName: string;
  prospectEmail: string;
  prospectPhone?: string;
  prospectCompany?: string;
  prospectRole?: string;
  prospectLinkedIn?: string;

  // Inquiry Details
  message: string;
  interestAreas: string[];          // Specialties they're interested in
  urgency: InquiryUrgency;
  preferredContactMethod: ContactMethod;
  preferredTimes?: string;          // Free text: "Weekday mornings"

  // Budget & Expectations (optional)
  budgetRange?: PriceRange;
  expectedDuration?: string;        // "3 months", "6 months"
  hasCoachingExperience: boolean;

  // Source Attribution
  source: InquirySource;
  sourceDetail?: string;            // "Referral from Maria Garcia"
  referredBy?: string;              // User ID if internal referral
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;

  // Status & Conversion
  status: InquiryStatus;
  convertedToLeadId?: string;       // Link to Lead if converted
  declineReason?: string;

  // Coach Response
  coachResponse?: string;
  responseType?: 'accepted' | 'declined' | 'more_info';

  // Timestamps
  createdAt: Timestamp;
  viewedAt?: Timestamp;
  respondedAt?: Timestamp;
  convertedAt?: Timestamp;
}

/**
 * Form data for submitting an inquiry
 */
export interface InquiryFormData {
  prospectName: string;
  prospectEmail: string;
  prospectPhone?: string;
  prospectCompany?: string;
  prospectRole?: string;
  message: string;
  interestAreas: string[];
  urgency: InquiryUrgency;
  preferredContactMethod: ContactMethod;
  preferredTimes?: string;
  budgetRange?: PriceRange;
  expectedDuration?: string;
  hasCoachingExperience: boolean;
  source: InquirySource;
  sourceDetail?: string;
  referredBy?: string;
}

// ============================================
// Directory Filters & Search
// ============================================

export interface CoachFilters {
  specialties?: string[];
  languages?: string[];
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  location?: {
    city?: string;
    country?: string;
    remoteOnly?: boolean;
  };
  worksWith?: string[];
  industries?: string[];
  methodology?: string[];
  minRating?: number;
  minYearsExperience?: number;
  acceptingNewClients?: boolean;
  certifications?: string[];
  search?: string;                  // Free text search
}

export type CoachSortOption =
  | 'rating_desc'
  | 'rating_asc'
  | 'reviews_desc'
  | 'experience_desc'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'featured';

export interface CoachSearchParams {
  filters: CoachFilters;
  sort: CoachSortOption;
  page: number;
  limit: number;
}

export interface CoachSearchResult {
  coaches: CoachPublicProfile[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================
// Constants & Defaults
// ============================================

export const SPECIALTIES = [
  'Liderazgo',
  'Desarrollo Ejecutivo',
  'Transición de Carrera',
  'Emprendimiento',
  'Bienestar y Balance',
  'Equipos',
  'Comunicación',
  'Productividad',
  'Inteligencia Emocional',
  'Coaching Ontológico',
  'Coaching de Vida',
  'Coaching Empresarial',
] as const;

export const METHODOLOGIES = [
  'GROW',
  'Ontológico',
  'Co-Active (CTI)',
  'Sistémico',
  'PNL',
  'Cognitivo-Conductual',
  'Apreciativo',
  'Transformacional',
  'Solución-Enfocado',
] as const;

export const WORK_WITH_OPTIONS = [
  'Ejecutivos C-Level',
  'Gerentes y Directores',
  'Mandos Medios',
  'Emprendedores',
  'Profesionales Independientes',
  'Equipos',
  'Organizaciones',
  'Jóvenes Profesionales',
] as const;

export const INDUSTRIES = [
  'Tecnología',
  'Finanzas',
  'Salud',
  'Educación',
  'Retail',
  'Manufactura',
  'Consultoría',
  'Startups',
  'ONGs',
  'Gobierno',
] as const;

export const LANGUAGES = [
  'Español',
  'English',
  'Português',
  'Français',
  'Deutsch',
  'Italiano',
] as const;

export const CERTIFICATIONS = [
  'ICF ACC',
  'ICF PCC',
  'ICF MCC',
  'CTI CPCC',
  'EMCC',
  'NBH',
  'Erickson',
  'Newfield',
] as const;

export const DEFAULT_AVAILABILITY: AvailabilitySlot[] = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', timezone: 'America/Mexico_City' },
  { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', timezone: 'America/Mexico_City' },
  { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', timezone: 'America/Mexico_City' },
  { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', timezone: 'America/Mexico_City' },
  { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', timezone: 'America/Mexico_City' },
];

export const DEFAULT_PRICE_RANGE: PriceRange = {
  min: 100,
  max: 300,
  currency: 'USD',
  perSession: true,
};

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: 'Nueva',
  viewed: 'Vista',
  responded: 'Respondida',
  converted: 'Convertida',
  declined: 'Declinada',
};

export const URGENCY_LABELS: Record<InquiryUrgency, string> = {
  exploring: 'Explorando opciones',
  soon: 'Próximamente (1-3 meses)',
  immediate: 'Inmediato (< 1 mes)',
};
