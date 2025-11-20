'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Check, UserPlus } from 'lucide-react';

export default function InviteCoacheesPage() {
  const { userProfile } = useAuth();
  const [copied, setCopied] = useState(false);

  const inviteLink = userProfile?.uid 
    ? `${window.location.origin}/join/${userProfile.uid}`
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite Coachees</h1>
          <p className="text-gray-600">Share your unique link to invite clients to your coaching practice</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary-100 rounded-lg">
              <UserPlus className="text-primary-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Invitation Link</h2>
              <p className="text-sm text-gray-600">Anyone with this link can join as your coachee</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between gap-4">
              <code className="flex-1 text-sm text-gray-900 break-all">
                {inviteLink}
              </code>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-white font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Copy your invitation link</p>
                <p className="text-sm text-blue-700">Use the button above to copy the link to your clipboard</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-white font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Share with potential clients</p>
                <p className="text-sm text-blue-700">Send via email, social media, or your website</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-white font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">They sign up automatically</p>
                <p className="text-sm text-blue-700">New coachees will be assigned to you when they register</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <h3 className="font-bold text-yellow-900 mb-2">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Share your link on your professional social media profiles</li>
            <li>• Include it in your email signature</li>
            <li>• Add it to your coaching website or landing page</li>
            <li>• Send directly to people interested in coaching services</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
