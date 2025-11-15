import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <nav className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600">AchievingCoach</h1>
          <div className="space-x-4">
            <Link href="/sign-in" className="text-gray-600 hover:text-primary-600">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Elevate Your Coaching Practice
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            The operating system for professional coaching. Manage clients, track progress,
            and deliver transformative results with our cloud-native platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700"
            >
              Start Free Trial
            </Link>
            <Link
              href="/product"
              className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">Client Management</h3>
            <p className="text-gray-600">
              Organize all your coaching relationships in one place with comprehensive client profiles.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">Coaching Tools</h3>
            <p className="text-gray-600">
              Access evidence-based frameworks like GROW Model, Wheel of Life, and more.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4">Progress Tracking</h3>
            <p className="text-gray-600">
              Measure outcomes with analytics and insights that demonstrate real impact.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
