'use client'

import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setError(false)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API or in non-secure context
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-6 py-3 bg-[#F5F5F7] rounded-full border border-[#E5E5E7] hover:bg-[#E5E5E7] transition-colors"
    >
      <span className="text-xl font-semibold text-[#1D1D1F] tracking-wider">
        {code}
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={copied ? 'text-[#34C759]' : 'text-[#007AFF]'}
      >
        {copied ? (
          <path
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            fill="currentColor"
          />
        ) : (
          <path
            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
            fill="currentColor"
          />
        )}
      </svg>
      {copied && (
        <span className="text-sm text-[#34C759] font-medium">Copied!</span>
      )}
      {error && (
        <span className="text-sm text-[#FF3B30] font-medium">Failed</span>
      )}
    </button>
  )
}
