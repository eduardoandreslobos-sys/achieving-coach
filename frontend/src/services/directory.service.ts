import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  CoachPublicProfile,
  CoachProfileFormData,
  CoachInquiry,
  InquiryFormData,
  CoachFilters,
  CoachSortOption,
  CoachSearchParams,
  CoachSearchResult,
  InquiryStatus,
  DEFAULT_PRICE_RANGE,
  DEFAULT_AVAILABILITY,
} from '@/types/directory';

// ============================================
// Collection References
// ============================================

const COACH_PROFILES_COLLECTION = 'coach_profiles';
const COACH_INQUIRIES_COLLECTION = 'coach_inquiries';

// ============================================
// Slug Generation
// ============================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function generateUniqueSlug(displayName: string): Promise<string> {
  const baseSlug = slugify(displayName);
  let slug = baseSlug;
  let counter = 1;

  // Check if slug exists
  while (true) {
    const existing = await getCoachBySlug(slug);
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// ============================================
// Coach Profile Management
// ============================================

/**
 * Get a coach's public profile by their user ID
 */
export async function getCoachProfileByUserId(userId: string): Promise<CoachPublicProfile | null> {
  const q = query(
    collection(db, COACH_PROFILES_COLLECTION),
    where('userId', '==', userId),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as CoachPublicProfile;
}

/**
 * Get a coach's public profile by their URL slug
 */
export async function getCoachBySlug(slug: string): Promise<CoachPublicProfile | null> {
  const q = query(
    collection(db, COACH_PROFILES_COLLECTION),
    where('slug', '==', slug),
    where('isPublished', '==', true),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as CoachPublicProfile;
}

/**
 * Get a coach's profile by ID (includes unpublished)
 */
export async function getCoachProfileById(profileId: string): Promise<CoachPublicProfile | null> {
  const docRef = doc(db, COACH_PROFILES_COLLECTION, profileId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as CoachPublicProfile;
}

/**
 * Create a new coach public profile
 */
export async function createCoachProfile(
  userId: string,
  data: CoachProfileFormData
): Promise<string> {
  const slug = await generateUniqueSlug(data.displayName);
  const profileRef = doc(collection(db, COACH_PROFILES_COLLECTION));

  const profile: Omit<CoachPublicProfile, 'id'> = {
    userId,
    slug,
    ...data,
    rating: 0,
    reviewCount: 0,
    totalClients: 0,
    totalSessions: 0,
    featured: false,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(profileRef, profile);
  return profileRef.id;
}

/**
 * Update an existing coach profile
 */
export async function updateCoachProfile(
  profileId: string,
  data: Partial<CoachProfileFormData>
): Promise<void> {
  const profileRef = doc(db, COACH_PROFILES_COLLECTION, profileId);

  // If display name changed, update slug
  let updates: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.displayName) {
    const currentProfile = await getCoachProfileById(profileId);
    if (currentProfile && currentProfile.displayName !== data.displayName) {
      updates.slug = await generateUniqueSlug(data.displayName);
    }
  }

  await updateDoc(profileRef, updates);
}

/**
 * Publish or unpublish a coach profile
 */
export async function setProfilePublishStatus(
  profileId: string,
  isPublished: boolean
): Promise<void> {
  const profileRef = doc(db, COACH_PROFILES_COLLECTION, profileId);

  await updateDoc(profileRef, {
    isPublished,
    publishedAt: isPublished ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Toggle accepting new clients status
 */
export async function setAcceptingNewClients(
  profileId: string,
  acceptingNewClients: boolean
): Promise<void> {
  const profileRef = doc(db, COACH_PROFILES_COLLECTION, profileId);

  await updateDoc(profileRef, {
    acceptingNewClients,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a coach profile
 */
export async function deleteCoachProfile(profileId: string): Promise<void> {
  const profileRef = doc(db, COACH_PROFILES_COLLECTION, profileId);
  await deleteDoc(profileRef);
}

// ============================================
// Directory Search & Filtering
// ============================================

/**
 * Get all published coaches with filters and pagination
 */
export async function getPublishedCoaches(
  params: CoachSearchParams,
  lastDoc?: DocumentSnapshot
): Promise<CoachSearchResult> {
  const { filters, sort, page, limit: pageSize } = params;

  // Build query constraints
  const constraints: QueryConstraint[] = [
    where('isPublished', '==', true),
  ];

  // Apply filters
  if (filters.acceptingNewClients !== undefined) {
    constraints.push(where('acceptingNewClients', '==', filters.acceptingNewClients));
  }

  if (filters.specialties && filters.specialties.length > 0) {
    // Firestore array-contains-any supports up to 10 values
    constraints.push(where('specialties', 'array-contains-any', filters.specialties.slice(0, 10)));
  }

  if (filters.languages && filters.languages.length > 0) {
    constraints.push(where('languages', 'array-contains-any', filters.languages.slice(0, 10)));
  }

  if (filters.minRating !== undefined) {
    constraints.push(where('rating', '>=', filters.minRating));
  }

  if (filters.minYearsExperience !== undefined) {
    constraints.push(where('yearsExperience', '>=', filters.minYearsExperience));
  }

  // Apply sorting
  switch (sort) {
    case 'rating_desc':
      constraints.push(orderBy('rating', 'desc'));
      break;
    case 'rating_asc':
      constraints.push(orderBy('rating', 'asc'));
      break;
    case 'reviews_desc':
      constraints.push(orderBy('reviewCount', 'desc'));
      break;
    case 'experience_desc':
      constraints.push(orderBy('yearsExperience', 'desc'));
      break;
    case 'price_asc':
      constraints.push(orderBy('sessionPrice.min', 'asc'));
      break;
    case 'price_desc':
      constraints.push(orderBy('sessionPrice.max', 'desc'));
      break;
    case 'newest':
      constraints.push(orderBy('publishedAt', 'desc'));
      break;
    case 'featured':
    default:
      constraints.push(orderBy('featured', 'desc'));
      constraints.push(orderBy('rating', 'desc'));
      break;
  }

  // Pagination
  constraints.push(limit(pageSize + 1)); // Get one extra to check if more

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  // Execute query
  const q = query(collection(db, COACH_PROFILES_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  const coaches = snapshot.docs.slice(0, pageSize).map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CoachPublicProfile[];

  // Apply client-side filters that can't be done in Firestore
  let filteredCoaches = coaches;

  // Price filter (client-side due to nested field limitations)
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    filteredCoaches = filteredCoaches.filter(coach => {
      const min = filters.priceMin ?? 0;
      const max = filters.priceMax ?? Infinity;
      return coach.sessionPrice.min >= min && coach.sessionPrice.max <= max;
    });
  }

  // Location filter (client-side)
  if (filters.location) {
    filteredCoaches = filteredCoaches.filter(coach => {
      if (filters.location?.country && coach.location.country !== filters.location.country) {
        return false;
      }
      if (filters.location?.city && coach.location.city !== filters.location.city) {
        return false;
      }
      if (filters.location?.remoteOnly && !coach.location.isRemoteOnly) {
        return false;
      }
      return true;
    });
  }

  // Text search (client-side)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredCoaches = filteredCoaches.filter(coach =>
      coach.displayName.toLowerCase().includes(searchLower) ||
      coach.headline.toLowerCase().includes(searchLower) ||
      coach.bio.toLowerCase().includes(searchLower) ||
      coach.specialties.some(s => s.toLowerCase().includes(searchLower))
    );
  }

  const hasMore = snapshot.docs.length > pageSize;
  const total = filteredCoaches.length; // Note: This is approximate for client-side filtering

  return {
    coaches: filteredCoaches,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
    hasMore,
  };
}

/**
 * Get featured coaches for homepage
 */
export async function getFeaturedCoaches(maxResults: number = 6): Promise<CoachPublicProfile[]> {
  const q = query(
    collection(db, COACH_PROFILES_COLLECTION),
    where('isPublished', '==', true),
    where('featured', '==', true),
    orderBy('featuredOrder', 'asc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CoachPublicProfile[];
}

/**
 * Get top rated coaches
 */
export async function getTopRatedCoaches(maxResults: number = 6): Promise<CoachPublicProfile[]> {
  const q = query(
    collection(db, COACH_PROFILES_COLLECTION),
    where('isPublished', '==', true),
    where('reviewCount', '>=', 3), // Minimum reviews for ranking
    orderBy('reviewCount', 'desc'),
    orderBy('rating', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CoachPublicProfile[];
}

/**
 * Get all unique specialties from published coaches
 */
export async function getAvailableSpecialties(): Promise<string[]> {
  const q = query(
    collection(db, COACH_PROFILES_COLLECTION),
    where('isPublished', '==', true)
  );

  const snapshot = await getDocs(q);
  const specialtiesSet = new Set<string>();

  snapshot.docs.forEach(doc => {
    const profile = doc.data() as CoachPublicProfile;
    profile.specialties?.forEach(s => specialtiesSet.add(s));
  });

  return Array.from(specialtiesSet).sort();
}

// ============================================
// Inquiry Management
// ============================================

/**
 * Create a new inquiry from a prospect
 */
export async function createInquiry(
  coachId: string,
  coachName: string,
  data: InquiryFormData
): Promise<string> {
  const inquiryRef = doc(collection(db, COACH_INQUIRIES_COLLECTION));

  const inquiry: Omit<CoachInquiry, 'id'> = {
    coachId,
    coachName,
    ...data,
    status: 'new',
    hasCoachingExperience: data.hasCoachingExperience ?? false,
    createdAt: serverTimestamp() as Timestamp,
  };

  await setDoc(inquiryRef, inquiry);
  return inquiryRef.id;
}

/**
 * Get all inquiries for a coach
 */
export async function getCoachInquiries(
  coachId: string,
  status?: InquiryStatus[]
): Promise<CoachInquiry[]> {
  let constraints: QueryConstraint[] = [
    where('coachId', '==', coachId),
    orderBy('createdAt', 'desc'),
  ];

  if (status && status.length > 0) {
    constraints = [
      where('coachId', '==', coachId),
      where('status', 'in', status),
      orderBy('createdAt', 'desc'),
    ];
  }

  const q = query(collection(db, COACH_INQUIRIES_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CoachInquiry[];
}

/**
 * Get inquiry by ID
 */
export async function getInquiryById(inquiryId: string): Promise<CoachInquiry | null> {
  const docRef = doc(db, COACH_INQUIRIES_COLLECTION, inquiryId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as CoachInquiry;
}

/**
 * Mark an inquiry as viewed
 */
export async function markInquiryAsViewed(inquiryId: string): Promise<void> {
  const inquiryRef = doc(db, COACH_INQUIRIES_COLLECTION, inquiryId);
  const inquiry = await getInquiryById(inquiryId);

  if (inquiry && inquiry.status === 'new') {
    await updateDoc(inquiryRef, {
      status: 'viewed',
      viewedAt: serverTimestamp(),
    });
  }
}

/**
 * Respond to an inquiry
 */
export async function respondToInquiry(
  inquiryId: string,
  response: string,
  responseType: 'accepted' | 'declined' | 'more_info'
): Promise<void> {
  const inquiryRef = doc(db, COACH_INQUIRIES_COLLECTION, inquiryId);

  await updateDoc(inquiryRef, {
    status: 'responded',
    coachResponse: response,
    responseType,
    respondedAt: serverTimestamp(),
  });
}

/**
 * Mark inquiry as converted to lead
 */
export async function markInquiryAsConverted(
  inquiryId: string,
  leadId: string
): Promise<void> {
  const inquiryRef = doc(db, COACH_INQUIRIES_COLLECTION, inquiryId);

  await updateDoc(inquiryRef, {
    status: 'converted',
    convertedToLeadId: leadId,
    convertedAt: serverTimestamp(),
  });
}

/**
 * Decline an inquiry
 */
export async function declineInquiry(
  inquiryId: string,
  reason: string
): Promise<void> {
  const inquiryRef = doc(db, COACH_INQUIRIES_COLLECTION, inquiryId);

  await updateDoc(inquiryRef, {
    status: 'declined',
    declineReason: reason,
    respondedAt: serverTimestamp(),
  });
}

/**
 * Get inquiry counts by status for a coach
 */
export async function getInquiryCounts(coachId: string): Promise<Record<InquiryStatus, number>> {
  const inquiries = await getCoachInquiries(coachId);

  const counts: Record<InquiryStatus, number> = {
    new: 0,
    viewed: 0,
    responded: 0,
    converted: 0,
    declined: 0,
  };

  inquiries.forEach(inquiry => {
    counts[inquiry.status]++;
  });

  return counts;
}

// ============================================
// Stats & Analytics
// ============================================

/**
 * Update coach profile stats (called after reviews, sessions, etc.)
 */
export async function updateCoachStats(
  profileId: string,
  updates: {
    rating?: number;
    reviewCount?: number;
    totalClients?: number;
    totalSessions?: number;
    successRate?: number;
  }
): Promise<void> {
  const profileRef = doc(db, COACH_PROFILES_COLLECTION, profileId);

  await updateDoc(profileRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Increment review count and update average rating
 */
export async function addReviewToProfile(
  profileId: string,
  newRating: number
): Promise<void> {
  const profile = await getCoachProfileById(profileId);
  if (!profile) return;

  const currentTotal = profile.rating * profile.reviewCount;
  const newCount = profile.reviewCount + 1;
  const newAverage = (currentTotal + newRating) / newCount;

  await updateCoachStats(profileId, {
    rating: Math.round(newAverage * 10) / 10, // Round to 1 decimal
    reviewCount: newCount,
  });
}

// ============================================
// Admin Functions
// ============================================

/**
 * Get all coach profiles (admin view)
 */
export async function getAllCoachProfiles(): Promise<CoachPublicProfile[]> {
  const q = query(
    collection(db, COACH_PROFILES_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CoachPublicProfile[];
}

/**
 * Feature or unfeature a coach profile (admin)
 */
export async function setCoachFeatured(
  profileId: string,
  featured: boolean,
  order?: number
): Promise<void> {
  const profileRef = doc(db, COACH_PROFILES_COLLECTION, profileId);

  await updateDoc(profileRef, {
    featured,
    featuredOrder: order ?? 0,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Get all inquiries (admin view)
 */
export async function getAllInquiries(): Promise<CoachInquiry[]> {
  const q = query(
    collection(db, COACH_INQUIRIES_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(100)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CoachInquiry[];
}

// ============================================
// Initialization Helpers
// ============================================

/**
 * Create initial profile data structure for a new coach
 */
export function getDefaultProfileData(displayName: string, email: string): CoachProfileFormData {
  return {
    displayName,
    headline: '',
    bio: '',
    shortBio: '',
    photoURL: '',
    specialties: [],
    certifications: [],
    languages: ['Español'],
    yearsExperience: 0,
    sessionPrice: DEFAULT_PRICE_RANGE,
    availability: DEFAULT_AVAILABILITY,
    location: {
      city: '',
      country: '',
      timezone: 'America/Mexico_City',
      isRemoteOnly: true,
    },
    worksWith: [],
    industries: [],
    methodology: [],
    isPublished: false,
    acceptingNewClients: true,
  };
}
