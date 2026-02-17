export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  lastModified: string;
  category: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "sprint-timing-gates-buyers-guide",
    title: "Sprint Timing Systems Buyer's Guide: Gates, Apps, and Stopwatches Compared",
    excerpt:
      "Why spend $2,500 on timing gates when your iPhone delivers the same training accuracy for free? Complete comparison of laser gates, camera-based timing, and stopwatches.",
    date: "2026-02-17",
    lastModified: "2026-02-17",
    category: "Comparisons",
    readTime: "8 min read",
  },
  {
    slug: "how-to-time-a-40-yard-dash",
    title: "How to Time a 40-Yard Dash Accurately with Your Phone",
    excerpt:
      "Learn how to get reliable, repeatable 40-yard dash times using just your iPhone — no expensive laser gates or stopwatch errors.",
    date: "2026-02-10",
    lastModified: "2026-02-10",
    category: "Guides",
    readTime: "5 min read",
  },
  {
    slug: "sprint-timing-systems-compared",
    title: "Sprint Timing Systems Compared: Laser Gates vs Camera vs Stopwatch",
    excerpt:
      "An objective comparison of the most common sprint timing methods — accuracy, cost, consistency, and which is best for your situation.",
    date: "2026-02-08",
    lastModified: "2026-02-08",
    category: "Comparisons",
    readTime: "7 min read",
  },
  {
    slug: "multi-phone-sprint-timing-setup",
    title: "How to Set Up Multi-Phone Sprint Timing for Track Practice",
    excerpt:
      "Step-by-step guide to setting up two iPhones for split timing at start and finish lines during track practice.",
    date: "2026-02-05",
    lastModified: "2026-02-05",
    category: "Guides",
    readTime: "4 min read",
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
  },
  {
    slug: "what-is-photo-finish-timing",
    title: "What Is Photo Finish Timing and How Does It Work?",
    excerpt:
      "A clear explanation of photo finish technology — from Olympic-grade line-scan cameras to modern smartphone-based approaches.",
    date: "2026-02-01",
    lastModified: "2026-02-01",
    category: "Technology",
    readTime: "5 min read",
  },
];
