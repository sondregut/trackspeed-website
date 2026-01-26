import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sondre Guttormsen",
      role: "Olympic Pole Vaulter",
      image: "/testimonials/sondre-guttormsen.jpg",
      instagram: "https://instagram.com/sondre_pv",
      quote:
        "I use TrackSpeed to dial in my run-up before competitions. The accuracy is impressive and I always know exactly what speed I'm hitting at takeoff.",
      hasRealImage: true,
    },
    {
      name: "Andreas Trajkovski",
      role: "Macedonian Long Jump Record Holder",
      image: "/testimonials/andreas-trajkovski.jpg",
      instagram: "https://instagram.com/andreas_trajkovski",
      quote:
        "As a long jumper, speed is everything. I time all my sprints with TrackSpeed and love how quick and easy it is to set up. It even tracks my long jump takeoff speed!",
      hasRealImage: true,
    },
    {
      name: "David Okonkwo",
      role: "Speed Coach",
      image: "/testimonials/coach-2.jpg",
      instagram: "https://instagram.com/coach_david",
      quote:
        "The multi-device sync is incredible. I can time splits at 10m, 20m, and 40m all at once.",
      hasRealImage: false,
    },
    {
      name: "Emma Rodriguez",
      role: "High School Coach",
      image: "/testimonials/coach-3.jpg",
      instagram: "https://instagram.com/coach_emma",
      quote:
        "My whole team uses this now. Way more accurate than hand timing and the kids love seeing their times instantly.",
      hasRealImage: false,
    },
    {
      name: "James Wilson",
      role: "400m Specialist",
      image: "/testimonials/athlete-2.jpg",
      instagram: "https://instagram.com/james_400m",
      quote:
        "TrackSpeed helped me shave 0.3s off my 400m. Being able to analyze my split times changed everything.",
      hasRealImage: false,
    },
    {
      name: "Coach Mike Davis",
      role: "Club Athletics",
      image: "/testimonials/coach-4.jpg",
      instagram: "https://instagram.com/coachmike",
      quote:
        "Best timing app I've used. The accuracy rivals equipment that costs 10x more.",
      hasRealImage: false,
    },
  ];

  return (
    <section className="pt-6 md:pt-8 pb-28 md:pb-36 px-6 bg-sky-wash">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-section mb-4">Loved by your favorite olympians</h2>
          <p className="text-body max-w-2xl mx-auto">
            From high school track to the Olympic Games
          </p>
        </div>

        {/* Testimonial cards - 2 row masonry grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {/* Row 1 */}
          <div className="md:mt-6">
            <TestimonialCard testimonial={testimonials[0]} variant="dark" />
          </div>
          <div className="md:-mt-2">
            <TestimonialCard testimonial={testimonials[1]} variant="light" />
          </div>
          <div className="md:mt-10">
            <TestimonialCard testimonial={testimonials[2]} variant="dark" />
          </div>

          {/* Row 2 */}
          <div className="md:-mt-8">
            <TestimonialCard testimonial={testimonials[3]} variant="dark" />
          </div>
          <div className="md:-mt-16">
            <TestimonialCard testimonial={testimonials[4]} variant="light" />
          </div>
          <div className="md:-mt-4">
            <TestimonialCard testimonial={testimonials[5]} variant="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  variant = "dark",
}: {
  testimonial: {
    name: string;
    role: string;
    image: string;
    instagram: string;
    quote: string;
    hasRealImage: boolean;
  };
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";

  return (
    <a
      href={testimonial.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative rounded-3xl overflow-hidden aspect-[3/4] group cursor-pointer"
      style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Background image or placeholder */}
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
        {testimonial.hasRealImage ? (
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: isDark
                ? "linear-gradient(160deg, #374151 0%, #1F2937 100%)"
                : "linear-gradient(160deg, #F3F4F6 0%, #E5E7EB 100%)",
            }}
          >
            {/* Placeholder icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg
                className="w-28 h-28"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Instagram icon on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      </div>

      {/* Quote overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div
          className="rounded-2xl p-4"
          style={{
            background: testimonial.hasRealImage
              ? "rgba(17, 24, 39, 0.85)"
              : isDark
                ? "rgba(17, 24, 39, 0.85)"
                : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: testimonial.hasRealImage
              ? "1px solid rgba(55, 65, 81, 0.5)"
              : isDark
                ? "1px solid rgba(55, 65, 81, 0.5)"
                : "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          {/* Quote marks */}
          <div className="flex gap-0.5 mb-2">
            <div
              className="w-1 h-2.5 rounded-sm"
              style={{ background: "#3B82F6" }}
            ></div>
            <div
              className="w-1 h-2.5 rounded-sm"
              style={{ background: "#3B82F6" }}
            ></div>
          </div>

          {/* Name */}
          <div
            className="font-semibold text-sm mb-0.5"
            style={{
              color:
                testimonial.hasRealImage || isDark
                  ? "#F9FAFB"
                  : "var(--text-primary)",
            }}
          >
            {testimonial.name}
          </div>

          {/* Role */}
          <div
            className="text-xs mb-2"
            style={{
              color:
                testimonial.hasRealImage || isDark
                  ? "#9CA3AF"
                  : "var(--text-muted)",
            }}
          >
            {testimonial.role}
          </div>

          {/* Quote */}
          <p
            className="text-xs leading-relaxed"
            style={{
              color:
                testimonial.hasRealImage || isDark
                  ? "#D1D5DB"
                  : "var(--text-secondary)",
            }}
          >
            {testimonial.quote}
          </p>
        </div>
      </div>
    </a>
  );
}
