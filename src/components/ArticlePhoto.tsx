import Image from "next/image";

/** A real setup photo inside a guide, with a short caption. Narrow suits portrait phone shots. */
export default function ArticlePhoto({src, width, height, alt, caption, narrow = false}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  narrow?: boolean;
}) {
  return <figure className={narrow ? "mx-auto mb-6 max-w-[240px]" : "mb-6"}>
    <Image src={src} width={width} height={height} alt={alt} sizes={narrow ? "240px" : "(max-width: 768px) 100vw, 720px"} className="h-auto w-full rounded-xl"/>
    <figcaption className="mt-2 text-center text-xs" style={{color: "var(--text-muted)"}}>{caption}</figcaption>
  </figure>;
}
