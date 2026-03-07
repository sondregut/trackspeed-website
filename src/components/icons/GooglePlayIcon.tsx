export default function GooglePlayIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" fill="#4285F4" />
      <path d="M14.499 12.707l2.302 2.302-10.937 6.333 8.635-8.635z" fill="#34A853" />
      <path d="M17.698 11.255l2.585 1.497a1 1 0 0 1 0 1.496l-2.585 1.497-2.606-2.606 2.606-2.884z" fill="#FBBC04" />
      <path d="M5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" fill="#EA4335" />
    </svg>
  );
}
