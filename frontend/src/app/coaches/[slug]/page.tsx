import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCoachBySlug } from '@/services/directory.service';
import CoachProfileContent from './CoachProfileContent';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const coach = await getCoachBySlug(params.slug);

  if (!coach) {
    return {
      title: 'Coach no encontrado | Achieving Coach',
    };
  }

  const description = coach.shortBio || coach.headline || `${coach.displayName} - Coach profesional certificado`;

  return {
    title: `${coach.displayName} - Coach ${coach.specialties[0] || 'Profesional'} | Achieving Coach`,
    description,
    openGraph: {
      title: coach.displayName,
      description,
      type: 'profile',
      images: coach.photoURL ? [{ url: coach.photoURL }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: coach.displayName,
      description,
      images: coach.photoURL ? [coach.photoURL] : [],
    },
  };
}

export default async function CoachProfilePage({ params }: Props) {
  const coach = await getCoachBySlug(params.slug);

  if (!coach) {
    notFound();
  }

  return <CoachProfileContent coach={coach} />;
}
