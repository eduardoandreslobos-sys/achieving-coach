import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AchievingCoach - Professional Coaching Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
        {/* Logo */}
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
              width: 100,
              height: 100,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 24,
              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
            }}
          >
            <span style={{ fontSize: 50, color: 'white', fontWeight: 700 }}>AC</span>
          </div>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            AchievingCoach
          </span>
        </div>

        {/* Tagline */}
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
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              margin: 0,
              marginBottom: 24,
            }}
          >
            Executive Coaching Platform
          </h1>

          <p
            style={{
              fontSize: 26,
              color: '#9ca3af',
              margin: 0,
              maxWidth: 700,
            }}
          >
            AI-powered insights, 12+ professional tools, and ICF-aligned methodology
          </p>
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 48,
          }}
        >
          {['DISC Assessment', 'Wheel of Life', 'GROW Model', 'AI Insights'].map((feature) => (
            <span
              key={feature}
              style={{
                background: '#1f2937',
                color: '#d1d5db',
                padding: '12px 24px',
                borderRadius: 100,
                fontSize: 18,
                fontWeight: 500,
                border: '1px solid #374151',
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              color: '#6b7280',
              fontSize: 20,
            }}
          >
            achievingcoach.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
