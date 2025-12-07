'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Target } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="border-b border-gray-100 bg-white" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="AchievingCoach Home">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold text-gray-900">AchievingCoach</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/features" className={`text-sm ${isActive('/features') ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>Features</Link>
          <Link href="/pricing" className={`text-sm ${isActive('/pricing') ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>Pricing</Link>
          <Link href="/about" className={`text-sm ${isActive('/about') ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>About</Link>
          <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log In</Link>
          <Link href="/sign-up" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">Start Free Trial</Link>
        </div>
      </div>
    </nav>
  );
}
