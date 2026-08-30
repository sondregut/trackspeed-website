export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  lastModified: string;
  category: string;
  readTime: string;
  relatedSlugs?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-app-for-tracking-sprint-speed",
    title: "Best App for Tracking Sprint Speed for Sprinters (2026)",
    excerpt:
      "A fair comparison of sprint timing, photo-finish, reaction, stride, GPS, and technique-analysis apps—with the best choice for each training job.",
    date: "2026-08-09",
    lastModified: "2026-08-09",
    category: "Comparisons",
    readTime: "9 min read",
    relatedSlugs: ["single-beam-vs-dual-beam-timing-gates", "flying-10-meter-sprint-test"],
  },
  {
    slug: "single-beam-vs-dual-beam-timing-gates",
    title: "Single-Beam vs Dual-Beam Timing Gates: Accuracy Compared",
    excerpt:
      "A research-backed analysis of single-beam, dual-beam, transponder, camera, and FAT timing—and why their sprint results should not be mixed.",
    date: "2026-08-09",
    lastModified: "2026-08-24",
    category: "Technology",
    readTime: "10 min read",
    relatedSlugs: ["best-app-for-tracking-sprint-speed", "flying-10-meter-sprint-test"],
  },
  {
    slug: "flying-10-meter-sprint-test",
    title: "Flying 10-Meter Sprint Test: Setup, Timing, and Protocol",
    excerpt:
      "A repeatable flying 10m test protocol for measuring maximum velocity, including runway setup, recovery, phone placement, and result tracking.",
    date: "2026-08-09",
    lastModified: "2026-08-09",
    category: "Guides",
    readTime: "7 min read",
    relatedSlugs: ["best-app-for-tracking-sprint-speed", "single-beam-vs-dual-beam-timing-gates"],
  },
  {
    slug: "how-to-time-a-40-yard-dash",
    title: "How to Time a 40-Yard Dash Accurately with Your Phone",
    excerpt:
      "Learn how to get reliable, repeatable 40-yard dash times using just your phone — no expensive laser gates or stopwatch errors.",
    date: "2026-02-10",
    lastModified: "2026-08-09",
    category: "Guides",
    readTime: "5 min read",
    relatedSlugs: ["multi-phone-sprint-timing-setup", "improve-sprint-speed-training"],
  },
  {
    slug: "multi-phone-sprint-timing-setup",
    title: "How to Set Up Multi-Phone Sprint Timing for Track Practice",
    excerpt:
      "Step-by-step guide to setting up two phones for split timing at start and finish lines during track practice.",
    date: "2026-02-05",
    lastModified: "2026-08-09",
    category: "Guides",
    readTime: "4 min read",
    relatedSlugs: ["how-to-time-a-40-yard-dash", "improve-sprint-speed-training"],
  },
  {
    slug: "improve-sprint-speed-training",
    title: "4 Sprint Training Drills That Benefit from Accurate Timing",
    excerpt:
      "Specific drills where having precise, consistent timing data makes the difference between guessing and knowing your progress.",
    date: "2026-02-03",
    lastModified: "2026-02-03",
    category: "Training",
    readTime: "5 min read",
    relatedSlugs: ["how-to-time-a-40-yard-dash", "multi-phone-sprint-timing-setup"],
  },
  {
    slug: "what-is-photo-finish-timing",
    title: "What Is Photo Finish Timing and How Does It Work?",
    excerpt:
      "A clear explanation of photo finish technology — from Olympic-grade line-scan cameras to modern smartphone-based approaches.",
    date: "2026-02-01",
    lastModified: "2026-08-09",
    category: "Technology",
    readTime: "5 min read",
    relatedSlugs: ["single-beam-vs-dual-beam-timing-gates", "best-app-for-tracking-sprint-speed"],
  },
];
