import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#3D3D3D] bg-[#0e1316]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/icon.png"
                alt="TrackSpeed"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold">TrackSpeed</span>
            </Link>
            <p className="text-[#787774] text-sm max-w-xs">
              Professional sprint timing using your iPhone. No extra hardware needed.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-[#9B9A97] hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-[#9B9A97] hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <a
                  href="https://apps.apple.com/app/trackspeed"
                  className="text-[#9B9A97] hover:text-white transition-colors"
                >
                  Download
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support" className="text-[#9B9A97] hover:text-white transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#9B9A97] hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#9B9A97] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#3D3D3D] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#787774] text-sm">
            &copy; {new Date().getFullYear()} TrackSpeed. All rights reserved.
          </p>
          <p className="text-[#5C8DB8] text-sm">
            Made for athletes, by athletes.
          </p>
        </div>
      </div>
    </footer>
  );
}
