import Image from "next/image";

type PhoneMockupProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
};

export default function PhoneMockup({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes = "(max-width: 768px) 72vw, 320px",
}: PhoneMockupProps) {
  return (
    <div
      className={[
        "relative rounded-[52px] bg-[linear-gradient(145deg,#343842,#0b0d11_54%,#3a3e46)] p-[10px] shadow-[0_34px_90px_-48px_rgba(15,23,42,0.75),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-4px_18px_rgba(0,0,0,0.48)]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-[6px] rounded-[47px] border border-white/14" />
      <div className="overflow-hidden rounded-[42px] bg-[#F5F6FA]">
        <Image
          src={src}
          alt={alt}
          width={660}
          height={1434}
          sizes={sizes}
          className={["h-auto w-full", imageClassName].join(" ")}
        />
      </div>
    </div>
  );
}
