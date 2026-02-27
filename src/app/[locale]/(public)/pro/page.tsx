"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function ProPageContent() {
  const searchParams = useSearchParams();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Get offer from URL params (e.g., /pro?offer=yearly_20_off)
    const offer = searchParams.get("offer") || "yearly_20_off";
    const deepLink = `trackspeed://promo?offer=${offer}`;

    // Try to open the app
    window.location.href = deepLink;

    // Show fallback after a short delay if app didn't open
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleOpenApp = () => {
    const offer = searchParams.get("offer") || "yearly_20_off";
    window.location.href = `trackspeed://promo?offer=${offer}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {!showFallback ? (
          <>
            <div className="animate-pulse mb-6">
              <div className="w-16 h-16 mx-auto bg-[#5C8DB8] rounded-2xl flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Opening TrackSpeed...
            </h1>
            <p className="text-gray-400">Redirecting to your special offer</p>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-[#5C8DB8] rounded-2xl flex items-center justify-center shadow-lg shadow-[#5C8DB8]/30">
                <span className="text-4xl">🏃</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Get TrackSpeed
            </h1>
            <p className="text-gray-300 mb-2">
              Professional sprint timing on your iPhone
            </p>
            <div className="bg-[#5C8DB8]/20 border border-[#5C8DB8]/50 rounded-lg p-4 mb-6">
              <p className="text-[#8BB8E0] font-semibold">
                Special Offer: 20% Off Pro
              </p>
              <p className="text-[#8BB8E0]/80 text-sm">
                Download the app to claim your discount
              </p>
            </div>
            <a
              href="https://apps.apple.com/app/trackspeed/id6757509163"
              className="inline-block bg-[#5C8DB8] hover:bg-[#4A7BA6] text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Download on App Store
            </a>
            <p className="text-gray-500 text-sm mt-4">
              Already have the app?{" "}
              <button
                onClick={handleOpenApp}
                className="text-[#5C8DB8] hover:underline"
              >
                Open TrackSpeed
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="animate-pulse mb-6">
          <div className="w-16 h-16 mx-auto bg-[#5C8DB8] rounded-2xl flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
      </div>
    </div>
  );
}

export default function ProPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProPageContent />
    </Suspense>
  );
}
