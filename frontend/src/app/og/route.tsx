import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Dynamic parameters
  const title = searchParams.get('title') || 'AchievingCoach';
  const description = searchParams.get('description') || 'Professional Coaching Platform';
  const type = searchParams.get('type') || 'default'; // default, tool, blog, pricing

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            <span style={{ fontSize: 40, color: 'white' }}>AC</span>
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
            }}
          >
            AchievingCoach
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 900,
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: type === 'blog' ? 52 : 64,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
              margin: 0,
              marginBottom: 20,
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: 28,
              color: '#9ca3af',
              margin: 0,
              maxWidth: 800,
            }}
          >
            {description}
          </p>
        </div>

        {/* Footer badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {type === 'tool' && (
            <span
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Coaching Tool
            </span>
          )}
          {type === 'blog' && (
            <span
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Blog Article
            </span>
          )}
          <span
            style={{
              color: '#6b7280',
              fontSize: 18,
            }}
          >
            achievingcoach.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
