import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db, isFirebaseAvailable } from '@/lib/firebase';

/**
 * API endpoint to publish scheduled blog posts
 * Called by Cloud Scheduler or manually to publish posts whose scheduled time has passed
 *
 * GET: Check scheduled posts (dry run)
 * POST: Actually publish scheduled posts
 */

export async function GET() {
  if (!isFirebaseAvailable) {
    return NextResponse.json({ error: 'Firebase not available' }, { status: 500 });
  }

  try {
    const now = new Date();
    const q = query(
      collection(db, 'blog_posts'),
      where('scheduledAt', '<=', Timestamp.fromDate(now)),
      where('published', '==', false)
    );

    const snapshot = await getDocs(q);
    const scheduledPosts = snapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      scheduledAt: doc.data().scheduledAt?.toDate(),
    }));

    return NextResponse.json({
      message: 'Scheduled posts ready to publish',
      count: scheduledPosts.length,
      posts: scheduledPosts,
      checkedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Error checking scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to check scheduled posts', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Optional: Add authentication for cron jobs
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'publish-cron-2024';

  // Allow if authorized or if it's a local/development request
  const isAuthorized = authHeader === `Bearer ${cronSecret}`;

  if (!isAuthorized && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isFirebaseAvailable) {
    return NextResponse.json({ error: 'Firebase not available' }, { status: 500 });
  }

  try {
    const now = new Date();
    const q = query(
      collection(db, 'blog_posts'),
      where('scheduledAt', '<=', Timestamp.fromDate(now)),
      where('published', '==', false)
    );

    const snapshot = await getDocs(q);
    const results: { published: string[]; errors: string[] } = {
      published: [],
      errors: [],
    };

    for (const docSnapshot of snapshot.docs) {
      try {
        await updateDoc(doc(db, 'blog_posts', docSnapshot.id), {
          published: true,
          scheduledAt: null,
          updatedAt: new Date(),
        });
        results.published.push(docSnapshot.data().title);
      } catch (error) {
        results.errors.push(`${docSnapshot.data().title}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Published ${results.published.length} posts`,
      results,
      processedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Error publishing scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to publish scheduled posts', details: String(error) },
      { status: 500 }
    );
  }
}
